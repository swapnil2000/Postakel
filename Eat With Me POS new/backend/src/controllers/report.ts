import { Request, Response } from "express";

// Multi-purpose stats for dashboard/reports
export async function getFullReport(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const totalCustomers = await prisma.customer.count();
  const totalOrders = await prisma.order.count();
  const revenue = await prisma.order.aggregate({ _sum: { totalAmount: true } });
  const topMenuItems = await prisma.menuItem.findMany({
    orderBy: { rating: "desc" }, take: 5
  });
  const lowStock = await prisma.inventoryItem.findMany({
    where: { currentStock: { lte: 2 } }, take: 5 // Example threshold
  });
  res.json({
    totalCustomers,
    totalOrders,
    totalRevenue: revenue._sum.totalAmount || 0,
    topMenuItems,
    lowStock
  });
}
