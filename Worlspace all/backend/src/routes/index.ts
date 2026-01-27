import { Router } from 'express';
import authRoutes from './auth';
import employeeAuthRoutes from './employeeAuth';
import userRoutes from './users';
import timetrackingRoutes from './timetracking';
import leaveRoutes from './leave';
import taskRoutes from './tasks';
import assetRoutes from './assets';
import announcementRoutes from './announcements';
import performanceRoutes from './performance';
import signupRoutes from './signup';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/auth', employeeAuthRoutes);
router.use('/users', userRoutes);
router.use('/timetracking', timetrackingRoutes);
router.use('/leave', leaveRoutes);
router.use('/tasks', taskRoutes);
router.use('/assets', assetRoutes);
router.use('/announcements', announcementRoutes);
router.use('/performance', performanceRoutes);
router.use('/webhook', signupRoutes);

export default router;
