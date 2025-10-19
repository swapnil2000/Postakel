/** @format */

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import {
	getRestaurant,
	updateRestaurant,
	createOrder,
	listOrders,
} from '../controllers/resturantController';
const router = Router();
router.use(authMiddleware);
router.get('/', getRestaurant);
router.put('/', updateRestaurant);
router.post('/orders', createOrder);
router.get('/orders', listOrders);
export default router;
