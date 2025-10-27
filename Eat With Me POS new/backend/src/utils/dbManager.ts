import { PrismaClient as MasterPrismaClient } from '../generated/master';
import { PrismaClient as TenantPrismaClient } from '@prisma/client';

const masterPrisma = new MasterPrismaClient();

export function getMasterPrisma() {
  return masterPrisma;
}

export function getTenantPrisma(dbUrl: string) {
  return new TenantPrismaClient({
    datasources: { db: { url: dbUrl } }
  });
}
