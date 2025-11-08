import { Router } from 'express';
import { getSalesReport, getInventoryReport, getCustomerReport } from '../controllers/report';
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

router.get('/sales', checkPermission('reports_view'), getSalesReport);
router.get('/inventory', checkPermission('reports_view'), getInventoryReport);
router.get('/customer', checkPermission('reports_view'), getCustomerReport);

export { router as reportRoutes };
