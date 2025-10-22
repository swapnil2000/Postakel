/** @format */

import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';
import { redisClient } from '../utils/redisClient';
import { config } from '../config';

export const dashboardController = {
	async getAnalytics(req: Request, res: Response) {
		try {
			const vendorId = req.user?.vendorId;
			const { period = 'today' } = req.query;

			// Try Redis cache
			if (config.redis.enabled) {
				const cached = await redisClient.get(`analytics:${vendorId}:${period}`);
				if (cached) {
					return res.json(JSON.parse(cached));
				}
			}

			const startDate = new Date();
			if (period === 'week') {
				startDate.setDate(startDate.getDate() - 7);
			} else if (period === 'month') {
				startDate.setMonth(startDate.getMonth() - 1);
			} else {
				startDate.setHours(0, 0, 0, 0);
			}

			const [orders, totalRevenue, topItems] = await Promise.all([
				// Get order count
				prisma.order.count({
					where: {
						vendorId,
						orderDate: { gte: startDate },
					},
				}),

				// Calculate revenue
				prisma.order.aggregate({
					where: {
						vendorId,
						orderDate: { gte: startDate },
					},
					_sum: {
						totalAmount: true,
					},
				}),

				// Get top selling items
				prisma.order.findMany({
					where: {
						vendorId,
						orderDate: { gte: startDate },
					},
					select: {
						items: true,
					},
				}),
			]);

			// Process top items
			const itemsMap = new Map();
			topItems.forEach((order) => {
				order.items.forEach((item: any) => {
					const current = itemsMap.get(item.id) || 0;
					itemsMap.set(item.id, current + item.quantity);
				});
			});

			const analytics = {
				totalOrders: orders,
				revenue: totalRevenue._sum.totalAmount || 0,
				topSellingItems: Array.from(itemsMap.entries())
					.sort((a, b) => b[1] - a[1])
					.slice(0, 5),
			};

			// Cache results
			if (config.redis.enabled) {
				await redisClient.setEx(
					`analytics:${vendorId}:${period}`,
					300, // 5 minutes cache
					JSON.stringify(analytics)
				);
			}

			res.json(analytics);
		} catch (error) {
			logger.error('Get analytics error:', error);
			res.status(500).json({ message: 'Failed to fetch analytics' });
		}
	},
};
