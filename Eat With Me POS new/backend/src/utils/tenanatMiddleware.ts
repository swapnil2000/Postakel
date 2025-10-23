import { getTenantPrisma } from './dbManager';
import { Request, Response, NextFunction } from 'express';

export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  const restaurantId = req.headers['x-restaurant-id'] as string;
  if (!restaurantId) return res.status(400).json({ error: 'Restaurant ID required' });
  try {
    (req as any).prisma = await getTenantPrisma(restaurantId);
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid restaurant ID' });
  }
}
