import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware, adminMiddleware } from '../middleware';

const router = Router();

router.post('/', authMiddleware, adminMiddleware, UserController.createUser);
router.get('/', authMiddleware, UserController.getUsers);
router.get('/:userId', authMiddleware, UserController.getUserById);
router.put('/:userId', authMiddleware, UserController.updateUser);
router.delete('/:userId', authMiddleware, adminMiddleware, UserController.deleteUser);

export default router;
