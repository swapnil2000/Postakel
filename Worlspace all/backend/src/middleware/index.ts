import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthRequest, UserPayload } from '../types';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authRequest = req as AuthRequest;
    const token = authRequest.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
        timestamp: new Date().toISOString(),
      });
    }

    const decoded = jwt.verify(token, config.jwt_secret!) as UserPayload;
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      timestamp: new Date().toISOString(),
    });
  }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authRequest = req as AuthRequest;
  if (!authRequest.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
      timestamp: new Date().toISOString(),
    });
  }

  if (authRequest.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  });
};

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [config.frontend_url, config.frontend_production_url].filter(Boolean);

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin!)) {
    res.setHeader('Access-Control-Allow-Origin', origin!);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};
