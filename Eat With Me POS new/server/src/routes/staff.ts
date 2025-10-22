import { Router } from 'express';
import { staffController } from '../controllers/staffController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', staffController.createStaffMember);
router.get('/', staffController.listStaffMembers);
router.put('/:id', staffController.updateStaffMember);
router.delete('/:id', staffController.deleteStaffMember);
router.get('/:id/shifts', staffController.getStaffShifts);

export default router;
