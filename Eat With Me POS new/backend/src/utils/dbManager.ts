import { PrismaClient as MasterPrisma } from '../generated/master';
import { PrismaClient as TenantPrisma } from '../generated/tenant';

const masterPrisma = new MasterPrisma();
const prismaCache: { [dbUrl: string]: TenantPrisma } = {};

export const getMasterPrisma = () => masterPrisma;

export async function getTenantPrisma(restaurantId: string) {
  const restaurant = await masterPrisma.restaurant.findUnique({
    where: { uniqueCode: restaurantId },
  });
  if (!restaurant) throw new Error('Invalid restaurant ID');
  if (prismaCache[restaurant.dbUrl]) return prismaCache[restaurant.dbUrl];
  const client = new TenantPrisma({ datasources: { db: { url: restaurant.dbUrl } } });
  prismaCache[restaurant.dbUrl] = client;
  return client;
}
