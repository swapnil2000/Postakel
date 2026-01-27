import { Router } from 'express';
import { TimeTrackingController } from '../controllers/TimeTrackingController';
import { authMiddleware } from '../middleware';

const router = Router();

router.post('/clock-in', authMiddleware, TimeTrackingController.clockIn);
router.post('/:timeEntryId/clock-out', authMiddleware, TimeTrackingController.clockOut);
router.post('/:timeEntryId/break-start', authMiddleware, TimeTrackingController.startBreak);
router.post('/:breakId/break-end', authMiddleware, TimeTrackingController.endBreak);
router.get('/', authMiddleware, TimeTrackingController.getTimeEntries);
router.get('/today-hours', authMiddleware, TimeTrackingController.getTodayHours);

export default router;
