import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AdminTokenPayload {
  sub: string;
  email: string;
  role: string;
  type: 'admin';
  iat: number;
  exp: number;
}

export interface AdminRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

export function adminAuth(req: AdminRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing admin authorization token.' });
  }

  const token = authHeader.substring('Bearer '.length);
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Admin authentication is not configured.' });
  }

  try {
    const payload = jwt.verify(token, secret) as AdminTokenPayload;
    if (payload.type !== 'admin') {
      return res.status(401).json({ message: 'Invalid admin token scope.' });
    }

    req.admin = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired admin token.' });
  }
}
