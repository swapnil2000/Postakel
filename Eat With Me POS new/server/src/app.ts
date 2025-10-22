/** @format */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';

// Route imports
import authRoutes from './routes/auth';
import menuRoutes from './routes/menu';
import tableRoutes from './routes/table';
import posBillingRoutes from './routes/posBilling';
import kitchenRoutes from './routes/kitchen';
import dashboardRoutes from './routes/dashboard';
import restaurantRoutes from './routes/resturant';
import staffRoutes from './routes/staff';
import roleRoutes from './routes/role';
import permissionRoutes from './routes/permission';
import shiftRoutes from './routes/shift';
import salaryRoutes from './routes/salary';
import checkoutRoutes from './routes/checkout';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/pos', posBillingRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/checkout', checkoutRoutes);

// Error handling
app.use(errorHandler);

export default app;
