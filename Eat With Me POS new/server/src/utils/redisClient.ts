import { createClient } from 'redis';
import { config } from '../config';
import { logger } from './logger';

const redisClient = createClient({
  url: config.redis.url
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

export const connectRedis = async () => {
  if (config.redis.enabled) {
    try {
      await redisClient.connect();
    } catch (error) {
      logger.error('Redis connection failed:', error);
    }
  }
};

export { redisClient };
