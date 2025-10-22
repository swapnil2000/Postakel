import { Router } from 'express';
import { saveCheckout } from '../controllers/checkoutController';

const router = Router();

router.post('/', saveCheckout);

export default router;
