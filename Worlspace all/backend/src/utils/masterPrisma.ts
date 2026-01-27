import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { Logger } from './Logger';

/**
 * Master Prisma Client
 * Connects to the MASTER DATABASE (admin-backend database)
 * Used to access CompanySignup and Tenant models
 * 
 * IMPORTANT: This connects to a different database than the tenant database
 * The master database contains global company and subscription data
 */

let masterPrisma: PrismaClient;

// Determine the master database URL
const masterDatabaseUrl = config.master_database_url;

if (!masterDatabaseUrl) {
  Logger.error('MasterPrisma', 'initialize', 'MASTER_DATABASE_URL not configured! CompanySignup queries will fail.');
  throw new Error('MASTER_DATABASE_URL environment variable is required');
}

// Create master Prisma client
try {
  masterPrisma = new PrismaClient({
    datasources: {
      db: {
        url: masterDatabaseUrl,
      },
    },
  });
  Logger.success('MasterPrisma', 'initialize', 'Master Prisma Client initialized');
} catch (error) {
  Logger.error('MasterPrisma', 'initialize', 'Failed to initialize Master Prisma Client', error);
  throw error;
}

// Handle disconnection
process.on('exit', async () => {
  await masterPrisma.$disconnect();
});

export { masterPrisma };
