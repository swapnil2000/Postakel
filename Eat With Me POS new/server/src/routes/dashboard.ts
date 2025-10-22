import { Router } from 'express';
import { dashboardOverview } from '../controllers/dashboardController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/:restaurantId', authenticateToken, dashboardOverview);

export default router;
