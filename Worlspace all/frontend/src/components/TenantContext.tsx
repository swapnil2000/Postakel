import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

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
  
  // Actions
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

// Mock tenant database - in real app this would be API calls
const mockTenants: Record<string, TenantConfig> = {
  'demo-company': {
    id: 'demo-company',
    subdomain: 'demo-company',
    name: 'Demo Company Inc.',
    logo: null,
    primaryColor: '#3b82f6',
    secondaryColor: '#6366f1',
    theme: 'light',
    plan: 'professional',
    features: ['ai-insights', 'advanced-reports', 'custom-workflows'],
    branding: {
      showPoweredBy: true,
      customDomain: null,
      favicon: null,
    },
    settings: {
      email: 'admin@democompany.com',
      phone: '+91 98765 43210',
      address: '123 Business Park, Sector 5, Mumbai, Maharashtra 400001',
      website: 'www.democompany.com',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      currencySymbol: '₹',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12',
      weekStartsOn: 'Monday',
      fiscalYearStart: 'January',
      taxId: 'XX-XXXXXXX',
      industry: 'Technology & Software',
      companySize: '26-50 employees',
      language: 'English',
      country: 'India',
    },
    subscription: {
      status: 'active',
      planId: 'professional',
      startDate: '2024-01-01',
      endDate: null,
      trialEndsAt: null,
      maxEmployees: 100,
      usedEmployees: 5,
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  'tech-startup': {
    id: 'tech-startup',
    subdomain: 'tech-startup',
    name: 'TechStartup AI',
    logo: null,
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    theme: 'light',
    plan: 'starter',
    features: ['basic-ai', 'standard-reports'],
    branding: {
      showPoweredBy: true,
      customDomain: null,
      favicon: null,
    },
    settings: {
      email: 'hello@techstartup.ai',
      phone: '+91 87654 32109',
      address: '456 Innovation Hub, Bangalore, Karnataka 560001',
      website: 'www.techstartup.ai',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      currencySymbol: '₹',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12',
      weekStartsOn: 'Monday',
      fiscalYearStart: 'January',
      taxId: 'XX-XXXXXXX',
      industry: 'Technology & Software',
      companySize: '11-25 employees',
      language: 'English',
      country: 'India',
    },
    subscription: {
      status: 'trial',
      planId: 'starter',
      startDate: '2024-12-01',
      endDate: null,
      trialEndsAt: '2024-12-15',
      maxEmployees: 25,
      usedEmployees: 8,
    },
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  }
};

// Mock users database
const mockUsers: Record<string, TenantUser[]> = {
  'demo-company': [
    {
      id: 1,
      tenantId: 'demo-company',
      name: 'John Admin',
      email: 'john.admin@democompany.com',
      role: 'admin',
      title: 'HR Manager',
      department: 'HR',
      manager: null,
      location: 'Mumbai, Maharashtra',
      startDate: '2023-01-15',
      phone: '+91 98765 43210',
      status: 'active',
      avatar: 'JA',
      permissions: [],
      salary: 8075000,
      employeeId: 'DC001',
      lastLogin: '2024-01-01T08:00:00Z',
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      tenantId: 'demo-company',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@democompany.com',
      role: 'employee',
      title: 'Senior UI/UX Designer',
      department: 'Design',
      manager: 'Emily Davis',
      location: 'Mumbai, Maharashtra',
      startDate: '2023-03-20',
      phone: '+91 87654 32109',
      status: 'active',
      avatar: 'SJ',
      permissions: [],
      salary: 6630000,
      employeeId: 'DC002',
      lastLogin: '2024-01-01T09:30:00Z',
      createdAt: '2023-03-20T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      tenantId: 'demo-company',
      name: 'Mike Wilson',
      email: 'mike.wilson@democompany.com',
      role: 'employee',
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      manager: 'David Brown',
      location: 'Bangalore, Karnataka',
      startDate: '2023-02-10',
      phone: '+91 76543 21098',
      status: 'active',
      avatar: 'MW',
      permissions: [],
      salary: 8925000,
      employeeId: 'DC003',
      lastLogin: '2024-01-01T10:15:00Z',
      createdAt: '2023-02-10T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 4,
      tenantId: 'demo-company',
      name: 'Emily Davis',
      email: 'emily.davis@democompany.com',
      role: 'employee',
      title: 'Product Manager',
      department: 'Product',
      manager: 'John Admin',
      location: 'Pune, Maharashtra',
      startDate: '2022-11-05',
      phone: '+91 65432 10987',
      status: 'active',
      avatar: 'ED',
      permissions: [],
      salary: 7820000,
      employeeId: 'DC004',
      lastLogin: '2024-01-01T07:45:00Z',
      createdAt: '2022-11-05T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 5,
      tenantId: 'demo-company',
      name: 'David Brown',
      email: 'david.brown@democompany.com',
      role: 'employee',
      title: 'Engineering Manager',
      department: 'Engineering',
      manager: 'John Admin',
      location: 'Hyderabad, Telangana',
      startDate: '2022-08-15',
      phone: '+91 54321 09876',
      status: 'active',
      avatar: 'DB',
      permissions: [],
      salary: 9350000,
      employeeId: 'DC005',
      lastLogin: '2024-01-01T08:30:00Z',
      createdAt: '2022-08-15T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
  ],
  'tech-startup': [
    {
      id: 1,
      tenantId: 'tech-startup',
      name: 'Alex Founder',
      email: 'alex@techstartup.ai',
      role: 'admin',
      title: 'CEO & Founder',
      department: 'Executive',
      manager: null,
      location: 'Bangalore, Karnataka',
      startDate: '2024-01-01',
      phone: '+91 43210 98765',
      status: 'active',
      avatar: 'AF',
      permissions: [],
      salary: 10200000,
      employeeId: 'TS001',
      lastLogin: '2024-12-01T10:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-12-01T00:00:00Z',
    }
  ]
};

// Default app data structure
const getDefaultAppData = (): TenantAppData => ({
  timeTracking: {
    sessions: [],
    currentSession: null,
    totalHoursToday: 0,
    totalHoursWeek: 0,
    totalHoursMonth: 0,
    isCheckedIn: false
  },
  tasks: {
    tasks: [],
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    inProgressTasks: 0
  },
  leave: {
    requests: [],
    balances: [],
    holidays: [],
    leaveTypes: []
  },
  performance: {
    reviews: [],
    goals: [],
    ratings: []
  },
  assets: {
    assets: [],
    assignments: [],
    totalValue: 0,
    assignedAssets: 0
  },
  announcements: {
    announcements: [],
    unreadCount: 0
  },
  reports: {
    generated: [],
    scheduled: []
  }
});

// Default organization data
const getDefaultOrganizationData = (): TenantOrganizationData => ({
  departments: [
    { id: 1, name: 'Engineering', description: 'Software development and technical teams', head: 'David Brown', active: true },
    { id: 2, name: 'Design', description: 'UI/UX and product design team', head: 'Emily Davis', active: true },
    { id: 3, name: 'Product', description: 'Product management and strategy', head: 'Emily Davis', active: true },
    { id: 4, name: 'Marketing', description: 'Marketing and customer acquisition', head: 'Sarah Miller', active: true },
    { id: 5, name: 'Sales', description: 'Sales and business development', head: 'Robert Taylor', active: true },
    { id: 6, name: 'HR', description: 'Human resources and people operations', head: 'John Admin', active: true },
    { id: 7, name: 'Finance', description: 'Finance and accounting operations', head: 'John Admin', active: true }
  ],
  locations: [
    { id: 1, name: 'Mumbai, Maharashtra', address: '123 Business Park, Andheri East, Mumbai, Maharashtra 400069', timezone: 'Asia/Kolkata', active: true },
    { id: 2, name: 'Bangalore, Karnataka', address: '456 Tech Hub, Electronic City, Bangalore, Karnataka 560100', timezone: 'Asia/Kolkata', active: true },
    { id: 3, name: 'Hyderabad, Telangana', address: '789 Innovation District, HITEC City, Hyderabad, Telangana 500081', timezone: 'Asia/Kolkata', active: true },
    { id: 4, name: 'Pune, Maharashtra', address: '321 IT Park, Hinjewadi, Pune, Maharashtra 411057', timezone: 'Asia/Kolkata', active: true },
    { id: 5, name: 'Chennai, Tamil Nadu', address: '654 Software City, OMR, Chennai, Tamil Nadu 600096', timezone: 'Asia/Kolkata', active: true },
    { id: 6, name: 'Delhi NCR, Delhi', address: '987 Corporate Center, Gurgaon, Haryana 122001', timezone: 'Asia/Kolkata', active: true }
  ],
  jobTitles: [
    { id: 1, title: 'Senior UI/UX Designer', department: 'Design', level: 'Senior', active: true },
    { id: 2, title: 'UI/UX Designer', department: 'Design', level: 'Mid', active: true },
    { id: 3, title: 'Junior UI/UX Designer', department: 'Design', level: 'Junior', active: true },
    { id: 4, title: 'Senior Full Stack Developer', department: 'Engineering', level: 'Senior', active: true },
    { id: 5, title: 'Full Stack Developer', department: 'Engineering', level: 'Mid', active: true },
    { id: 6, title: 'Junior Developer', department: 'Engineering', level: 'Junior', active: true },
    { id: 7, title: 'Engineering Manager', department: 'Engineering', level: 'Manager', active: true },
    { id: 8, title: 'Product Manager', department: 'Product', level: 'Senior', active: true },
    { id: 9, title: 'Senior Product Manager', department: 'Product', level: 'Senior', active: true },
    { id: 10, title: 'Marketing Specialist', department: 'Marketing', level: 'Mid', active: true },
    { id: 11, title: 'Marketing Manager', department: 'Marketing', level: 'Manager', active: true },
    { id: 12, title: 'Sales Representative', department: 'Sales', level: 'Junior', active: true },
    { id: 13, title: 'Senior Sales Representative', department: 'Sales', level: 'Senior', active: true },
    { id: 14, title: 'Sales Manager', department: 'Sales', level: 'Manager', active: true },
    { id: 15, title: 'HR Specialist', department: 'HR', level: 'Mid', active: true },
    { id: 16, title: 'HR Manager', department: 'HR', level: 'Manager', active: true },
    { id: 17, title: 'Accountant', department: 'Finance', level: 'Mid', active: true },
    { id: 18, title: 'Finance Manager', department: 'Finance', level: 'Manager', active: true }
  ],
  managers: [
    { id: 1, name: 'David Brown', title: 'Engineering Manager', department: 'Engineering' },
    { id: 2, name: 'Emily Davis', title: 'Product Manager', department: 'Product' },
    { id: 3, name: 'Sarah Miller', title: 'Marketing Manager', department: 'Marketing' },
    { id: 4, name: 'Robert Taylor', title: 'Sales Manager', department: 'Sales' },
    { id: 5, name: 'John Admin', title: 'HR Manager', department: 'HR' }
  ]
});

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [appData, setAppData] = useState<TenantAppData>(getDefaultAppData());
  const [organizationData, setOrganizationData] = useState<TenantOrganizationData>(getDefaultOrganizationData());
  const [currentUser, setCurrentUser] = useState<TenantUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize tenant from URL or stored session
  useEffect(() => {
    const initializeTenantFromUrl = async () => {
      // In real app, this would:
      // 1. Extract subdomain from URL
      // 2. Check for stored session
      // 3. Validate tenant existence
      // 4. Load tenant data from API
      
      const storedSession = localStorage.getItem('tenant-session');
      if (storedSession) {
        try {
          const session = JSON.parse(storedSession);
          await initializeTenant(session.tenantId, session.userEmail, '', true);
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('tenant-session');
        }
      }
    };

    initializeTenantFromUrl();
  }, []);

  const initializeTenant = async (
    tenantId: string, 
    userEmail: string, 
    password: string,
    fromSession: boolean = false
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[FRONTEND] Initializing tenant:', tenantId, 'Email:', userEmail);

      // Call backend employee login API
      const backendUrl = 'http://localhost:5000/api/v1';
      
      console.log('[FRONTEND] Sending login request to:', backendUrl + '/employee-login');

      const loginPayload = {
        companyId: tenantId,
        email: userEmail,
        password: password
      };

      console.log('[FRONTEND] Login payload:', loginPayload);

      const loginResponse = await fetch(`${backendUrl}/employee-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        console.error('[FRONTEND] Login failed:', errorData);
        throw new Error(errorData.error || 'Invalid credentials');
      }

      const loginData = await loginResponse.json();
      console.log('[FRONTEND] Login successful!', loginData);

      // Extract token and user info
      const token = loginData.data?.token;
      if (!token) {
        throw new Error('No token returned from login');
      }

      // Store token for future requests
      localStorage.setItem('auth-token', token);
      localStorage.setItem('company-id', tenantId);

      // Find tenant from mock data or create from login response
      const tenantConfig = mockTenants[tenantId] || {
        id: tenantId,
        subdomain: tenantId,
        name: 'Company',
        logo: null,
        primaryColor: '#3b82f6',
        secondaryColor: '#6366f1',
        theme: 'light' as const,
        plan: 'professional' as const,
        features: ['ai-insights', 'advanced-reports'],
        branding: {
          showPoweredBy: true,
          customDomain: null,
          favicon: null,
        },
        settings: {
          email: userEmail,
          phone: '',
          address: '',
          website: '',
          timezone: 'Asia/Kolkata',
          currency: 'INR',
          currencySymbol: '₹',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '12',
          weekStartsOn: 'Monday',
          fiscalYearStart: 'January',
          taxId: '',
          industry: '',
          companySize: '',
          language: 'English',
          country: 'India',
        },
        subscription: {
          status: 'active' as const,
          planId: 'professional',
          startDate: new Date().toISOString(),
          endDate: null,
          trialEndsAt: null,
          maxEmployees: 100,
          usedEmployees: 1,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Find user
      const tenantUsers = mockUsers[tenantId] || [];
      let user = tenantUsers.find(u => u.email === userEmail);
      
      if (!user) {
        // Create user from login response if not found locally
        user = {
          id: 1,
          tenantId: tenantId,
          name: loginData.data?.user?.name || userEmail.split('@')[0],
          email: userEmail,
          role: 'employee',
          title: 'Employee',
          department: 'General',
          manager: null,
          location: 'Headquarters',
          startDate: new Date().toISOString().split('T')[0],
          phone: '',
          status: 'active',
          avatar: userEmail[0].toUpperCase(),
          permissions: [],
          salary: 0,
          employeeId: `EMP001`,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      // Set tenant context
      setTenant(tenantConfig);
      setUsers(tenantUsers);
      setCurrentUser(user);
      setAppData(getDefaultAppData());
      setOrganizationData(getDefaultOrganizationData());

      // Store session
      if (!fromSession) {
        localStorage.setItem('tenant-session', JSON.stringify({
          tenantId,
          userEmail,
          timestamp: Date.now()
        }));
      }

      console.log('[FRONTEND] Tenant initialized successfully!');
      return true;
    } catch (err) {
      console.error('[FRONTEND] Error initializing tenant:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize tenant');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createTenant = async (
    tenantData: Partial<TenantConfig>,
    adminData: Partial<TenantUser> & { password?: string }
  ): Promise<TenantConfig> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[FRONTEND] Creating tenant with data:', tenantData);
      
      // Call admin-backend API to create company signup
      const adminBackendUrl = 'http://localhost:4001/api';
      
      const signupPayload = {
        companyName: tenantData.name,
        email: adminData.email,
        phone: '',
        address: '',
        city: '',
        country: '',
        industry: tenantData.settings?.industry || '',
        companySize: tenantData.settings?.companySize || '',
        plan: tenantData.plan || 'starter',
        adminName: adminData.name,
        password: adminData.password || 'temp-password-123',
      };

      console.log('[FRONTEND] Sending signup request to admin-backend:', adminBackendUrl + '/auth/signup');
      console.log('[FRONTEND] Payload:', signupPayload);

      const signupResponse = await fetch(`${adminBackendUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupPayload),
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        console.error('[FRONTEND] Signup failed:', errorData);
        throw new Error(errorData.error || 'Failed to create company signup');
      }

      const signupData = await signupResponse.json();
      console.log('[FRONTEND] Signup successful! Company ID:', signupData.data?.companyId);
      console.log('[FRONTEND] Full response:', signupData);

      // Extract company ID from response
      const companyId = signupData.data?.companyId;
      if (!companyId) {
        throw new Error('No company ID returned from signup');
      }

      // Create new tenant config from signup response
      const newTenant: TenantConfig = {
        id: companyId,
        subdomain: tenantData.subdomain || `company-${companyId}`,
        name: tenantData.name || 'New Company',
        logo: null,
        primaryColor: '#3b82f6',
        secondaryColor: '#6366f1',
        theme: 'light',
        plan: tenantData.plan as any || 'professional',
        features: ['ai-insights', 'advanced-reports'],
        branding: {
          showPoweredBy: true,
          customDomain: null,
          favicon: null,
        },
        settings: {
          email: adminData.email || '',
          phone: '+91 98765 00000',
          address: '',
          website: '',
          timezone: 'Asia/Kolkata',
          currency: 'INR',
          currencySymbol: '₹',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '12',
          weekStartsOn: 'Monday',
          fiscalYearStart: 'January',
          taxId: '',
          industry: tenantData.settings?.industry || 'Technology',
          companySize: tenantData.settings?.companySize || '1-10 employees',
          language: 'English',
          country: 'India',
        },
        subscription: {
          status: 'active',
          planId: tenantData.plan as any || 'professional',
          startDate: new Date().toISOString(),
          endDate: null,
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          maxEmployees: 100,
          usedEmployees: 1,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create admin user
      const adminUser: TenantUser = {
        id: 1,
        tenantId: companyId,
        name: adminData.name || 'Admin User',
        email: adminData.email || '',
        role: 'admin',
        title: 'Administrator',
        department: 'Management',
        manager: null,
        location: 'Headquarters',
        startDate: new Date().toISOString().split('T')[0],
        phone: '+91 98765 00000',
        status: 'active',
        avatar: (adminData.name || 'AU').split(' ').map(n => n[0]).join(''),
        permissions: [],
        salary: 0,
        employeeId: `${companyId.toUpperCase().slice(0, 3)}001`,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store in mock database
      mockTenants[companyId] = newTenant;
      mockUsers[companyId] = [adminUser];

      // Initialize the new tenant
      setTenant(newTenant);
      setUsers([adminUser]);
      setCurrentUser(adminUser);
      setAppData(getDefaultAppData());
      setOrganizationData(getDefaultOrganizationData());

      // Store session
      localStorage.setItem('tenant-session', JSON.stringify({
        tenantId: companyId,
        userEmail: adminUser.email,
        timestamp: Date.now()
      }));

      console.log('[FRONTEND] Tenant created successfully!');
      return newTenant;
    } catch (err) {
      console.error('[FRONTEND] Error creating tenant:', err);
      setError(err instanceof Error ? err.message : 'Failed to create tenant');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTenantSettings = async (settings: Partial<TenantConfig['settings']>): Promise<void> => {
    if (!tenant) return;

    try {
      const updatedTenant = {
        ...tenant,
        settings: { ...tenant.settings, ...settings },
        updatedAt: new Date().toISOString()
      };

      mockTenants[tenant.id] = updatedTenant;
      setTenant(updatedTenant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    }
  };

  const updateTenantBranding = async (branding: Partial<TenantConfig>): Promise<void> => {
    if (!tenant) return;

    try {
      const updatedTenant = {
        ...tenant,
        ...branding,
        updatedAt: new Date().toISOString()
      };

      mockTenants[tenant.id] = updatedTenant;
      setTenant(updatedTenant);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update branding');
      throw err;
    }
  };

  const updateAppData = useCallback((module: keyof TenantAppData, data: any) => {
    setAppData(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        ...data
      }
    }));
  }, []);

  const updateOrganizationData = useCallback((type: keyof TenantOrganizationData, data: any[]) => {
    setOrganizationData(prev => ({
      ...prev,
      [type]: data
    }));
  }, []);

  const addUser = async (userData: Partial<TenantUser>): Promise<TenantUser> => {
    if (!tenant) throw new Error('No tenant context');

    try {
      const newUser: TenantUser = {
        id: users.length + 1,
        tenantId: tenant.id,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'employee',
        title: userData.title || '',
        department: userData.department || '',
        manager: userData.manager || null,
        location: userData.location || '',
        startDate: userData.startDate || new Date().toISOString().split('T')[0],
        phone: userData.phone || '',
        status: 'active',
        avatar: (userData.name || 'U').split(' ').map(n => n[0]).join(''),
        permissions: userData.permissions || [],
        salary: userData.salary || 0,
        employeeId: `${tenant.id.toUpperCase().slice(0, 3)}${String(users.length + 1).padStart(3, '0')}`,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      mockUsers[tenant.id] = updatedUsers;
      setUsers(updatedUsers);

      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
      throw err;
    }
  };

  const updateUser = async (userId: number, userData: Partial<TenantUser>): Promise<TenantUser> => {
    if (!tenant) throw new Error('No tenant context');

    try {
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, ...userData, updatedAt: new Date().toISOString() }
          : user
      );

      mockUsers[tenant.id] = updatedUsers;
      setUsers(updatedUsers);

      const updatedUser = updatedUsers.find(u => u.id === userId);
      if (!updatedUser) throw new Error('User not found');

      // Update current user if it's the same user
      if (currentUser?.id === userId) {
        setCurrentUser(updatedUser);
      }

      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  };

  const deleteUsers = async (userIds: number[]): Promise<void> => {
    if (!tenant) throw new Error('No tenant context');

    try {
      const remainingUsers = users.filter(user => !userIds.includes(user.id));
      mockUsers[tenant.id] = remainingUsers;
      setUsers(remainingUsers);

      // If current user got deleted, log them out gracefully
      if (currentUser && userIds.includes(currentUser.id)) {
        setCurrentUser(null);
        localStorage.removeItem('tenant-session');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user(s)');
      throw err;
    }
  };

  const logout = () => {
    setTenant(null);
    setUsers([]);
    setCurrentUser(null);
    setAppData(getDefaultAppData());
    setOrganizationData(getDefaultOrganizationData());
    setError(null);
    localStorage.removeItem('tenant-session');
  };

  const value: TenantContextType = {
    tenant,
    users,
    appData,
    organizationData,
    currentUser,
    isLoading,
    error,
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
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

// Helper hook for tenant-aware operations
export function useTenantAuth() {
  const { tenant, currentUser, logout } = useTenant();
  
  const isAuthenticated = Boolean(tenant && currentUser);
  const isAdmin = currentUser?.role === 'admin';
  const canAccessModule = useCallback((moduleId: string) => {
    if (!tenant || !currentUser) return false;
    if (isAdmin) return true;
    return tenant.features.includes(moduleId);
  }, [tenant, currentUser, isAdmin]);

  return {
    isAuthenticated,
    isAdmin,
    canAccessModule,
    tenant,
    currentUser,
    logout
  };
}