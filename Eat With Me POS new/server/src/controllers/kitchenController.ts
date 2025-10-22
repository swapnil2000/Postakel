/** @format */

import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';
import { redisClient } from '../utils/redisClient';
import { config } from '../config';

export const kitchenController = {
	async getPendingOrders(req: Request, res: Response) {
		try {
			const vendorId = req.user?.vendorId;
			
			// Try Redis cache first
			if (config.redis.enabled) {
				const cached = await redisClient.get(`pending-orders:${vendorId}`);
				if (cached) {
					return res.json(JSON.parse(cached));
				}
			}

			const orders = await prisma.order.findMany({
				where: {
					vendorId,
					status: 'pending'
				},
				orderBy: {
					orderDate: 'asc'
				},
				include: {
					table: true
				}
			});

			// Cache results
			if (config.redis.enabled) {
				await redisClient.setEx(
					`pending-orders:${vendorId}`,
					60, // 1 minute cache
					JSON.stringify(orders)
				);
			}

			res.json(orders);
		} catch (error) {
			logger.error('Get pending orders error:', error);
			res.status(500).json({ message: 'Failed to fetch pending orders' });
		}
	},

	async updateOrderStatus(req: Request, res: Response) {
		try {
			const { orderId } = req.params;
			const { status } = req.body;
			const vendorId = req.user?.vendorId;

			const order = await prisma.order.update({
				where: {
					id_vendorId: {
						id: orderId,
						vendorId
					}
				},
				data: { status }
			});

			// Invalidate cache
			if (config.redis.enabled) {
				await redisClient.del(`pending-orders:${vendorId}`);
			}

			res.json(order);
		} catch (error) {
			logger.error('Update order status error:', error);
			res.status(500).json({ message: 'Failed to update order status' });
		}
	}
};
