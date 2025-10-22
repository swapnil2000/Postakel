import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';

const prisma = new PrismaClient();

export const setupTestDatabase = async () => {
  const prismaBinary = join(__dirname, '../../../node_modules/.bin/prisma');
  
  try {
    // Reset database
    execSync(`${prismaBinary} migrate reset --force`);
    
    // Run migrations
    execSync(`${prismaBinary} migrate deploy`);
    
    // Additional setup if needed
    await seedTestData();
    
  } catch (error) {
    console.error('Test database setup failed:', error);
    throw error;
  }
};

export const seedTestData = async () => {
  // Add test data
  await prisma.vendor.create({
    data: {
      name: 'Test Vendor',
      email: 'test@example.com',
      settings: {},
      restaurant: {
        create: {
          name: 'Test Restaurant',
          address: 'Test Address',
          phone: '1234567890'
        }
      }
    }
  });
};

export const clearTestData = async () => {
  const tablenames = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== '_prisma_migrations')
    .map((name) => `"public"."${name}"`)
    .join(', ');

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  } catch (error) {
    console.error('Clear test data failed:', error);
    throw error;
  }
};