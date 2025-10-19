// /** @format */

// import { Request, Response, nextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { prisma } from '../prisma';

// const JWT_SECRET = process.env.JWT_SCERET || "change_this";
// export interface AuthRequest extends Request{
//     user?: any;
//     returantId?: string;
// }

// export async function authentication(req: AuthRequest, res: Response, next: nextFunction) {
//     try {
//         const auth = req.headers.authrization;
//         if (!auth) return res.status(401).json({ error: "No authorization heaader" });
//         const token = auth.split(" ")[1];
//         const payload: any = jwt.verify(token, JWT_SECRET);
        
//     }
//     catch (err) {
//         return res.status(401).json({ error: "Invalid token" });
//     }
// }

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  vendorId: string;
}

// Extend Request type
export interface AuthRequest extends Request {
  vendorId?: string; // vendorId from JWT
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization; // ✅ fix typo ('suthorization')
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  const token = parts[1];

  try {
    const secret = process.env.JWT_SECRET; // ✅ fix typo ('JWT_SECERET')
    if (!secret) throw new Error('JWT secret not set');

    const payload = jwt.verify(token, secret) as JwtPayload;
    req.vendorId = payload.vendorId; // attach vendorId to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
