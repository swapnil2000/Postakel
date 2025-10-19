/** @format */

import 'dotenv/config';
import app from './app';
import { getRedisClient } from './utils/redisClient'; // ✅ import Redis initializer

const PORT = process.env.PORT || 4000;

(async () => {
	try {
		await getRedisClient();
		console.log('✅ Redis check completed');

		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (err) {
		console.error('❌ Failed to start server:', err);
		process.exit(1);
	}
})();
