import { Router } from 'express';
import { login } from '../controllers/auth';
import { signup } from '../controllers/signup';
const router = Router();

router.post('/login', login);
router.post('/signup', signup);

export { router as authRoutes };
