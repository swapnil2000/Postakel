/** @format */

import { Router } from 'express';
import { getAllCustomers, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customer';
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

router.get('/', getAllCustomers);
router.post('/', checkPermission('customer_management'), createCustomer);
router.put('/:id', checkPermission('customer_management'), updateCustomer);
router.delete('/:id', checkPermission('customer_management'), deleteCustomer);

export { router as customerRoutes };
