import { Router } from 'express';
import { PerformanceController } from '../controllers/PerformanceController';
import { authMiddleware } from '../middleware';

const router = Router();

router.post('/:userId/reviews', authMiddleware, PerformanceController.createReview);
router.get('/:userId/reviews', authMiddleware, PerformanceController.getReviews);
router.post('/goals', authMiddleware, PerformanceController.createGoal);
router.get('/goals', authMiddleware, PerformanceController.getGoals);

export default router;
