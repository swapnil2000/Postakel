import { Router } from 'express';
import { startShift, endShift } from '../controllers/shiftController';
const router = Router();

router.post('/start', startShift);
router.post('/end', endShift);

export default router;
