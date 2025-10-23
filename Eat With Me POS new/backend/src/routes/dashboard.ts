import { Router } from "express";
import { getDashboardMetrics, getRecentOrders, getSalesByCategory, getTopSellingItems } from "../controllers/dashboard";
const router = Router();

router.get("/metrics", getDashboardMetrics);
router.get("/sales/category", getSalesByCategory);
router.get("/sales/top-items", getTopSellingItems);
router.get("/orders/recent", getRecentOrders);

export { router as dashboardRoutes };
