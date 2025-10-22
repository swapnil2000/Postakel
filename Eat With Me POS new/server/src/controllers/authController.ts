/** @format */

// import { Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // 🔐 Signup
// export const signup = async (req: Request, res: Response) => {
//   try {
//     const { restaurantName, ownerName, email, password, country, selectedPlan } = req.body;

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create vendor + restaurant
//     const vendor = await prisma.vendor.create({
//       data: {
//         name: ownerName,
//         email,
//         country,
//         plan: selectedPlan,
//         password: hashedPassword, // ✅ correct field name
//         restaurant: {
//           create: {
//             name: restaurantName,
//             location: country || "",
//           },
//         },
//       },
//       include: {
//         restaurant: true, // ✅ fixed spelling
//       },
//     });

//     const token = jwt.sign({ vendorId: vendor.id }, process.env.JWT_SECRET!, {
//       expiresIn: "7d",
//     });

//     res.status(201).json({
//       message: "Signup successful",
//       token,
//       vendor,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Signup failed" });
//   }
// };

// // 🔑 Login
// export const login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const vendor = await prisma.vendor.findUnique({
//       where: { email },
//       include: { restaurant: true }, // ✅ fixed spelling
//     });

//     if (!vendor) return res.status(404).json({ message: "Vendor not found" });

//     const isPasswordValid = await bcrypt.compare(password, vendor.password); // ✅ fixed field name
//     if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ vendorId: vendor.id }, process.env.JWT_SECRET!, {
//       expiresIn: "7d",
//     });

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       vendor,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Login failed" });
//   }
// };

// // 🧾 Get Vendor's Restaurant Info
// export const getVendorRestaurant = async (req: Request, res: Response) => {
//   try {
//     const { vendorId } = req.user as { vendorId: string };

//     const restaurant = await prisma.restaurant.findFirst({
//       where: { vendorId }, // ✅ correct query
//     });

//     if (!restaurant) {
//       return res.status(404).json({ message: "Restaurant not found" });
//     }

//     res.status(200).json(restaurant);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Could not fetch restaurant" });
//   }
// };
import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { config } from '../config';
import { logger } from '../utils/logger';

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const authController = {
	async login(req: Request, res: Response) {
		try {
			const { email, password } = loginSchema.parse(req.body);

			const user = await prisma.user.findUnique({
				where: { email },
				include: {
					role: {
						include: {
							permissions: true,
						},
					},
				},
			});

			if (!user || !user.password) {
				return res.status(401).json({ message: 'Invalid credentials' });
			}

			const validPassword = await bcrypt.compare(password, user.password);
			if (!validPassword) {
				return res.status(401).json({ message: 'Invalid credentials' });
			}

			const token = jwt.sign(
				{
					userId: user.id,
					vendorId: user.vendorId,
					role: user.role.name,
				},
				config.jwtSecret,
				{ expiresIn: '24h' }
			);

			// Remove sensitive data
			delete user.password;

			res.json({
				token,
				user,
			});
		} catch (error) {
			logger.error('Login error:', error);
			if (error instanceof z.ZodError) {
				res.status(400).json({ message: 'Invalid input', errors: error.errors });
			} else {
				res.status(500).json({ message: 'Login failed' });
			}
		}
	},
};
