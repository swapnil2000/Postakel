/** @format */

import { Router } from 'express';
import {
	startPOSOrder,
	finalizePOSOrder,
	getPOSOrdersToday,
	refundPOSOrder,
} from '../controllers/posbilling';

const router = Router();

router.post('/order', startPOSOrder);
router.put('/order/:id/checkout', finalizePOSOrder);
router.get('/orders/today', getPOSOrdersToday);
router.post('/order/:id/refund', refundPOSOrder);
export { router as posBillingRoutes };
