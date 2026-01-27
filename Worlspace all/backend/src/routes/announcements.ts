import { Router } from 'express';
import { AnnouncementController } from '../controllers/AnnouncementController';
import { authMiddleware } from '../middleware';

const router = Router();

router.post('/', authMiddleware, AnnouncementController.createAnnouncement);
router.get('/', authMiddleware, AnnouncementController.getAnnouncements);
router.post('/:announcementId/view', authMiddleware, AnnouncementController.markAsViewed);

export default router;
