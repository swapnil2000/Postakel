"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullReport = getFullReport;
exports.getSalesReport = getSalesReport;
exports.getInventoryReport = getInventoryReport;
exports.getCustomerReport = getCustomerReport;
// Multi-purpose stats for dashboard/reports
async function getFullReport(req, res) {
    const prisma = req.prisma;
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
// Example: Sales Report
async function getSalesReport(req, res) {
    const prisma = req.prisma;
    try {
        // Your report generation logic here...
        const orders = await prisma.order.findMany({
            where: { status: 'Completed' },
            include: { items: true }
        });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate sales report.' });
    }
}
// Example: Inventory Report
async function getInventoryReport(req, res) {
    const prisma = req.prisma;
    try {
        const items = await prisma.inventoryItem.findMany();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate inventory report.' });
    }
}
// Example: Customer Report
async function getCustomerReport(req, res) {
    const prisma = req.prisma;
    try {
        const customers = await prisma.customer.findMany();
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate customer report.' });
    }
}
//# sourceMappingURL=report.js.map