import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { authMiddleware } from '../middleware';

const router = Router();

router.post('/', authMiddleware, TaskController.createTask);
router.get('/', authMiddleware, TaskController.getTasks);
router.put('/:taskId', authMiddleware, TaskController.updateTask);
router.post('/:taskId/complete', authMiddleware, TaskController.completeTask);
router.post('/:taskId/comments', authMiddleware, TaskController.addTaskComment);

export default router;
