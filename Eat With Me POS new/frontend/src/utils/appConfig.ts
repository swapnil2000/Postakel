// Dynamic app configuration system
export interface ModuleConfig {
  id: string;
  name: string;
  label: string;
  description: string;
  icon: string;
  category: 'core' | 'sales' | 'operations' | 'analytics' | 'finance' | 'admin';
  component: string;
  permissions: string[];
  requiredRole?: string[];
  isEnabled: boolean;
  order: number;
  color: string;
  shortcut?: string;
}

export interface UserRole {
  id: string;
  name: string;
  label: string;
  description: string;
  level: number; // Higher number = more permissions
  color: string;
  defaultModules: string[];
  defaultPermissions: string[];
  restrictions?: string[];
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  moduleId: string;
  order: number;
  isVisible: boolean;
  requiredRole?: string[];
  requiredPermission?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  moduleId: string;
  color: string;
  requiredRole: string[];
  order: number;
}

// Default app modules configuration
export const APP_MODULES: ModuleConfig[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    label: 'Dashboard',
    description: 'Main overview and analytics',
    icon: '📊',
    category: 'core',
    component: 'Dashboard',
    permissions: ['dashboard'],
    isEnabled: true,
    order: 1,
    color: '#1e40af',
    shortcut: 'Ctrl+D'
  },
  {
    id: 'pos',
    name: 'POS Billing',
    label: 'POS',
    description: 'Point of sale and billing system',
    icon: '💳',
    category: 'sales',
    component: 'POSBilling',
    permissions: ['pos'],
    isEnabled: true,
    order: 2,
    color: '#059669',
    shortcut: 'Ctrl+P'
  },
  {
    id: 'tables',
    name: 'Table Management',
    label: 'Tables',
    description: 'Manage dining tables and layout',
    icon: '🪑',
    category: 'operations',
    component: 'TableManagement',
    permissions: ['tables'],
    isEnabled: true,
    order: 3,
    color: '#7c3aed'
  },
  {
    id: 'menu',
    name: 'Menu Management',
    label: 'Menu',
    description: 'Manage menu items and categories',
    icon: '📋',
    category: 'operations',
    component: 'MenuManagement',
    permissions: ['menu'],
    isEnabled: true,
    order: 4,
    color: '#dc2626'
  },
  {
    id: 'kitchen',
    name: 'Kitchen Display',
    label: 'Kitchen',
    description: 'Kitchen order management system',
    icon: '👨‍🍳',
    category: 'operations',
    component: 'KitchenDisplay',
    permissions: ['kitchen'],
    isEnabled: true,
    order: 5,
    color: '#ea580c'
  },
  {
    id: 'online-orders',
    name: 'Online Orders',
    label: 'Online Orders',
    description: 'Manage online orders from all platforms',
    icon: '📱',
    category: 'sales',
    component: 'OnlineOrdersManagement',
    permissions: ['online-orders'],
    isEnabled: true,
    order: 6,
    color: '#0891b2'
  },
  {
    id: 'customers',
    name: 'Customer Management',
    label: 'Customers',
    description: 'Customer relationship management',
    icon: '👥',
    category: 'sales',
    component: 'CustomerManagement',
    permissions: ['customers'],
    isEnabled: true,
    order: 7,
    color: '#0d9488'
  },
  {
    id: 'reservations',
    name: 'Reservation Management',
    label: 'Reservations',
    description: 'Table booking and reservation system',
    icon: '📅',
    category: 'operations',
    component: 'ReservationManagement',
    permissions: ['reservations'],
    isEnabled: true,
    order: 8,
    color: '#7c2d12'
  },
  {
    id: 'inventory',
    name: 'Inventory Management',
    label: 'Inventory',
    description: 'Stock and inventory tracking',
    icon: '📦',
    category: 'operations',
    component: 'InventoryManagement',
    permissions: ['inventory'],
    isEnabled: true,
    order: 9,
    color: '#a21caf'
  },
  {
    id: 'staff',
    name: 'Staff Management',
    label: 'Staff',
    description: 'Employee management and scheduling',
    icon: '👨‍💼',
    category: 'admin',
    component: 'StaffManagement',
    permissions: ['staff'],
    requiredRole: ['manager'],
    isEnabled: true,
    order: 10,
    color: '#4338ca'
  },
  {
    id: 'reports',
    name: 'Reports & Analytics',
    label: 'Reports',
    description: 'Business analytics and reporting',
    icon: '📈',
    category: 'analytics',
    component: 'Reports',
    permissions: ['reports'],
    isEnabled: true,
    order: 11,
    color: '#be123c'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    label: 'Marketing',
    description: 'Marketing campaigns and promotions',
    icon: '📢',
    category: 'sales',
    component: 'Marketing',
    permissions: ['marketing'],
    requiredRole: ['manager'],
    isEnabled: true,
    order: 12,
    color: '#c2410c'
  },
  {
    id: 'qr-ordering',
    name: 'QR Ordering',
    label: 'QR Orders',
    description: 'QR code ordering system',
    icon: '📱',
    category: 'sales',
    component: 'QROrdering',
    permissions: ['qr-ordering'],
    isEnabled: true,
    order: 13,
    color: '#0369a1'
  },
  {
    id: 'loyalty',
    name: 'Loyalty Program',
    label: 'Loyalty',
    description: 'Customer loyalty and rewards',
    icon: '🎁',
    category: 'sales',
    component: 'LoyaltyProgram',
    permissions: ['loyalty'],
    isEnabled: true,
    order: 14,
    color: '#9333ea'
  },
  {
    id: 'suppliers',
    name: 'Supplier Management',
    label: 'Suppliers',
    description: 'Vendor and supplier management',
    icon: '🚛',
    category: 'operations',
    component: 'SupplierManagement',
    permissions: ['suppliers'],
    isEnabled: true,
    order: 15,
    color: '#059669'
  },
  {
    id: 'expenses',
    name: 'Expense Management',
    label: 'Expenses',
    description: 'Track business expenses',
    icon: '🧾',
    category: 'finance',
    component: 'ExpenseManagement',
    permissions: ['expenses'],
    isEnabled: true,
    order: 16,
    color: '#dc2626'
  },
  {
    id: 'categories',
    name: 'Categories Management',
    label: 'Categories',
    description: 'Manage menu categories',
    icon: '🏷️',
    category: 'operations',
    component: 'CategoriesManagement',
    permissions: ['menu'],
    isEnabled: true,
    order: 17,
    color: '#7c3aed'
  },
  {
    id: 'settings',
    name: 'Settings',
    label: 'Settings',
    description: 'System configuration and preferences',
    icon: '⚙️',
    category: 'admin',
    component: 'Settings',
    permissions: ['settings'],
    requiredRole: ['manager'],
    isEnabled: true,
    order: 18,
    color: '#64748b'
  }
];

