/** @format */

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import {
	getAllTables,
	createTable,
	assignOrder,
	freeTable,
	deleteTable,
	updateTableStatus,
} from '../controllers/tableController';
const router = Router();
router.use(authMiddleware);
router.get('/:restaurantID', getAllTables);
router.post('/', createTable);
router.patch('/:tableId/status', updateTableStatus);
router.post('/:tableId/assign', assignOrder);
router.patch('/:tableId/free', freeTable);
router.delete('/:tableId', deleteTable);
export default router;
