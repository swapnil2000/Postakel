import { Request, Response } from "express";

// Get all loyalty logs for all customers
export async function getAllLoyaltyLogs(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const logs = await prisma.loyaltyLog.findMany();
  res.json(logs);
}

// Loyalty for one customer
export async function getCustomerLoyaltyLog(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const logs = await prisma.loyaltyLog.findMany({
    where: { customerId: id },
    orderBy: { date: "desc" }
  });
  const total = logs.reduce((sum, log) => sum + log.points, 0);
  res.json({ logs, total });
}

// Add loyalty entry for a customer
export async function addLoyaltyLog(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const { points, action } = req.body;
  const log = await prisma.loyaltyLog.create({
    data: { customerId: id, points, action }
  });
  await prisma.customer.update({
    where: { id },
    data: { loyaltyPoints: { increment: points } }
  });
  res.status(201).json(log);
}
