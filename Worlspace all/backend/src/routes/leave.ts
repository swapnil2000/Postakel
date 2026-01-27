import { Router } from 'express';
import { LeaveController } from '../controllers/LeaveController';
import { authMiddleware } from '../middleware';

const router = Router();

router.post('/', authMiddleware, LeaveController.createLeaveRequest);
router.get('/', authMiddleware, LeaveController.getLeaveRequests);
router.post('/:leaveRequestId/approve', authMiddleware, LeaveController.approveLeaveRequest);
router.post('/:leaveRequestId/reject', authMiddleware, LeaveController.rejectLeaveRequest);
router.post('/types', authMiddleware, LeaveController.createLeaveType);

export default router;
