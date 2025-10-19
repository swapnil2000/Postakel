// src/utils/testRedis.ts
import 'dotenv/config';
import { getRedisClient } from './redisClient';

async function main() {
  const client = await getRedisClient();
  if (!client) {
    console.log('Redis disabled via USE_REDIS flag.');
    return;
  }

  await client.set('test:key', 'hello redis');
  const val = await client.get('test:key');
  console.log('test:key ->', val);
  await client.del('test:key');

  await client.disconnect();
  console.log('Disconnected');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
