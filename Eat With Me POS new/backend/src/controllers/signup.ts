import { Request, Response } from 'express';
import {
  createTenantDatabaseAndUser,
  getTenantPrismaClient,
  runMigrationsForTenant,
  dropTenantDatabaseAndUser,
} from '../utils/dbManager';
import bcrypt from 'bcryptjs';
import { getMasterPrisma } from '../utils/masterPrisma';
import { extractPlanId, MissingPlanSelectionError } from '../utils/signupValidation';

const masterPrisma = getMasterPrisma();

const DEFAULT_ADMIN_MODULES = [
  'dashboard',
  'pos',
  'tables',
  'menu',
  'kitchen',
  'inventory',
  'reports',
  'staff',
  'customers',
  'reservations',
  'online-orders',
];

function calculateRenewalDate(trialDays: number, billingCycle: string) {
  const date = new Date();
  if (trialDays > 0) {
    date.setDate(date.getDate() + trialDays);
    return date;
  }

  if (billingCycle === 'ANNUAL') {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date;
}

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
  const {
    restaurantName,
    adminName,
    email,
    password,
    confirmPassword,
    useRedis,
    country,
    phone,
    address,
    plan: rawPlan,
  } = req.body;

  const normalizedUseRedis = typeof useRedis === 'string'
    ? useRedis.toLowerCase() === 'true'
    : Boolean(useRedis);
  const confirmedPassword = confirmPassword ?? password;

  console.info('[Signup] Incoming request', {
    restaurantName,
    adminName,
    email,
    country,
    useRedis: normalizedUseRedis,
    hasPassword: Boolean(password),
    hasConfirmPassword: Boolean(confirmPassword),
  });

  if (!password) {
    console.warn('[Signup] Missing password', { email });
    return res.status(400).json({ message: 'Password is required' });
  }

  if (password !== confirmedPassword) {
    console.warn('[Signup] Password mismatch detected', { email });
    return res.status(400).json({ message: "Passwords do not match" });
  }

  let restaurantId: string | null = null;
  let dbName: string | null = null;
  let dbUser: string | null = null;

  try {
    console.info('[Signup] Checking for existing tenant', { email });
    const existingTenant = await masterPrisma.tenant.findUnique({ where: { email } });
    if (existingTenant) {
      console.warn('[Signup] Tenant already exists', { email, restaurantId: existingTenant.restaurantId });
      return res.status(409).json({ message: 'A restaurant with this email already exists.' });
    }

    let planId: string;
    try {
      planId = extractPlanId(rawPlan);
    } catch (error) {
      const message = error instanceof MissingPlanSelectionError
        ? 'Please select a subscription plan to continue.'
        : 'Invalid plan selection.';
      console.warn('[Signup] Missing plan selection', { email });
      return res.status(400).json({ message });
    }

    const plan = await masterPrisma.servicePlan.findFirst({
      where: {
        id: planId,
        isActive: true,
      },
    });

    if (!plan) {
      console.warn('[Signup] Plan not found', { email, planId });
      return res.status(400).json({ message: 'Selected plan is not available. Please choose another plan.' });
    }

    const planModules: string[] = Array.isArray(plan.allowedModules)
      ? plan.allowedModules.filter((moduleKey) => Boolean(moduleKey))
      : [];

    // 1. Generate unique identifiers
    console.info('[Signup] Generating identifiers');
    restaurantId = await generateUniqueRestaurantId();
    dbName = `tenant_${restaurantId}`;
    dbUser = `user_${restaurantId}`;
    const dbPassword = `pass_${Math.random().toString(36).slice(-8)}`;

    // 2. Create DB and User in PostgreSQL
    console.info('[Signup] Creating tenant database and user', { restaurantId, dbName, dbUser });
    await createTenantDatabaseAndUser(dbName, dbUser, dbPassword);

    // 3. Create tenant record in Master DB
    console.info('[Signup] Creating tenant record in master DB', { restaurantId });
  const newTenant = await masterPrisma.tenant.create({
      data: {
        name: restaurantName,
        email,
        restaurantId,
        dbName,
        dbUser,
        dbPassword,
        useRedis: normalizedUseRedis,
        posType: plan.posType,
        status: plan.trialPeriodDays > 0 ? 'TRIAL' : 'ACTIVE',
        country: country || null,
        contactName: adminName || null,
        contactPhone: phone || null,
        billingEmail: email,
        onboardingCompleted: false,
        notes: address || null,
      },
    });

    const tenantPlanStart = new Date();
    const renewalDate = calculateRenewalDate(plan.trialPeriodDays, plan.defaultBillingCycle);

  await masterPrisma.tenantPlan.create({
      data: {
        tenantId: newTenant.id,
        planId: plan.id,
        status: plan.trialPeriodDays > 0 ? 'TRIAL' : 'ACTIVE',
        billingCycle: plan.defaultBillingCycle,
        startDate: tenantPlanStart,
        renewalDate,
        monthlyRevenueCents: plan.monthlyPriceCents,
        totalRevenueCents: 0,
        transactionsCount: 0,
        allowedModulesSnapshot: planModules,
      },
    });

    if (planModules.length > 0) {
  await masterPrisma.tenantModule.createMany({
        data: planModules.map((moduleKey) => ({
          tenantId: newTenant.id,
          moduleKey,
          status: 'ACTIVE',
        })),
      });
    }

    // 4. Apply migrations to the new tenant DB
    console.info('[Signup] Running migrations for tenant', { restaurantId });
    try {
      await runMigrationsForTenant(dbName);
    } catch (migrationError) {
      console.error('[Signup] Migration failed', { restaurantId, error: migrationError });
      await dropTenantDatabaseAndUser(dbName, dbUser);
      return res.status(500).json({ message: 'Failed to initialize tenant database.' });
    }

    // 5. Connect to the new tenant DB to seed initial data
  console.info('[Signup] Connecting to tenant DB', { restaurantId });
    const tenantPrisma = getTenantPrismaClient(dbName);

    // 6. Seed Admin Role
  console.info('[Signup] Seeding admin role', { restaurantId });
  const adminRole = await tenantPrisma.role.create({
      data: {
        name: 'Admin',
        permissions: ['all_access'],
        dashboardModules: planModules.length > 0 ? planModules : DEFAULT_ADMIN_MODULES,
      } as any,
    });

    // 7. Seed Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

  console.info('[Signup] Seeding admin user', { restaurantId, adminEmail: email });
  await tenantPrisma.staff.create({
      data: {
        name: adminName,
        email,
        password: hashedPassword,
        phone: phone || '',
        pin: '0000',
        permissions: ['all_access'],
        dashboardModules: planModules.length > 0 ? planModules : DEFAULT_ADMIN_MODULES,
        role: {
          connect: {
            id: adminRole.id,
          },
        },
      } as any,
    });

    // 8. Seed Restaurant Settings with sensible defaults
  console.info('[Signup] Seeding restaurant settings', { restaurantId });
  await tenantPrisma.restaurant.create({
      data: {
        id: restaurantId,
        name: restaurantName,
        country: country || 'India',
        currency: country === 'United States' ? 'USD' : country === 'United Kingdom' ? 'GBP' : 'INR',
        currencySymbol: country === 'United States' ? '$' : country === 'United Kingdom' ? '£' : '₹',
        language: 'English',
        theme: 'light',
        notifications: true,
        autoBackup: false,
        contactEmail: email,
        contactPhone: phone || '',
      } as any,
    });

    // 9. Seed some default categories (menu & expense)
    const defaultCategories = [
      { name: 'Starters', color: '#F97316', type: 'menu' },
      { name: 'Main Course', color: '#2563EB', type: 'menu' },
      { name: 'Desserts', color: '#EC4899', type: 'menu' },
      { name: 'Beverages', color: '#0EA5E9', type: 'menu' },
      { name: 'Utilities', color: '#14B8A6', type: 'expense' },
      { name: 'Staff Salaries', color: '#F59E0B', type: 'expense' },
    ];
  console.info('[Signup] Seeding default categories', { restaurantId, count: defaultCategories.length });
  await tenantPrisma.category.createMany({ data: defaultCategories as any });

    // 10. Seed a couple of tables for quick start
    const defaultTables = Array.from({ length: 6 }).map((_, index) => ({
      number: index + 1,
      capacity: index < 4 ? 4 : 6,
      status: 'FREE',
    }));
    console.info('[Signup] Seeding default tables', { restaurantId, count: defaultTables.length });
    await tenantPrisma.table.createMany({ data: defaultTables as any });

    console.info('[Signup] Signup successful', { restaurantId, email });
    res.status(201).json({
      message: 'Restaurant created successfully!',
      restaurantId: newTenant.restaurantId,
      plan: {
        id: plan.id,
        name: plan.name,
        status: plan.trialPeriodDays > 0 ? 'TRIAL' : 'ACTIVE',
        renewalDate,
      },
    });

  } catch (error: any) {
  console.error('[Signup] Failed', { restaurantId, email, error: error?.message, stack: error?.stack });
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
