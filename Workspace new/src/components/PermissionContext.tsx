import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define granular permission structure
export interface ModulePermission {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'hr' | 'finance' | 'reporting' | 'admin';
  actions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
    manage: boolean;
  };
  dataScope: 'own' | 'department' | 'all'; // What data can they see
  subPermissions?: {
    [key: string]: boolean;
  };
}

export interface UserPermissions {
  userId: number;
  role: 'admin' | 'employee';
  modules: {
    [moduleId: string]: ModulePermission;
  };
  isAdmin: boolean;
}

// Define all available modules with their possible permissions
export const MODULE_DEFINITIONS = {
  dashboard: {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Main dashboard and overview',
    category: 'core' as const,
    availableActions: ['view'],
    availableDataScopes: ['own', 'all'],
    subPermissions: {
      viewCompanyStats: 'View company-wide statistics',
      viewTeamStats: 'View team/department statistics',
      viewPersonalStats: 'View personal statistics'
    }
  },
  timetracker: {
    id: 'timetracker',
    name: 'Time Tracker',
    description: 'Clock in/out and time tracking',
    category: 'core' as const,
    availableActions: ['view', 'create', 'edit', 'export'],
    availableDataScopes: ['own', 'department', 'all'],
    subPermissions: {
      clockInOut: 'Clock in and clock out',
      editOwnTime: 'Edit own time entries',
      editTeamTime: 'Edit team member time entries',
      approveTimesheet: 'Approve timesheets',
      viewReports: 'View time tracking reports',
      exportTimeData: 'Export time tracking data'
    }
  },
  leave: {
    id: 'leave',
    name: 'Leave Management',
    description: 'Manage leave requests and approvals',
    category: 'hr' as const,
    availableActions: ['view', 'create', 'edit', 'delete', 'export', 'manage'],
    availableDataScopes: ['own', 'department', 'all'],
    subPermissions: {
      requestLeave: 'Submit leave requests',
      cancelOwnLeave: 'Cancel own leave requests',
      viewOwnLeaves: 'View own leave history',
      viewTeamLeaves: 'View team leave calendar',
      approveLeaves: 'Approve/reject leave requests',
      manageLeaveTypes: 'Manage leave types and policies',
      viewLeaveReports: 'View leave reports and analytics',
      exportLeaveData: 'Export leave data'
    }
  },
  tasks: {
    id: 'tasks',
    name: 'Task Management',
    description: 'Create and manage tasks',
    category: 'core' as const,
    availableActions: ['view', 'create', 'edit', 'delete', 'export'],
    availableDataScopes: ['own', 'department', 'all'],
    subPermissions: {
      createTask: 'Create new tasks',
      editOwnTasks: 'Edit own tasks',
      editTeamTasks: 'Edit team tasks',
      deleteOwnTasks: 'Delete own tasks',
      deleteTeamTasks: 'Delete team tasks',
      assignTasks: 'Assign tasks to others',
      viewTaskReports: 'View task reports',
      exportTaskData: 'Export task data'
    }
  },
  team: {
    id: 'team',
    name: 'Employee Management',
    description: 'Manage team members and employee data',
    category: 'hr' as const,
    availableActions: ['view', 'create', 'edit', 'delete', 'export', 'manage'],
    availableDataScopes: ['own', 'department', 'all'],
    subPermissions: {
      viewEmployeeList: 'View employee directory',
      addEmployee: 'Add new employees',
      editEmployeeDetails: 'Edit employee information',
      deactivateEmployee: 'Deactivate employees',
      viewSalaryInfo: 'View salary information',
      editSalaryInfo: 'Edit salary information',
      viewEmployeeReports: 'View employee reports',
      exportEmployeeData: 'Export employee data',
      manageOrganization: 'Manage departments and organization structure'
    }
  },
  performance: {
    id: 'performance',
    name: 'Performance Management',
    description: 'Performance reviews and goal tracking',
    category: 'hr' as const,
    availableActions: ['view', 'create', 'edit', 'export', 'manage'],
    availableDataScopes: ['own', 'department', 'all'],
    subPermissions: {
      viewOwnPerformance: 'View own performance data',
      createGoals: 'Create performance goals',
      editOwnGoals: 'Edit own goals',
      viewTeamPerformance: 'View team performance',
      conductReviews: 'Conduct performance reviews',
      manageReviewCycles: 'Manage review cycles and templates',
      viewPerformanceReports: 'View performance reports',
      exportPerformanceData: 'Export performance data'
    }
  },
  salary: {
    id: 'salary',
    name: 'Salary Management',
    description: 'Manage employee salaries and compensation',
    category: 'finance' as const,
    availableActions: ['view', 'create', 'edit', 'export', 'manage'],
    availableDataScopes: ['own', 'department', 'all'],
    subPermissions: {
      viewOwnSalary: 'View own salary information',
      viewTeamSalaries: 'View team salary information',
      editSalaries: 'Edit salary information',
      processPayroll: 'Process payroll',
      manageBenefits: 'Manage benefits and compensation',
      viewSalaryReports: 'View salary reports',
      exportSalaryData: 'Export salary data'
    }
  },
  payroll: {
    id: 'payroll',
    name: 'Payroll Management',
    description: 'Process payroll and manage payments',
    category: 'finance' as const,
    availableActions: ['view', 'create', 'edit', 'export', 'manage'],
    availableDataScopes: ['department', 'all'],
    subPermissions: {
      runPayroll: 'Run payroll processing',
      viewPayrollReports: 'View payroll reports',
      managePayrollSettings: 'Manage payroll settings',
      exportPayrollData: 'Export payroll data',
      approvePayout: 'Approve payroll payouts',
      viewPayslips: 'View employee payslips'
    }
  },
  reports: {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'Generate and view system reports',
    category: 'reporting' as const,
    availableActions: ['view', 'create', 'export'],
    availableDataScopes: ['own', 'department', 'all'],
    subPermissions: {
      viewBasicReports: 'View basic reports',
      viewAdvancedReports: 'View advanced analytics',
      createCustomReports: 'Create custom reports',
      scheduleReports: 'Schedule automated reports',
      exportReports: 'Export reports',
      shareReports: 'Share reports with others'
    }
  },
  documents: {
    id: 'documents',
    name: 'Document Center',
    description: 'Access company documents and files',
    category: 'core' as const,
    availableActions: ['view', 'create', 'edit', 'delete', 'export'],
    availableDataScopes: ['own', 'department', 'all'],
    subPermissions: {
      viewDocuments: 'View documents',
      uploadDocuments: 'Upload new documents',
      editDocuments: 'Edit document details',
      deleteDocuments: 'Delete documents',
      shareDocuments: 'Share documents',
      manageDocumentCategories: 'Manage document categories'
    }
  },
  assets: {
    id: 'assets',
    name: 'Asset Management',
    description: 'Track and manage company assets',
    category: 'admin' as const,
    availableActions: ['view', 'create', 'edit', 'delete', 'export', 'manage'],
    availableDataScopes: ['own', 'department', 'all'],
    subPermissions: {
      viewAssets: 'View asset inventory',
      addAssets: 'Add new assets',
      editAssets: 'Edit asset information',
      assignAssets: 'Assign assets to employees',
      requestAssets: 'Request asset assignment',
      manageAssetCategories: 'Manage asset categories',
      exportAssetData: 'Export asset data'
    }
  },
  'ai-insights': {
    id: 'ai-insights',
    name: 'AI Insights',
    description: 'AI-powered analytics and recommendations',
    category: 'reporting' as const,
    availableActions: ['view', 'export'],
    availableDataScopes: ['own', 'department', 'all'],
    subPermissions: {
      viewPersonalInsights: 'View personal AI insights and recommendations',
      viewTeamInsights: 'View team-level AI insights',
      viewCompanyInsights: 'View company-wide AI insights and predictions',
      exportInsights: 'Export AI insights and reports',
      configureInsights: 'Configure AI analysis parameters',
      viewPredictions: 'View predictive analytics and forecasts'
    }
  },
  announcements: {
    id: 'announcements',
    name: 'Announcements',
    description: 'Create and manage company announcements',
    category: 'admin' as const,
    availableActions: ['view', 'create', 'edit', 'delete', 'manage'],
    availableDataScopes: ['all'],
    subPermissions: {
      viewAnnouncements: 'View announcements',
      createAnnouncements: 'Create announcements',
      editAnnouncements: 'Edit announcements',
      deleteAnnouncements: 'Delete announcements',
      publishAnnouncements: 'Publish announcements',
      scheduleAnnouncements: 'Schedule future announcements'
    }
  },
  settings: {
    id: 'settings',
    name: 'System Settings',
    description: 'Configure system-wide settings',
    category: 'admin' as const,
    availableActions: ['view', 'edit', 'manage'],
    availableDataScopes: ['all'],
    subPermissions: {
      viewSettings: 'View system settings',
      editCompanySettings: 'Edit company settings',
      manageUsers: 'Manage users and permissions',
      configureIntegrations: 'Configure integrations',
      manageSecuritySettings: 'Manage security settings',
      viewSystemLogs: 'View system logs'
    }
  }
};

