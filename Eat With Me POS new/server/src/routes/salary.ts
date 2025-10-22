import { Router } from 'express';
import { addSalaryPayment } from '../controllers/salaryController';
const router = Router();

router.post('/', addSalaryPayment);
export default router;
