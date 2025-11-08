/** @format */

import express from 'express';
import cors from 'cors';
import { tenantPrisma } from './middleware/tenantPrisma';
import { authenticateToken } from './middleware/auth';
import { signup } from './controllers/signup';

// --- FIX: Use the correct import style for each specific route ---
import { authRoutes } from './routes/auth';
import { staffRoutes } from './routes/staff';
import menuRoutes from './routes/menu'; // Corrected to default import
import { orderRoutes } from './routes/order';
import { tableRoutes } from './routes/table';
import { kitchenRoutes } from './routes/kitchen';
import categoryRoleRoutes from './routes/categoryRole'; // Corrected to default import
import settingsRoutes from './routes/settings'; // Corrected to default import
import inventoryRoutes from './routes/inventory'; // Corrected to default import
import { supplierRoutes } from './routes/supplier';
import { reportRoutes } from './routes/report';
import { customerRoutes } from './routes/customer';
import { reservationRoutes } from './routes/reservation';
import { expenseRoutes } from './routes/expense';
import { dashboardRoutes } from './routes/dashboard';
import { aiRoutes } from './routes/ai';
import { loyaltyRoutes } from './routes/loyalty';
import { marketingRoutes } from './routes/marketing';
import { shiftRoutes } from './routes/shifts';

const app = express();

app.use(cors());
app.use(express.json());

// --- Public Routes ---
// These routes do not require any tenant context or authentication.
app.post('/signup', signup);

// --- Tenant-Specific Public Routes ---
// These routes require tenant context (via tenantPrisma) but not authentication.
app.use('/login', tenantPrisma, authRoutes);

// --- Protected Routes ---
// All routes below this point require both a valid tenant context AND a valid authentication token.
// The middleware is applied once here for all subsequent /api routes.
app.use('/api', tenantPrisma, authenticateToken);

// Wire up all your API routes to the /api base path
app.use('/api/staff', staffRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/category-role', categoryRoleRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/shifts', shiftRoutes);

export default app;
