// src/utils/testRedis.ts
import 'dotenv/config';
import { redisClient } from './redisClient';
import { logger } from './logger';

export const testRedisConnection = async () => {
  try {
    await redisClient.ping();
    logger.info('Redis connection test successful');
    return true;
  } catch (error) {
    logger.error('Redis connection test failed:', error);
    return false;
  }
};

export const clearRedisCache = async (pattern: string) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      logger.info(`Cleared ${keys.length} cache entries matching pattern: ${pattern}`);
    }
  } catch (error) {
    logger.error('Clear Redis cache error:', error);
    throw error;
  }
};