// Default permission sets for different roles
export const DEFAULT_PERMISSIONS = {
  admin: {
    // Admin gets all permissions by default
    modules: Object.keys(MODULE_DEFINITIONS).reduce((acc, moduleId) => {
      const module = MODULE_DEFINITIONS[moduleId as keyof typeof MODULE_DEFINITIONS];
      acc[moduleId] = {
        id: moduleId,
        name: module.name,
        description: module.description,
        category: module.category,
        actions: {
          view: true,
          create: true,
          edit: true,
          delete: true,
          export: true,
          manage: true
        },
        dataScope: 'all' as const,
        subPermissions: Object.keys(module.subPermissions || {}).reduce((subAcc, subPerm) => {
          subAcc[subPerm] = true;
          return subAcc;
        }, {} as { [key: string]: boolean })
      };
      return acc;
    }, {} as { [moduleId: string]: ModulePermission })
  },
  employee: {
    // Employee gets basic permissions
    modules: {
      dashboard: {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'Main dashboard and overview',
        category: 'core' as const,
        actions: { view: true, create: false, edit: false, delete: false, export: false, manage: false },
        dataScope: 'own' as const,
        subPermissions: { viewPersonalStats: true, viewCompanyStats: false, viewTeamStats: false }
      },
      timetracker: {
        id: 'timetracker',
        name: 'Time Tracker',
        description: 'Clock in/out and time tracking',
        category: 'core' as const,
        actions: { view: true, create: true, edit: true, delete: false, export: false, manage: false },
        dataScope: 'own' as const,
        subPermissions: { clockInOut: true, editOwnTime: true, editTeamTime: false, approveTimesheet: false, viewReports: false, exportTimeData: false }
      },
      leave: {
        id: 'leave',
        name: 'Leave Management',
        description: 'Manage leave requests and approvals',
        category: 'hr' as const,
        actions: { view: true, create: true, edit: true, delete: false, export: false, manage: false },
        dataScope: 'own' as const,
        subPermissions: { requestLeave: true, cancelOwnLeave: true, viewOwnLeaves: true, viewTeamLeaves: false, approveLeaves: false, manageLeaveTypes: false, viewLeaveReports: false, exportLeaveData: false }
      },
      tasks: {
        id: 'tasks',
        name: 'Task Management',
        description: 'Create and manage tasks',
        category: 'core' as const,
        actions: { view: true, create: true, edit: true, delete: true, export: false, manage: false },
        dataScope: 'own' as const,
        subPermissions: { createTask: true, editOwnTasks: true, editTeamTasks: false, deleteOwnTasks: true, deleteTeamTasks: false, assignTasks: false, viewTaskReports: false, exportTaskData: false }
      },
      documents: {
        id: 'documents',
        name: 'Document Center',
        description: 'Access company documents and files',
        category: 'core' as const,
        actions: { view: true, create: false, edit: false, delete: false, export: false, manage: false },
        dataScope: 'own' as const,
        subPermissions: { viewDocuments: true, uploadDocuments: false, editDocuments: false, deleteDocuments: false, shareDocuments: false, manageDocumentCategories: false }
      }
    }
  }
};

