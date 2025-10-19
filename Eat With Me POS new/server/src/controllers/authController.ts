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
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	console.warn('⚠️ JWT_SECRET is not set in environment variables!');
}

// 🔐 Signup
export const signup = async (req: Request, res: Response) => {
	console.log('📩 Incoming signup data:', req.body);
	try {
		const {
			restaurantName,
			ownerName,
			email,
			password,
			phone,
			address,
			country,
			selectedPlan,
		} = req.body;

		// Validate required fields
		if (
			!restaurantName ||
			!ownerName ||
			!email ||
			!password ||
			!phone ||
			!address ||
			!country ||
			!selectedPlan
		) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		// Check if vendor already exists
		const existingVendor = await prisma.vendor.findUnique({ where: { email } });
		if (existingVendor) {
			return res.status(400).json({ message: 'Vendor already exists' });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create vendor + restaurant
		const vendor = await prisma.vendor.create({
			data: {
				name: ownerName,
				email,
				password: hashedPassword,
				country,
				plan: selectedPlan,
				restaurant: {
					create: {
						name: restaurantName,
						location: country,
						address,
						phone,
					},
				},
			},
			include: { restaurant: true },
		});

		// Generate JWT token
		const token = jwt.sign(
			{ vendorId: vendor.id, email: vendor.email },
			JWT_SECRET as string,
			{ expiresIn: '7d' }
		);

		return res.status(201).json({
			message: 'Signup successful',
			vendor: {
				id: vendor.id,
				email: vendor.email,
				name: vendor.name,
				restaurant: vendor.restaurant,
			},
			token,
		});
	} catch (error) {
		console.error('Signup error:', error);
		return res.status(500).json({ message: 'Signup failed' });
	}
};

// 🔑 Login
export const login = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: 'Email and password are required' });
		}

		const vendor = await prisma.vendor.findUnique({
			where: { email },
			include: { restaurant: true },
		});

		if (!vendor) {
			return res.status(404).json({ message: 'Vendor not found' });
		}

		const isPasswordValid = await bcrypt.compare(password, vendor.password);
		if (!isPasswordValid) {
			return res.status(400).json({ message: 'Invalid credentials' });
		}

		const token = jwt.sign(
			{ vendorId: vendor.id, email: vendor.email },
			JWT_SECRET as string,
			{ expiresIn: '7d' }
		);

		return res.status(200).json({
			message: 'Login successful',
			vendor: {
				id: vendor.id,
				email: vendor.email,
				name: vendor.name,
				restaurant: vendor.restaurant,
			},
			token,
		});
	} catch (error) {
		console.error('Login error:', error);
		return res.status(500).json({ message: 'Login failed' });
	}
};

// 🧾 Get Vendor's Restaurant Info
export const getVendorRestaurant = async (req: Request, res: Response) => {
	try {
		// @ts-ignore - vendorId is set by auth middleware
		const { vendorId } = req.user || {};

		if (!vendorId) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const restaurant = await prisma.restaurant.findFirst({
			where: { vendorId },
		});

		if (!restaurant) {
			return res.status(404).json({ message: 'Restaurant not found' });
		}

		return res.status(200).json(restaurant);
	} catch (error) {
		console.error('Get restaurant error:', error);
		return res.status(500).json({ message: 'Could not fetch restaurant' });
	}
};
