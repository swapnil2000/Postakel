import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware';

const router = Router();

router.post('/register', AuthController.registerTenant);
router.post('/login', AuthController.login);
router.get('/me', authMiddleware, AuthController.getCurrentUser);
router.post('/change-password', authMiddleware, AuthController.changePassword);

export default router;
