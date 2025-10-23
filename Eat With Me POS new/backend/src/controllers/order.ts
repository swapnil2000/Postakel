import { Request, Response } from "express";

export async function getAllOrders(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const orders = await prisma.order.findMany({
    include: { items: true }
  });
  res.json(orders);
}

export async function getOrderById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true }
  });
  order ? res.json(order) : res.status(404).json({ error: "Not found" });
}

export async function createOrder(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { customerId, tableId, orderSource, status, totalAmount, paymentMethod, items } = req.body;
  const order = await prisma.order.create({
    data: {
      customerId,
      tableId,
      orderSource,
      status,
      totalAmount,
      paymentMethod,
      items: {
        create: items // [{menuItemId, quantity, price}]
      }
    },
    include: { items: true }
  });
  res.status(201).json(order);
}

export async function updateOrder(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const data = req.body;
  const order = await prisma.order.update({ where: { id }, data });
  res.json(order);
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
      ]
    },
    include: { items: true }
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
      }
    }
  });
  res.json(result);
}