// User role definitions
export const USER_ROLES: UserRole[] = [
  {
    id: 'manager',
    name: 'manager',
    label: 'Manager',
    description: 'Full system access and management capabilities',
    level: 5,
    color: '#8b5cf6',
    defaultModules: APP_MODULES.map(m => m.id),
    defaultPermissions: APP_MODULES.flatMap(m => m.permissions),
    restrictions: []
  },
  {
    id: 'chef',
    name: 'chef',
    label: 'Chef',
    description: 'Kitchen operations and menu management',
    level: 3,
    color: '#f97316',
    defaultModules: ['dashboard', 'kitchen', 'inventory', 'menu', 'suppliers', 'online-orders'],
    defaultPermissions: ['dashboard', 'kitchen', 'inventory', 'menu', 'suppliers', 'online-orders'],
    restrictions: ['staff', 'reports', 'settings', 'marketing']
  },
  {
    id: 'waiter',
    name: 'waiter',
    label: 'Waiter',
    description: 'Customer service and order management',
    level: 2,
    color: '#10b981',
    defaultModules: ['dashboard', 'pos', 'tables', 'customers', 'reservations', 'qr-ordering', 'online-orders'],
    defaultPermissions: ['dashboard', 'pos', 'tables', 'customers', 'reservations', 'qr-ordering', 'online-orders'],
    restrictions: ['staff', 'reports', 'settings', 'marketing', 'suppliers', 'expenses']
  },
  {
    id: 'cashier',
    name: 'cashier',
    label: 'Cashier',
    description: 'Billing and payment processing',
    level: 2,
    color: '#3b82f6',
    defaultModules: ['dashboard', 'pos', 'reports', 'customers', 'loyalty', 'online-orders'],
    defaultPermissions: ['dashboard', 'pos', 'reports', 'customers', 'loyalty', 'online-orders'],
    restrictions: ['staff', 'settings', 'marketing', 'suppliers', 'inventory', 'kitchen']
  },
  {
    id: 'helper',
    name: 'helper',
    label: 'Helper',
    description: 'Basic operational support',
    level: 1,
    color: '#6b7280',
    defaultModules: ['dashboard', 'pos', 'kitchen', 'online-orders'],
    defaultPermissions: ['dashboard', 'pos', 'kitchen', 'online-orders'],
    restrictions: ['staff', 'reports', 'settings', 'marketing', 'suppliers', 'expenses', 'customers']
  }
];

