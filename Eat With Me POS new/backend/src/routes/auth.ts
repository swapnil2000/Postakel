import { Router } from 'express';
import { login } from '../controllers/auth';
import { signup } from '../controllers/signup';
import { listPublicPlans } from '../controllers/public/plansController';
import { tenantPrisma } from '../middleware/tenantPrisma';
import { staffLogin } from '../controllers/public/staffAuthController';

const router = Router();

router.get('/plans', listPublicPlans);
router.post('/login', tenantPrisma, login);
router.post('/signup', signup);
router.post('/staff/login', staffLogin);

export { router as authRoutes };