interface PermissionContextType {
  userPermissions: UserPermissions | null;
  setUserPermissions: (permissions: UserPermissions) => void;
  hasPermission: (moduleId: string, action?: string, subPermission?: string) => boolean;
  hasModuleAccess: (moduleId: string) => boolean;
  getDataScope: (moduleId: string) => 'own' | 'department' | 'all';
  canAccessOthersData: (moduleId: string) => boolean;
  isAdmin: () => boolean;
  initializePermissions: (userId: number, role: 'admin' | 'employee', customPermissions?: any) => void;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [userPermissions, setUserPermissions] = useState<UserPermissions | null>(null);

  const hasPermission = useCallback((moduleId: string, action?: string, subPermission?: string): boolean => {
    if (!userPermissions) return false;
    
    // Admin has all permissions
    if (userPermissions.isAdmin) return true;
    
    const modulePermission = userPermissions.modules[moduleId];
    if (!modulePermission) return false;
    
    // Check if module access is granted
    if (!modulePermission.actions.view) return false;
    
    // Check specific action if provided
    if (action) {
      const actionAllowed = modulePermission.actions[action as keyof typeof modulePermission.actions];
      if (!actionAllowed) return false;
    }
    
    // Check sub-permission if provided
    if (subPermission) {
      const subPermAllowed = modulePermission.subPermissions?.[subPermission];
      if (!subPermAllowed) return false;
    }
    
    return true;
  }, [userPermissions]);

