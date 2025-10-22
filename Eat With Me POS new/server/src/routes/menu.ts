import { Router } from 'express';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController';

const router = Router();

router.get('/:restaurantId', getMenuItems);
router.post('/:restaurantId', addMenuItem);
router.put('/:id', updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;
