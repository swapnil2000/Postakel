/** @format */

import 'dotenv/config';
import app from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { connectRedis } from './utils/redisClient';
import { prisma } from './prisma';

async function startServer() {
  try {
    // Connect to Redis if enabled
    await connectRedis();
    logger.info('✅ Redis check completed');

    // Test database connection
    await prisma.$connect();
    logger.info('Database connection established');

    // Start server
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Server startup failed:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  await prisma.$disconnect();
  process.exit(0);
});
