import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  // The token is expected in the format "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // No token was provided
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
    if (err) {
      // The token is invalid or expired
      return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }

    // The decoded payload from your login/signup should contain the restaurant's unique code
    if (!decoded.restaurantId) {
        return res.status(403).json({ message: 'Forbidden: Invalid token payload' });
    }

    // Attach the restaurantId to the request object so subsequent middleware can use it
    (req as any).restaurantId = decoded.restaurantId;
    
    // Attach the decoded user payload to the request object
    (req as any).user = decoded;

    // Proceed to the next middleware in the chain (e.g., the tenantPrisma middleware)
    next();
  });
}