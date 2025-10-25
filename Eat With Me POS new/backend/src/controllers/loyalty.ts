import { Request, Response } from "express";

// Get all loyalty logs for all customers
export async function getAllLoyaltyLogs(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const logs = await prisma.loyaltyLog.findMany();
    console.log('Fetched all loyalty logs');
    res.json(logs);
  } catch (err) {
    console.error('Get all loyalty logs error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Loyalty for one customer
export async function getCustomerLoyaltyLog(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    const logs = await prisma.loyaltyLog.findMany({
      where: { customerId: id },
      orderBy: { date: "desc" }
    });
    const total = logs.reduce((sum: number, log: { points: number }) => sum + log.points, 0);
    console.log(`Fetched loyalty logs for customerId=${id}`);
    res.json({ logs, total });
  } catch (err) {
    console.error('Get customer loyalty log error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Add loyalty entry for a customer
export async function addLoyaltyLog(req: Request, res: Response) {
  try {
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
    console.log(`Added loyalty log for customerId=${id}, points=${points}, action=${action}`);
    res.status(201).json(log);
  } catch (err) {
    console.error('Add loyalty log error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
