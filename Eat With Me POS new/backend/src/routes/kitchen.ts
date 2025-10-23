import { Router } from "express";
import { getKitchenOrders, updateKitchenOrderStatus } from "../controllers/kitchen";
import { getKitchenOrderById, getKitchenStats, searchKitchenOrders } from "../controllers/kitchen";
const router = Router();

router.get("/orders", getKitchenOrders);
router.put("/orders/:orderId/status", updateKitchenOrderStatus);
router.get("/orders/:orderId", getKitchenOrderById);
router.get("/orders/search/:query", searchKitchenOrders);
router.get("/orders/stats", getKitchenStats);

export { router as kitchenRoutes };
