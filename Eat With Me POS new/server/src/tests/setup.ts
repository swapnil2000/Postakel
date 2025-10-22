import { prisma } from '../prisma';
import { redisClient } from '../utils/redisClient';

beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

afterAll(async () => {
  // Cleanup
  await prisma.$disconnect();
  await redisClient.quit();
});