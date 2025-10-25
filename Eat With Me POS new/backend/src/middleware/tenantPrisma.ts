import { getMasterPrisma, getTenantPrisma } from '../utils/dbManager';

export async function tenantPrismaMiddleware(req, res, next) {
  // Get restaurantId from header, body, or query
  const restaurantId =
    req.headers['x-restaurant-id'] ||
    req.body.restaurantId ||
    req.query.restaurantId;

  if (!restaurantId) {
    return res.status(400).json({ error: 'restaurantId required' });
  }

  // Look up tenant DB URL from master DB
  const master = getMasterPrisma();
  const restaurant = await master.restaurant.findUnique({
    where: { uniqueCode: restaurantId }
  });

  if (!restaurant || !restaurant.dbUrl) {
    return res.status(404).json({ error: 'Restaurant not found or DB URL missing' });
  }

  // Attach tenant Prisma client to request
  req.prisma = getTenantPrisma(restaurant.dbUrl);
  next();
}
