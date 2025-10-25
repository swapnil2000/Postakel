import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getDashboardMetrics, getRecentOrders, getSalesByCategory, getTopSellingItems } from "../controllers/dashboard";
import { getMasterPrisma, getTenantPrisma } from "../utils/dbManager";

interface AuthenticatedRequest extends Request {
  user?: any;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });
  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET || "";
  if (!secret) return res.status(500).json({ error: "JWT secret not configured" });
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

const router = Router();

router.get("/metrics", getDashboardMetrics);
router.get("/sales/category", getSalesByCategory);
router.get("/sales/top-items", getTopSellingItems);
router.get("/orders/recent", getRecentOrders);
router.get("/:restaurantId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("Dashboard request for restaurantId:", req.params.restaurantId);
    const { restaurantId } = req.params;
    const { dateFilter } = req.query;
    const master = getMasterPrisma();
    const restaurant = await master.restaurant.findUnique({ where: { uniqueCode: restaurantId } });
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    const prisma = getTenantPrisma(restaurant.dbUrl);

    // Example: fetch some dashboard stats from tenant DB
    const orders = await prisma.order.findMany(); // You can filter by dateFilter if needed
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      stats: {
        orders: totalOrders,
        sales: totalSales,
        // Add more stats as needed
      }
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as dashboardRoutes };
