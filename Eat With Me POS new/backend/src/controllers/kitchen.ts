import { Request, Response } from "express";

// All orders for kitchen display (pending, preparing, ready, etc)
export async function getKitchenOrders(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { status } = req.query;
  const validStatuses = ["pending", "preparing", "ready"];
  const orders = await prisma.order.findMany({
    where: status && validStatuses.includes(status as string)
      ? { status: status as string }
      : { status: { in: validStatuses } },
    include: { items: true }
  });
  res.json(orders);
}

// Update status (mark as preparing, ready, etc)
export async function updateKitchenOrderStatus(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await prisma.order.update({ where: { id: orderId }, data: { status } });
  res.json(order);
}
// Get order details by ID
export async function getKitchenOrderById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { orderId } = req.params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });
  res.json(order);
}

// Search orders by item name or table
export async function searchKitchenOrders(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { query } = req.params;
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { items: { some: { name: { contains: query, mode: "insensitive" } } } },
        { table: { name: { contains: query, mode: "insensitive" } } }
      ]
    },
    include: { items: true }
  });
  res.json(orders);
}
// Get stats - avg prep time, orders per status
export async function getKitchenStats(req: Request, res: Response) {
  const prisma = (req as any).prisma;   
  const [avgPrepTime, ordersPerStatus] = await Promise.all([
    prisma.order.aggregate({
      _avg: { prepTime: true }
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true }
    })
  ]);
  res.json({ avgPrepTime, ordersPerStatus });
}