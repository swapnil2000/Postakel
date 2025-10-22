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
import { config } from '../config';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).userId },
      include: { role: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
