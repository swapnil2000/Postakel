import { Router } from 'express';
import { adminLogin } from '../controllers/admin/authController';
import { adminAuth } from '../middleware/adminAuth';
import {
  listTenants,
  getTenantDetail,
  updateTenantModules,
  listServicePlans,
  assignTenantPlan,
} from '../controllers/admin/tenantController';
import {
  getAdminOverview,
  getRevenueTrend,
  getLocationBreakdown,
} from '../controllers/admin/analyticsController';
import { createServicePlan, updateServicePlan } from '../controllers/admin/planController';

const router = Router();

router.post('/auth/login', adminLogin);

router.use(adminAuth);

router.get('/overview', getAdminOverview);
router.get('/tenants', listTenants);
router.get('/tenants/:id', getTenantDetail);
router.post('/tenants/:id/modules', updateTenantModules);
router.post('/tenants/:id/plan', assignTenantPlan);
router.get('/plans', listServicePlans);
router.post('/plans', createServicePlan);
router.put('/plans/:id', updateServicePlan);
router.get('/analytics/revenue', getRevenueTrend);
router.get('/analytics/locations', getLocationBreakdown);

export { router as adminRoutes };
