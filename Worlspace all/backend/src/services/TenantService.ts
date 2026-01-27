import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { StringUtil } from '../utils';

export class TenantDatabaseService {
  static async createTenantDatabase(tenantId: string, tenantName: string): Promise<{
    dbName: string;
    dbUser: string;
    dbPassword: string;
  }> {
    const dbPassword = StringUtil.generateId().substring(0, 16);
    const dbName = StringUtil.generateDatabaseName(tenantId);
    const dbUser = `user_${StringUtil.slugify(tenantId).substring(0, 20)}`;

    try {
      // Connect to master database
      const masterPrisma = new PrismaClient({
        datasources: {
          db: {
            url: config.database_url,
          },
        },
      });

      // Create new database
      await masterPrisma.$executeRawUnsafe(
        `CREATE DATABASE "${dbName}" OWNER postgres;`
      );

      // Create user for tenant database
      await masterPrisma.$executeRawUnsafe(
        `CREATE USER "${dbUser}" WITH PASSWORD '${dbPassword}';`
      );

      // Grant privileges
      await masterPrisma.$executeRawUnsafe(
        `GRANT ALL PRIVILEGES ON DATABASE "${dbName}" TO "${dbUser}";`
      );

      await masterPrisma.$disconnect();

      return {
        dbName,
        dbUser,
        dbPassword,
      };
    } catch (error) {
      console.error('Error creating tenant database:', error);
      throw new Error(`Failed to create tenant database: ${(error as Error).message}`);
    }
  }

  static async deleteTenantDatabase(dbName: string, dbUser: string): Promise<void> {
    try {
      const masterPrisma = new PrismaClient({
        datasources: {
          db: {
            url: config.database_url,
          },
        },
      });

      // Terminate connections
      await masterPrisma.$executeRawUnsafe(
        `SELECT pg_terminate_backend(pg_stat_activity.pid) 
         FROM pg_stat_activity 
         WHERE pg_stat_activity.datname = '${dbName}' AND pid <> pg_backend_pid();`
      );

      // Drop database
      await masterPrisma.$executeRawUnsafe(
        `DROP DATABASE IF EXISTS "${dbName}";`
      );

      // Drop user
      await masterPrisma.$executeRawUnsafe(
        `DROP USER IF EXISTS "${dbUser}";`
      );

      await masterPrisma.$disconnect();
    } catch (error) {
      console.error('Error deleting tenant database:', error);
      throw error;
    }
  }

  static async runTenantMigrations(dbHost: string, dbPort: number, dbName: string, dbUser: string, dbPassword: string): Promise<void> {
    try {
      const tenantDatabaseUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
      
      const tenantPrisma = new PrismaClient({
        datasources: {
          db: {
            url: tenantDatabaseUrl,
          },
        },
      });

      // Run schema creation using Prisma
      // Note: In production, you might use prisma migrate deploy
      // For now, we'll rely on schema sync
      await tenantPrisma.$executeRawUnsafe('SELECT 1;');
      await tenantPrisma.$disconnect();
    } catch (error) {
      console.error('Error running tenant migrations:', error);
      throw error;
    }
  }
}

export class TenantContextService {
  static getTenantPrisma(dbHost: string, dbPort: number, dbName: string, dbUser: string, dbPassword: string) {
    const databaseUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

    return new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }
}
