import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Logger } from './Logger';

const ADMIN_BACKEND_URL = typeof window !== 'undefined' && (window as any).REACT_APP_ADMIN_BACKEND_URL 
  ? (window as any).REACT_APP_ADMIN_BACKEND_URL 
  : 'http://localhost:4001/api';
const BACKEND_URL = typeof window !== 'undefined' && (window as any).REACT_APP_BACKEND_URL 
  ? (window as any).REACT_APP_BACKEND_URL 
  : 'http://localhost:5000/api/v1';

// Tenant configuration interface
export interface TenantConfig {
  id: string;
  subdomain: string;
  name: string;
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  theme: 'light' | 'dark';
  plan: 'starter' | 'professional' | 'enterprise' | 'custom';
  features: string[];
  branding: {
    showPoweredBy: boolean;
    customDomain: string | null;
    favicon: string | null;
  };
  settings: {
    email: string;
    phone: string;
    address: string;
    website: string;
    timezone: string;
    currency: string;
    currencySymbol: string;
    dateFormat: string;
    timeFormat: string;
    weekStartsOn: string;
    fiscalYearStart: string;
    taxId: string;
    industry: string;
    companySize: string;
    language: string;
    country: string;
  };
  subscription: {
    status: 'active' | 'trial' | 'suspended' | 'cancelled';
    planId: string;
    startDate: string;
    endDate: string | null;
    trialEndsAt: string | null;
    maxEmployees: number;
    usedEmployees: number;
  };
  createdAt: string;
  updatedAt: string;
}

// User interface
export interface TenantUser {
  id: number;
  tenantId: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  title: string;
  department: string;
  manager: string | null;
  location: string;
  startDate: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  avatar: string;
  permissions: string[];
  salary: number;
  employeeId: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

// Tenant-specific app data interface
export interface TenantAppData {
  timeTracking: {
    sessions: any[];
    currentSession: any;
    totalHoursToday: number;
    totalHoursWeek: number;
    totalHoursMonth: number;
    isCheckedIn: boolean;
  };
  tasks: {
    tasks: any[];
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    inProgressTasks: number;
  };
  leave: {
    requests: any[];
    balances: any[];
    holidays: any[];
    leaveTypes: any[];
  };
  performance: {
    reviews: any[];
    goals: any[];
    ratings: any[];
  };
  assets: {
    assets: any[];
    assignments: any[];
    totalValue: number;
    assignedAssets: number;
  };
  announcements: {
    announcements: any[];
    unreadCount: number;
  };
  reports: {
    generated: any[];
    scheduled: any[];
  };
}

// Organization data interface
export interface TenantOrganizationData {
  departments: Array<{
    id: number;
    name: string;
    description: string;
    head: string;
    active: boolean;
  }>;
  locations: Array<{
    id: number;
    name: string;
    address: string;
    timezone: string;
    active: boolean;
  }>;
  jobTitles: Array<{
    id: number;
    title: string;
    department: string;
    level: string;
    active: boolean;
  }>;
  managers: Array<{
    id: number;
    name: string;
    title: string;
    department: string;
  }>;
}

// Tenant context interface
interface TenantContextType {
  tenant: TenantConfig | null;
  users: TenantUser[];
  appData: TenantAppData;
  organizationData: TenantOrganizationData;
  currentUser: TenantUser | null;
  isLoading: boolean;
  error: string | null;
  
