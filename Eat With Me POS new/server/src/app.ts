/** @format */

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import resturantRoutes from './routes/resturant';
import { errorHandler } from './middlewares/errorHandler';
import tableRoutes from './routes/table';

export const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/resturant', resturantRoutes);
app.use('/api/tables', tableRoutes);

app.use(errorHandler);

export default app;
