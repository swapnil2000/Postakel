import { Request, Response } from 'express';
// --- FIX: Use a direct relative path to the generated master client ---
import { PrismaClient as MasterPrismaClient } from '../generated/master';
import { createTenantDatabaseAndUser, getTenantPrismaClient, runMigrationsForTenant, dropTenantDatabaseAndUser } from '../utils/dbManager';
import bcrypt from 'bcryptjs';

const masterPrisma = new MasterPrismaClient();

async function generateUniqueRestaurantId(): Promise<string> {
  let isUnique = false;
  let restaurantId = '';
  while (!isUnique) {
    restaurantId = Math.floor(1000000 + Math.random() * 9000000).toString();
    const existingTenant = await masterPrisma.tenant.findUnique({ where: { restaurantId } });
    if (!existingTenant) { isUnique = true; }
  }
  return restaurantId;
}

export async function signup(req: Request, res: Response) {
  const { restaurantName, adminName, email, password, confirmPassword, useRedis } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  let restaurantId: string | null = null;
  let dbName: string | null = null;
  let dbUser: string | null = null;

  try {
    const existingTenant = await masterPrisma.tenant.findUnique({ where: { email } });
    if (existingTenant) {
      return res.status(409).json({ message: 'A restaurant with this email already exists.' });
    }

    // 1. Generate unique identifiers
    restaurantId = await generateUniqueRestaurantId();
    dbName = `tenant_${restaurantId}`;
    dbUser = `user_${restaurantId}`;
    const dbPassword = `pass_${Math.random().toString(36).slice(-8)}`;

    // 2. Create DB and User in PostgreSQL
    await createTenantDatabaseAndUser(dbName, dbUser, dbPassword);

    // 3. Create tenant record in Master DB
    const newTenant = await masterPrisma.tenant.create({
      data: { name: restaurantName, email, restaurantId, dbName, dbUser, dbPassword, useRedis: useRedis || false },
    });

    // 4. Apply migrations to the new tenant DB
    await runMigrationsForTenant(dbName);

    // 5. Connect to the new tenant DB to seed initial data
    const tenantPrisma = getTenantPrismaClient(dbName);

    // 6. Seed Admin Role
    const adminRole = await tenantPrisma.role.create({
      data: { name: 'Admin', permissions: ['all_access'] },
    });

    // 7. Seed Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await tenantPrisma.staff.create({
      data: {
        name: adminName,
        email,
        password: hashedPassword,
        // --- FIX: Add missing required fields from the schema ---
        phone: "",   // Provide a default empty string for the phone number
        pin: "0000", // Provide a default PIN for the admin user
        role: {
          connect: {
            id: adminRole.id,
          },
        },
      },
    });

    // 8. Seed Restaurant Settings
    await tenantPrisma.restaurant.create({
      data: { id: restaurantId, name: restaurantName },
    });

    res.status(201).json({ message: 'Restaurant created successfully!', restaurantId: newTenant.restaurantId });

  } catch (error: any) {
    console.error('Signup failed:', error);
    // Cleanup logic in case of failure
    if (restaurantId && dbName && dbUser) {
      console.log(`Attempting to clean up resources for failed signup of restaurantId: ${restaurantId}`);
      try {
        await dropTenantDatabaseAndUser(dbName, dbUser);
        // Also remove the record from the master DB if it was created
        await masterPrisma.tenant.delete({ where: { restaurantId } }).catch(() => {});
        console.log(`Cleanup successful for restaurantId: ${restaurantId}`);
      } catch (cleanupError) {
        console.error(`CRITICAL: Failed to clean up resources for restaurantId: ${restaurantId}`, cleanupError);
      }
    }
    res.status(500).json({ message: 'Failed to create restaurant.', error: error.message });
  }
}
