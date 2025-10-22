import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import {
  createOrder,
  listOrders,
  getOrder,
  listAvailableTables,
  createCustomer,
  updateCustomer
} from '../controllers/POSBillingController';

const router = Router();
router.use(authMiddleware);

router.post('/orders', createOrder);
router.get('/orders', listOrders);
router.get('/orders/:orderId', getOrder);

router.get('/tables/available', listAvailableTables);

router.post('/customers', createCustomer);
router.put('/customers/:id', updateCustomer);

export default router;