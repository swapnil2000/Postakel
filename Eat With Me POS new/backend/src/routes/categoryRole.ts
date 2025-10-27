import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/categoryRole';

const router = Router();

// --- Category routes ---
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// --- Role routes ---
router.get('/roles', getRoles);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

export default router;
