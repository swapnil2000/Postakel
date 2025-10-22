import { Router } from 'express';
import { getTables, addTable, updateTable, deleteTable } from '../controllers/tableController';

const router = Router();

router.get('/:restaurantId', getTables);
router.post('/:restaurantId', addTable);
router.put('/:id', updateTable);
router.delete('/:id', deleteTable);

export default router;
