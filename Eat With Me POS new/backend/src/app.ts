/** @format */

import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth';
import { customerRoutes } from './routes/customer';
import { staffRoutes } from './routes/staff';
import { menuRoutes } from './routes/menu';
import { orderRoutes } from './routes/order';
import { tableRoutes } from './routes/table';
import { reservationRoutes } from './routes/reservation';
import { inventoryRoutes } from './routes/inventory';
import { supplierRoutes } from './routes/supplier';
import { expenseRoutes } from './routes/expense';
import { loyaltyRoutes } from './routes/loyalty';
import { reportRoutes } from './routes/report';
import { settingsRoutes } from './routes/settings';
import { aiRoutes } from './routes/ai';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/api/customers', customerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ai', aiRoutes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));
export default app;