// Dynamic navigation configuration for different roles
export const getBottomNavigationForRole = (userRole: string): NavigationItem[] => {
  const role = USER_ROLES.find(r => r.id === userRole);
  if (!role) return [];

  const allowedModules = APP_MODULES.filter(module => 
    role.defaultModules.includes(module.id) && 
    module.isEnabled &&
    (!module.requiredRole || module.requiredRole.includes(userRole))
  );

  // Define navigation priorities for each role
  const navigationPriorities: { [key: string]: string[] } = {
    manager: ['dashboard', 'pos', 'tables', 'online-orders', 'reports'],
    chef: ['kitchen', 'menu', 'inventory', 'reports', 'settings'],
    waiter: ['tables', 'pos', 'customers', 'menu', 'kitchen'],
    cashier: ['pos', 'tables', 'customers', 'reports', 'loyalty'],
    helper: ['pos', 'kitchen', 'tables', 'dashboard', 'online-orders']
  };

  const priorities = navigationPriorities[userRole] || [];
  
  return priorities.slice(0, 5).map((moduleId, index) => {
    const module = allowedModules.find(m => m.id === moduleId);
    if (!module) return null;
    
    return {
      id: `nav-${moduleId}`,
      label: module.label,
      icon: module.icon,
      moduleId: moduleId,
      order: index + 1,
      isVisible: true,
      requiredRole: module.requiredRole,
      requiredPermission: module.permissions[0]
    };
  }).filter(Boolean) as NavigationItem[];
};

// Quick actions configuration
export const getQuickActionsForRole = (userRole: string): QuickAction[] => {
  const quickActions: QuickAction[] = [
    {
      id: 'new-order',
      label: 'New Order',
      icon: 'Plus',
      moduleId: 'pos',
      color: '#10b981',
      requiredRole: ['manager', 'waiter', 'cashier'],
      order: 1
    },
    {
      id: 'table-view',
      label: 'Table View',
      icon: 'Users',
      moduleId: 'tables',
      color: '#3b82f6',
      requiredRole: ['manager', 'waiter'],
      order: 2
    },
    {
      id: 'kitchen-view',
      label: 'Kitchen',
      icon: 'ChefHat',
      moduleId: 'kitchen',
      color: '#f97316',
      requiredRole: ['manager', 'chef'],
      order: 3
    },
    {
      id: 'staff-manage',
      label: 'Staff',
      icon: 'Users',
      moduleId: 'staff',
      color: '#8b5cf6',
      requiredRole: ['manager'],
      order: 4
    },
    {
      id: 'reports-view',
      label: 'Reports',
      icon: 'TrendingUp',
      moduleId: 'reports',
      color: '#dc2626',
      requiredRole: ['manager'],
      order: 5
    },
    {
      id: 'online-orders',
      label: 'Online Orders',
      icon: 'Smartphone',
      moduleId: 'online-orders',
      color: '#0891b2',
      requiredRole: ['manager', 'chef', 'waiter', 'cashier', 'helper'],
      order: 6
    }
  ];

  return quickActions.filter(action => 
    action.requiredRole.includes(userRole)
  ).sort((a, b) => a.order - b.order);
};

// Permission checking utilities
export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('*');
};

export const hasModuleAccess = (userRole: string, moduleId: string, userPermissions: string[]): boolean => {
  const module = APP_MODULES.find(m => m.id === moduleId);
  if (!module || !module.isEnabled) return false;

  // Check role restrictions
  if (module.requiredRole && !module.requiredRole.includes(userRole)) return false;

  // Check permissions
  const hasRequiredPermissions = module.permissions.every(permission => 
    hasPermission(userPermissions, permission)
  );

  return hasRequiredPermissions;
};

// Get available modules for a user
export const getAvailableModulesForUser = (userRole: string, userPermissions: string[]): ModuleConfig[] => {
  return APP_MODULES
    .filter(module => hasModuleAccess(userRole, module.id, userPermissions))
    .sort((a, b) => a.order - b.order);
};

// Dynamic feature flags
export const FEATURE_FLAGS = {
  AI_ASSISTANT: true,
  MULTI_CURRENCY: true,
  QR_ORDERING: true,
  ONLINE_INTEGRATIONS: true,
  ADVANCED_ANALYTICS: true,
  MULTI_LOCATION: false,
  INVENTORY_FORECASTING: true,
  CUSTOMER_FEEDBACK: true,
  SOCIAL_MEDIA_INTEGRATION: false,
  VOICE_ORDERING: false
};

// App configuration that can be modified at runtime
export const APP_CONFIG = {
  name: 'Eat With Me',
  version: '2.0.0',
  theme: {
    primary: '#1e40af',
    secondary: '#f8fafc',
    accent: '#8b5cf6'
  },
  features: FEATURE_FLAGS,
  modules: APP_MODULES,
  roles: USER_ROLES,
  maxUsers: 50,
  supportedLanguages: ['en', 'hi', 'ta', 'te'],
  currency: {
    default: 'INR',
    symbol: '₹',
    supported: ['INR', 'USD', 'EUR', 'GBP']
  }
};

export default APP_CONFIG;