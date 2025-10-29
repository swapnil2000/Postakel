import { Router } from "express";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  searchOrders,
  getOrderStats
} from "../controllers/order";

const router = Router();

router.get("/", getAllOrders);
router.get("/search", searchOrders);
router.get("/stats", getOrderStats);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

// SSE endpoint for order updates
router.get('/stream', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  // Example: send a ping every 10 seconds
  const interval = setInterval(() => {
    res.write(`data: ping\n\n`);
  }, 10000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

export { router as orderRoutes };
