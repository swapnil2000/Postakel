import { getMasterPrisma, getTenantPrisma } from '../utils/dbManager';

export async function tenantPrismaMiddleware(req, res, next) {
  const restaurantId = req.headers['x-restaurant-id'] || req.body.restaurantId || req.query.restaurantId;
  if (!restaurantId) return res.status(400).json({ error: 'restaurantId required' });

  const master = getMasterPrisma();
  const restaurant = await master.restaurant.findUnique({ where: { uniqueCode: restaurantId } });
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

  req.prisma = getTenantPrisma(restaurant.dbUrl);
  next();
}