  // Auth actions
  registerCompany: (data: any) => Promise<{ signupId: string; message: string }>;
  verifyEmail: (token: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  
  // Tenant actions
  initializeTenant: (tenantId: string, userEmail: string, password: string) => Promise<boolean>;
  createTenant: (tenantData: Partial<TenantConfig>, adminData: Partial<TenantUser>) => Promise<TenantConfig>;
  updateTenantSettings: (settings: Partial<TenantConfig['settings']>) => Promise<void>;
  updateTenantBranding: (branding: Partial<TenantConfig>) => Promise<void>;
  updateAppData: (module: keyof TenantAppData, data: any) => void;
  updateOrganizationData: (type: keyof TenantOrganizationData, data: any[]) => void;
  addUser: (userData: Partial<TenantUser>) => Promise<TenantUser>;
  updateUser: (userId: number, userData: Partial<TenantUser>) => Promise<TenantUser>;
  deleteUsers: (userIds: number[]) => Promise<void>;
  logout: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

// Frontend Logger
class FrontendLogger {
  static info(module: string, action: string, message: string, data?: any) {
    console.log(`[INFO] [${module}] [${action}] ${message}`, data || '');
  }

  static error(module: string, action: string, message: string, error?: any) {
    console.error(`[ERROR] [${module}] [${action}] ${message}`, error || '');
  }

  static success(module: string, action: string, message: string, data?: any) {
    console.log(`[SUCCESS] [${module}] [${action}] ${message}`, data || '');
  }

  static warn(module: string, action: string, message: string, data?: any) {
    console.warn(`[WARN] [${module}] [${action}] ${message}`, data || '');
  }

  static debug(module: string, action: string, message: string, data?: any) {
    console.debug(`[DEBUG] [${module}] [${action}] ${message}`, data || '');
  }
}

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [currentUser, setCurrentUser] = useState<TenantUser | null>(null);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [appData, setAppData] = useState<TenantAppData>({
    timeTracking: {
      sessions: [],
      currentSession: null,
      totalHoursToday: 0,
      totalHoursWeek: 0,
      totalHoursMonth: 0,
      isCheckedIn: false,
    },
    tasks: { tasks: [], totalTasks: 0, completedTasks: 0, overdueTasks: 0, inProgressTasks: 0 },
    leave: { requests: [], balances: [], holidays: [], leaveTypes: [] },
    performance: { reviews: [], goals: [], ratings: [] },
    assets: { assets: [], assignments: [], totalValue: 0, assignedAssets: 0 },
    announcements: { announcements: [], unreadCount: 0 },
    reports: { generated: [], scheduled: [] },
  });

  const [organizationData, setOrganizationData] = useState<TenantOrganizationData>({
    departments: [],
    locations: [],
    jobTitles: [],
    managers: [],
  });

  // Company signup
  const registerCompany = useCallback(async (data: any) => {
    try {
      FrontendLogger.info('TenantContext', 'registerCompany', `Registering company: ${data.companyName}`);
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${ADMIN_BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      const result = await response.json();
      FrontendLogger.success('TenantContext', 'registerCompany', `Company registered: ${data.email}`, result);
      
      return result.data;
    } catch (err: any) {
      FrontendLogger.error('TenantContext', 'registerCompany', 'Registration failed', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Email verification
  const verifyEmail = useCallback(async (token: string) => {
    try {
      FrontendLogger.info('TenantContext', 'verifyEmail', 'Verifying email');
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${ADMIN_BACKEND_URL}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Email verification failed');
      }

      FrontendLogger.success('TenantContext', 'verifyEmail', 'Email verified successfully');
      return true;
    } catch (err: any) {
      FrontendLogger.error('TenantContext', 'verifyEmail', 'Verification failed', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Request password reset
  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      FrontendLogger.info('TenantContext', 'requestPasswordReset', `Requesting reset for ${email}`);
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${ADMIN_BACKEND_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Reset request failed');
      }

      FrontendLogger.success('TenantContext', 'requestPasswordReset', 'Reset email sent');
      return true;
    } catch (err: any) {
      FrontendLogger.error('TenantContext', 'requestPasswordReset', 'Request failed', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (token: string, newPassword: string) => {
    try {
      FrontendLogger.info('TenantContext', 'resetPassword', 'Resetting password');
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${ADMIN_BACKEND_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Password reset failed');
      }

      FrontendLogger.success('TenantContext', 'resetPassword', 'Password reset successfully');
      return true;
    } catch (err: any) {
      FrontendLogger.error('TenantContext', 'resetPassword', 'Reset failed', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize tenant (existing logic)
  const initializeTenant = useCallback(async (tenantId: string, userEmail: string, password: string) => {
    try {
      FrontendLogger.info('TenantContext', 'initializeTenant', `Initializing tenant: ${tenantId}`);
      setIsLoading(true);
      setError(null);

      // Fetch tenant configuration
      const tenantResponse = await fetch(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });

      if (!tenantResponse.ok) {
        throw new Error('Failed to fetch tenant configuration');
      }

      const tenantData = await tenantResponse.json();
      setTenant(tenantData);

      FrontendLogger.success('TenantContext', 'initializeTenant', `Tenant initialized: ${tenantId}`);
      return true;
    } catch (err: any) {
      FrontendLogger.error('TenantContext', 'initializeTenant', 'Initialization failed', err);
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stubs for other methods (keep existing functionality)
  const createTenant = useCallback(async (tenantData: Partial<TenantConfig>, adminData: Partial<TenantUser>) => {
    throw new Error('Method not implemented');
  }, []);

  const updateTenantSettings = useCallback(async (settings: Partial<TenantConfig['settings']>) => {
    throw new Error('Method not implemented');
  }, []);

  const updateTenantBranding = useCallback(async (branding: Partial<TenantConfig>) => {
    throw new Error('Method not implemented');
  }, []);

  const updateAppData = useCallback((module: keyof TenantAppData, data: any) => {
    setAppData((prev) => ({
      ...prev,
      [module]: data,
    }));
  }, []);

  const updateOrganizationData = useCallback((type: keyof TenantOrganizationData, data: any[]) => {
    setOrganizationData((prev) => ({
      ...prev,
      [type]: data,
    }));
  }, []);

  const addUser = useCallback(async (userData: Partial<TenantUser>) => {
    throw new Error('Method not implemented');
  }, []);

  const updateUser = useCallback(async (userId: number, userData: Partial<TenantUser>) => {
    throw new Error('Method not implemented');
  }, []);

  const deleteUsers = useCallback(async (userIds: number[]) => {
    throw new Error('Method not implemented');
  }, []);

  const logout = useCallback(() => {
    FrontendLogger.info('TenantContext', 'logout', 'Logging out');
    setTenant(null);
    setCurrentUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tenantId');
  }, []);

  const value: TenantContextType = {
    tenant,
    users,
    appData,
    organizationData,
    currentUser,
    isLoading,
    error,
    registerCompany,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    initializeTenant,
    createTenant,
    updateTenantSettings,
    updateTenantBranding,
    updateAppData,
    updateOrganizationData,
    addUser,
    updateUser,
    deleteUsers,
    logout,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