  const hasModuleAccess = useCallback((moduleId: string): boolean => {
    return hasPermission(moduleId);
  }, [hasPermission]);

  const getDataScope = useCallback((moduleId: string): 'own' | 'department' | 'all' => {
    if (!userPermissions || userPermissions.isAdmin) return 'all';
    const modulePermission = userPermissions.modules[moduleId];
    return modulePermission?.dataScope || 'own';
  }, [userPermissions]);

  const canAccessOthersData = useCallback((moduleId: string): boolean => {
    const scope = getDataScope(moduleId);
    return scope === 'department' || scope === 'all';
  }, [getDataScope]);

  const isAdmin = useCallback((): boolean => {
    return userPermissions?.isAdmin || false;
  }, [userPermissions]);

  const initializePermissions = useCallback((userId: number, role: 'admin' | 'employee', customPermissions?: any) => {
    const permissions: UserPermissions = {
      userId,
      role,
      isAdmin: role === 'admin',
      modules: customPermissions || (role === 'admin' ? DEFAULT_PERMISSIONS.admin.modules : DEFAULT_PERMISSIONS.employee.modules)
    };
    
    setUserPermissions(permissions);
  }, []);

  return (
    <PermissionContext.Provider
      value={{
        userPermissions,
        setUserPermissions,
        hasPermission,
        hasModuleAccess,
        getDataScope,
        canAccessOthersData,
        isAdmin,
        initializePermissions
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

// Helper function to check if user can access specific data
export function canAccessUserData(
  targetUserId: number,
  targetUserDepartment: string,
  currentUserId: number,
  currentUserDepartment: string,
  dataScope: 'own' | 'department' | 'all'
): boolean {
  switch (dataScope) {
    case 'own':
      return targetUserId === currentUserId;
    case 'department':
      return targetUserId === currentUserId || targetUserDepartment === currentUserDepartment;
    case 'all':
      return true;
    default:
      return false;
  }
}