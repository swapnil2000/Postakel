import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { getOrders, updateOrder } from '../controllers/kitchenController';

const router = Router();

router.get('/orders', authenticateToken, getOrders);
router.put('/orders/:id', authenticateToken, updateOrder);

export default router;
