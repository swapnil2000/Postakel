// Type definitions for the application
import { Request } from 'express';

export interface TenantConfig {
  id: string;
  subdomain: string;
  name: string;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  dbHost: string;
  dbPort: number;
  plan: string;
  features: string[];
  settings: {
    timezone: string;
    currency: string;
    currencySymbol: string;
    dateFormat: string;
    timeFormat: string;
  };
}

export interface UserPayload {
  userId: string;
  tenantId: string;
  email: string;
  role: 'admin' | 'employee';
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
  tenant?: TenantConfig;
  body: any;
  params: any;
  query: any;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: 'admin' | 'employee';
  department?: string;
  title?: string;
  manager?: string;
}

export interface LeaveRequestInput {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface TaskInput {
  title: string;
  description?: string;
  assignedToId?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface TimeEntryInput {
  location?: string;
  project?: string;
  description?: string;
}

export interface BreakInput {
  type: 'coffee' | 'lunch' | 'personal' | 'meeting';
  notes?: string;
}

export interface AssetInput {
  name: string;
  category: string;
  description?: string;
  serialNumber?: string;
  purchaseDate: string;
  purchaseCost: number;
  vendor?: string;
}

export interface AnnouncementInput {
  title: string;
  content: string;
  category?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  expiresAt?: string;
}
