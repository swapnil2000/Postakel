import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getMasterPrisma } from "../utils/dbManager";
import { Client } from "pg";
import { execSync } from "child_process";

export async function signup(req: Request, res: Response) {
  const {
    restaurantName,
    ownerName,
    email,
    password,
    confirmPassword,
    phone,
    address,
    country,
    selectedPlan
  } = req.body;

  try {
    if (
      !restaurantName ||
      !ownerName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !address ||
      !country ||
      !selectedPlan
    ) {
      console.error('Signup error: Missing required fields', req.body);
      return res.status(400).json({ message: "All fields are required" });
    }

    const master = getMasterPrisma();

    // Check if restaurant with this email already exists
    const existingRestaurant = await master.restaurant.findFirst({
      where: { userEmail: email }
    });
    if (existingRestaurant) {
      console.error(`Signup error: Email already registered (${email})`);
      return res.status(409).json({ message: "Email already registered" });
    }

    if (password !== confirmPassword) {
      console.error('Signup error: Passwords do not match');
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique restaurant code (7-digit, ensure uniqueness)
    let uniqueCode: string;
    let exists = true;
    do {
      uniqueCode = Math.floor(1000000 + Math.random() * 9000000).toString();
      exists = !!(await master.restaurant.findUnique({ where: { uniqueCode } }));
    } while (exists);

    // --- Dynamic Tenant DB Creation ---
    const tenantDbName = `tenant_${uniqueCode}`;
    const baseDbUrl = process.env.DATABASE_URL_TENANT || "";
    const urlMatch = baseDbUrl.match(/(postgresql:\/\/[^\/]+)\/[^?]+/);
    const baseUrl = urlMatch ? urlMatch[1] : baseDbUrl.split('/').slice(0, -1).join('/');
    const tenantDbUrl = `${baseUrl}/${tenantDbName}`;

    // Create the tenant DB in Postgres
    const adminClient = new Client({ connectionString: baseDbUrl });
    await adminClient.connect();
    await adminClient.query(`CREATE DATABASE "${tenantDbName}"`);
    await adminClient.end();

    // Run Prisma migrations for tenant schema on the new DB
    execSync(`npx prisma migrate deploy --schema=prisma/schema.prisma`, {
      env: { ...process.env, DATABASE_URL: tenantDbUrl }
    });

    // Save restaurant and user info in master DB
    const restaurant = await master.restaurant.create({
      data: {
        name: restaurantName,
        uniqueCode,
        dbUrl: tenantDbUrl,
        createdAt: new Date(),
        userId: '',
        userEmail: email,
        userPassword: hashedPassword,
        userName: ownerName
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { restaurantId: restaurant.uniqueCode },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    console.log(`Signup success: Restaurant ${restaurant.uniqueCode} created`);

    res.json({
      token,
      restaurantId: restaurant.uniqueCode,
      vendor: {
        restaurant: [
          {
            id: restaurant.id,
            name: restaurant.name,
            uniqueCode: restaurant.uniqueCode,
            country,
            address,
            plan: selectedPlan
          }
        ]
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
