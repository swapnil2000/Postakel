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
    totalOrders: totalOrders || 0,
    activeTables: activeTables || 0,
    inventoryCount: inventory.length || 0,
    totalCustomers: totalCustomers || 0
  });
}
// Get sales breakdown by category for dashboard charts
export async function getSalesByCategory(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  let sales = [];
  try {
    sales = await prisma.order.groupBy({
      by: ["category"],
      _sum: { totalAmount: true }
    });
  } catch {
    sales = [];
  }
  res.json(sales);
}
// Get top selling menu items for dashboard
export async function getTopSellingItems(req: Request, res: Response) {
  const prisma = (req as any).prisma;   
  let items = [];
  try {
    items = await prisma.orderItem.groupBy({
      by: ["menuItemId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 10
    });
  } catch {
    items = [];
  }
  res.json(items);
}
// Get recent orders for dashboard
export async function getRecentOrders(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  let orders = [];
  try {
    orders = await prisma.order.findMany({
      orderBy: { orderTime: "desc" },
      take: 5
    });
  } catch {
    orders = [];
  }
  res.json(orders);
}
