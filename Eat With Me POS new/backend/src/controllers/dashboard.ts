import { Request, Response } from "express";

// Get dashboard metrics: revenue, orders, customers, inventory, etc.
export async function getDashboardMetrics(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const [
    revenue,
    totalOrders,
    activeTables,
    inventory,
    totalCustomers
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.count(),
    prisma.table.count({ where: { status: "occupied" } }),
    prisma.inventoryItem.findMany({}),
    prisma.customer.count()
  ]);
  res.json({
    revenue: revenue._sum.totalAmount || 0,
    totalOrders,
    activeTables,
    inventoryCount: inventory.length,
    totalCustomers
  });
}
// Get sales breakdown by category for dashboard charts
export async function getSalesByCategory(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const sales = await prisma.order.groupBy({
    by: ["category"],
    _sum: { totalAmount: true }
  });
  res.json(sales);
}
// Get top selling menu items for dashboard
export async function getTopSellingItems(req: Request, res: Response) {
  const prisma = (req as any).prisma;   
  const items = await prisma.orderItem.groupBy({
    by: ["menuItemId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 10
  });
  res.json(items);
}
// Get recent orders for dashboard
export async function getRecentOrders(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const orders = await prisma.order.findMany({
    orderBy: { orderTime: "desc" },
    take: 5
  });
  res.json(orders);
}
