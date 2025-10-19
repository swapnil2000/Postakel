import { createClient, RedisClientType } from 'redis'

let redisClient: RedisClientType | null = null;
export async function getRedisClient(): Promise<RedisClientType | null>{
    if (process.env.USE_REDIS !== 'true') {
        return null;
    }

    if (redisClient) return redisClient;

    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = createClient({ url });

    redisClient.on('error', (err) => {
        console.error('Redis client error', err);
    });

    await redisClient.connect();
    console.log('Redis Connected to ', url);
    return redisClient;
}

export function getRedisClientsync(): RedisClientType | null{
    return redisClient;
}