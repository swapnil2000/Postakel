import { Request, Response } from "express";

// Start a new POS order/CART (but not paid/finished)
export async function startPOSOrder(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { tableId, items } = req.body;
  const order = await prisma.order.create({
    data: {
      tableId,
      orderSource: "pos",
      status: "pending",
      items: {
        create: items // [{menuItemId, quantity, price}]
      }
    },
    include: { items: true }
  });
  res.status(201).json(order);
}

// Finalize/checkout a POS order (take payment and set status)
export async function finalizePOSOrder(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const { paymentMethod, totalAmount } = req.body;
  const order = await prisma.order.update({
    where: { id },
    data: { paymentMethod, totalAmount, status: "completed" }
  });
  res.json(order);
}

// Fetch all POS orders for the day (summary/dashboard)
export async function getPOSOrdersToday(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const orders = await prisma.order.findMany({
    where: {
      orderSource: "pos",
      orderTime: { gte: today }
    }
  });
  res.json(orders);
}
// Refund a POS order
export async function refundPOSOrder(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const order = await prisma.order.update({
    where: { id },
    data: { status: "refunded" }
  });
  res.json(order);
}