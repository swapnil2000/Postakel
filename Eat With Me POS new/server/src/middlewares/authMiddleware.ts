/** @format */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export interface AuthRequest extends Request {
	user?: { vendorId: string; email?: string }; // email is optional now
}

export function authenticateToken(
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Response | undefined {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	jwt.verify(
		token,
		process.env.JWT_SECRET as string,
		(err, user) => {
			if (err) return res.status(403).json({ message: 'Invalid token' });
			req.user = user as { vendorId: string; email?: string };
			next();
		}
	);
}
