import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getMasterPrisma } from "../utils/dbManager";

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

    if (password !== confirmPassword) {
      console.error('Signup error: Passwords do not match');
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const master = getMasterPrisma();

    // Check if user already exists
    const existingUser = await master.user.findUnique({ where: { email } });
    if (existingUser) {
      console.error(`Signup error: Email already registered (${email})`);
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await master.user.create({
      data: {
        email,
        password: hashedPassword,
        name: ownerName
      }
    });

    // Generate unique restaurant code
    const uniqueCode = Math.floor(1000000 + Math.random() * 9000000).toString();

    // Create restaurant
    const restaurant = await master.restaurant.create({
      data: {
        name: restaurantName,
        uniqueCode,
        dbUrl: "",
        createdAt: new Date()
      }
    });

    // Link user and restaurant in UserRestaurant
    await master.userRestaurant.create({
      data: {
        userId: user.id,
        restaurantId: restaurant.id
      }
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, restaurantId: restaurant.uniqueCode },
      process.env.JWT_SECRET as string,
      { expiresIn: "8h" }
    );

    console.log(`Signup success: User ${user.id} created restaurant ${restaurant.uniqueCode}`);

    res.json({
      token,
      restaurantId: restaurant.uniqueCode,
      vendor: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
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
