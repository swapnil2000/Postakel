/** @format */

import { Request, Response } from 'express';

export async function getAllOrders(req: Request, res: Response) {
	const prisma = (req as any).prisma;
	try {
		const orders = await prisma.order.findMany({
			include: { customer: true, table: true, items: { include: { menuItem: true } } },
			orderBy: { orderTime: 'desc' },
		});
		res.json(orders);
	} catch (error) {
		console.error('Error fetching orders:', error);
		res.status(500).json({ error: 'Failed to fetch orders' });
	}
}

export async function createOrder(req: Request, res: Response) {
	const prisma = (req as any).prisma;
	try {
		const { items, customerId, tableId, ...orderData } = req.body;
		if (!items || items.length === 0) {
			return res.status(400).json({ error: 'Order must contain at least one item.' });
		}
		const newOrder = await prisma.order.create({
			data: {
				...orderData,
				customer: customerId ? { connect: { id: customerId } } : undefined,
				table: tableId ? { connect: { id: tableId } } : undefined,
				items: {
					create: items.map((item: any) => ({
						quantity: item.quantity,
						price: item.price,
						notes: item.notes,
						menuItem: { connect: { id: item.menuItemId } },
					})),
				},
			},
			include: { items: true },
		});
		res.status(201).json(newOrder);
	} catch (error) {
		console.error('Error creating order:', error);
		res.status(500).json({ error: 'Failed to create order' });
	}
}

export async function getOrderById(req: Request, res: Response) {
	const prisma = (req as any).prisma;
	const { id } = req.params;
	try {
		const order = await prisma.order.findUnique({
			where: { id },
			include: { customer: true, table: true, items: { include: { menuItem: true } } },
		});
		if (order) {
			res.json(order);
		} else {
			res.status(404).json({ error: 'Order not found' });
		}
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch order' });
	}
}

export async function updateOrder(req: Request, res: Response) {
	const prisma = (req as any).prisma;
	const { id } = req.params;
	const { status } = req.body;
	try {
		const updatedOrder = await prisma.order.update({
			where: { id },
			data: { status },
		});
		res.json(updatedOrder);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update order' });
	}
}

export async function deleteOrder(req: Request, res: Response) {
	const prisma = (req as any).prisma;
	const { id } = req.params;
	await prisma.order.delete({ where: { id } });
	res.json({ deleted: true });
}

// FILTERS, STATUS, SOURCE, TODAY/DATE RANGE, REVENUE

export async function searchOrders(req: Request, res: Response) {
	const prisma = (req as any).prisma;
	const { q, tableId, status, source, from, to } = req.query;
	const orders = await prisma.order.findMany({
		where: {
			AND: [
				q ? { customerId: { equals: q as string } } : {},
				tableId ? { tableId: { equals: tableId as string } } : {},
				status ? { status: { equals: status as string } } : {},
				source ? { orderSource: { equals: source as string } } : {},
				from ? { orderTime: { gte: new Date(from as string) } } : {},
				to ? { orderTime: { lte: new Date(to as string) } } : {},
			],
		},
		include: { items: true },
	});
	res.json(orders);
}

export async function getOrderStats(req: Request, res: Response) {
	const prisma = (req as any).prisma;
	const { from, to } = req.query;
	const result = await prisma.order.aggregate({
		_count: { _all: true },
		_sum: { totalAmount: true },
		where: {
			orderTime: {
				gte: from ? new Date(from as string) : undefined,
				lte: to ? new Date(to as string) : undefined,
			},
		},
	});
	res.json(result);
}
