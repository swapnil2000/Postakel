import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  APP_MODULES, 
  ModuleConfig, 
  UserRole, 
  NavigationItem, 
  QuickAction,
  getBottomNavigationForRole,
  getQuickActionsForRole,
  getAvailableModulesForUser,
  hasModuleAccess,
  USER_ROLES
} from '../utils/appConfig';
import apiClient from '../lib/api';

export interface TaxRule {
  id: string;
  name: string; // GST, VAT, SGST, CGST, Cess, etc.
  rate: number; // percentage
  isActive: boolean;
  applicableCategories: string[]; // ['food', 'beverage', 'bar', 'all']
  description?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  description?: string;
  isVeg: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
  cookingTime: number; // in minutes
  rating?: number;
  isPopular: boolean;
  allergens: string[];
  taxCategory: string; // 'food', 'beverage', 'bar', 'none'
  applicableTaxes?: string[]; // array of tax rule IDs
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstNumber?: string;
  rating: number;
  status: 'active' | 'inactive';
  creditDays: number;
  totalOrders: number;
  totalAmount: number;
  lastOrderDate: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints?: number;
  lastVisit: string;
  averageRating: number;
  preferredCuisine?: string;
  tags: string[];
  status: 'active' | 'inactive';
  joinDate?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  supplierId: string;
  expiryDate?: string;
  lastPurchase: string;
  usedThisMonth: number;
}

export interface Category {
  id: string;
  name: string;
  type: 'menu' | 'expense' | 'inventory' | 'supplier';
  description?: string;
  isActive: boolean;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'free' | 'occupied' | 'reserved';
  waiter?: string;
  customer?: string;
  orderAmount?: number;
  timeOccupied?: string;
  guests?: number;
  reservationTime?: string;
  reservationName?: string;
  reservationPhone?: string;
  lastOrderId?: string;
}

export interface LoyaltyMember {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  totalVisits: number;
  joinDate: string;
  lastVisit: string;
  status: 'active' | 'inactive';
}

export interface LoyaltyReward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  type: 'discount' | 'free_item' | 'cashback';
  value: number;
  validUntil?: string;
  maxRedemptions?: number;
  currentRedemptions: number;
  isActive: boolean;
}

export interface LoyaltyRule {
  id: string;
  name: string;
  type: 'earn' | 'bonus';
  condition: string;
  pointsPerRupee?: number;
  bonusPoints?: number;
  minOrderValue?: number;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  role: string;
  permissions: string[];
  dashboardModules: string[];
  avatar?: string;
  shift?: string;
  email?: string;
  phone?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'Manager' | 'Cashier' | 'Waiter' | 'Chef' | 'Helper';
  phone: string;
  email?: string;
  pin: string;
  isActive: boolean;
  joinDate: string;
  salary: number;
  currentShift?: 'Morning' | 'Evening' | 'Night';
  permissions: string[];
  dashboardModules: string[];
  performance: {
    ordersHandled: number;
    avgOrderTime: number;
    customerRating: number;
  };
  salaryDetails: {
    baseSalary: number;
    allowances: number;
    deductions: number;
    overtime: number;
    totalSalary: number;
  };
  paymentHistory: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  month: string;
  year: number;
  amount: number;
  paymentDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  bonus?: number;
  deductions?: number;
  type: 'Full Salary' | 'Partial Payment' | 'Advance' | 'Bonus' | 'Overtime';
  description?: string;
  paidBy?: string;
}

export interface Shift {
  id: string;
  staffId: string;
  startTime: string;
  endTime?: string;
  openingCash: number;
  closingCash?: number;
  totalSales: number;
  tips: number;
  date: string;
  status: 'Active' | 'Completed' | 'Scheduled';
  shiftType: 'Morning' | 'Evening' | 'Night';
}

export interface SalaryPayment {
  id: string;
  staffId: string;
  amount: number;
  paymentDate: string;
  paymentType: 'Full Salary' | 'Partial Payment' | 'Advance' | 'Bonus' | 'Overtime';
  description: string;
  paidBy: string;
  status: 'Completed' | 'Pending';
  month?: string;
  year?: number;
}

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  moduleId?: string;
  actionUrl?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  category: string;
}

export interface Order {
  id: string;
  tableNumber?: number;
  orderSource: 'dine-in' | 'zomato' | 'swiggy' | 'own-app' | 'website' | 'takeaway' | 'qr-code';
  customerName?: string;
  customerPhone?: string;
  orderNumber?: string;
  items: OrderItem[];
  status: 'new' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  orderTime: string;
  orderDate: string;
  estimatedTime: number;
  actualCookingTime?: number;
  priority: 'normal' | 'high' | 'urgent';
  waiter?: string;
  specialInstructions?: string;
  deliveryType?: 'dine-in' | 'delivery' | 'pickup' | 'takeaway';
  completedAt?: string;
  preparedBy?: string;
  totalAmount: number;
  subtotal: number;
  taxes: Array<{name: string, rate: number, amount: number}>;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'split';
  feedback?: string;
  rating?: number;
  deliveryAddress?: string;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  menuItemName: string;
  ingredients: Array<{
    inventoryItemId: string;
    inventoryItemName: string;
    quantity: number;
    unit: string;
  }>;
  yield: number; // Number of servings this recipe makes
  cost: number; // Calculated cost per serving
  preparationTime: number; // in minutes
  instructions?: string[];
}

export interface ExtendedCustomer extends Customer {
  whatsappOptIn: boolean;
  birthDate?: string;
  anniversary?: string;
  preferences: string[];
  orderHistory: Array<{
    id: string;
    date: string;
    items: string[];
    amount: number;
    table?: number;
  }>;
  totalSpent: number;
  visitCount: number;
  averageOrderValue: number;
  lastVisit?: string;
  loyaltyPoints?: number;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  amount: number;
  date: string;
  vendor: string;
  description?: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'upi' | 'cheque';
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  receiptUrl?: string;
  receiptNumber?: string;
  recurring?: boolean;
  recurringPeriod?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  approvedBy?: string;
  supplierId?: string;
  tags?: string[];
  taxAmount?: number;
  netAmount: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderDate: string;
  expectedDate: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  items: Array<{
    itemName: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
  }>;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budget: number;
  spent: number;
  icon: string;
  color: string;
  description?: string;
  isActive: boolean;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  partySize: number;
  tableId?: string;
  tableNumber?: number;
  status: 'confirmed' | 'pending' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  specialRequests?: string;
  occasion?: string;
  createdAt: string;
  source: 'phone' | 'online' | 'walk-in' | 'app';
  prepayment?: number;
  priority: 'normal' | 'high' | 'vip';
  reminderSent?: boolean;
  arrivalStatus?: 'early' | 'on-time' | 'late' | 'no-show';
  diningDuration?: number; // in minutes
  orderTotal?: number;
  rating?: number;
  feedback?: string;
}

export interface AppSettings {
  restaurantName: string;
  country: string;
  currency: string;
  currencySymbol: string;
  whatsappApiKey: string;
  whatsappPhoneNumber: string;
  taxRules: TaxRule[];
  defaultTaxCategory: string;
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
  autoBackup: boolean;
  multiLocation: boolean;
  // Business Information
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  taxNumber: string;
  fssaiNumber: string;
}

interface AppContextType {
  // App Configuration & Modules
  appModules: ModuleConfig[];
  availableModules: ModuleConfig[];
  bottomNavigation: NavigationItem[];
  quickActions: QuickAction[];
  
  // User Management
  currentUser: User | null;
  userRole: UserRole | null;
  
  // App State
  currentModule: string;
  selectedTable: string | null;
  currentOrder: any;
  notifications: AppNotification[];
  
  // Settings & Data
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  menuItems: MenuItem[];
  updateMenuItems: (items: MenuItem[]) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  orders: Order[];
  updateOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  getOrdersByTable: (tableNumber: number) => Order[];
  getOrdersByStatus: (status: Order['status']) => Order[];
  getOrderById: (id: string) => Order | undefined;
  suppliers: Supplier[];
  updateSuppliers: (suppliers: Supplier[]) => void;
  addSupplier: (supplier: Supplier) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  customers: Customer[];
  updateCustomers: (customers: Customer[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  inventoryItems: InventoryItem[];
  updateInventoryItems: (items: InventoryItem[]) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  categories: Category[];
  updateCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoriesByType: (type: Category['type']) => Category[];
  addTaxRule: (taxRule: TaxRule) => void;
  updateTaxRule: (id: string, updates: Partial<TaxRule>) => void;
  deleteTaxRule: (id: string) => void;
  calculateTaxes: (baseAmount: number, taxCategory: string) => { taxes: Array<{name: string, rate: number, amount: number}>, totalTax: number };
  
  // Loyalty Management
  loyaltyMembers: LoyaltyMember[];
  updateLoyaltyMembers: (members: LoyaltyMember[]) => void;
  addLoyaltyMember: (member: LoyaltyMember) => void;
  updateLoyaltyMember: (id: string, updates: Partial<LoyaltyMember>) => void;
  deleteLoyaltyMember: (id: string) => void;
  loyaltyRewards: LoyaltyReward[];
  updateLoyaltyRewards: (rewards: LoyaltyReward[]) => void;
  addLoyaltyReward: (reward: LoyaltyReward) => void;
  updateLoyaltyReward: (id: string, updates: Partial<LoyaltyReward>) => void;
  deleteLoyaltyReward: (id: string) => void;
  loyaltyRules: LoyaltyRule[];
  updateLoyaltyRules: (rules: LoyaltyRule[]) => void;
  addLoyaltyRule: (rule: LoyaltyRule) => void;
  updateLoyaltyRule: (id: string, updates: Partial<LoyaltyRule>) => void;
  deleteLoyaltyRule: (id: string) => void;
  
  // Table Management
  tables: Table[];
  updateTables: (tables: Table[]) => void;
  addTable: (table: Table) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  getTableById: (id: string) => Table | undefined;
  getTableByNumber: (number: number) => Table | undefined;
  getAvailableTables: () => Table[];
  getTableStats: () => { total: number; occupied: number; free: number; reserved: number; cleaning: number; revenue: number };
  
  // New Dynamic Methods
  setCurrentUser: (user: User | null) => void;
  setCurrentModule: (moduleId: string) => void;
  setSelectedTable: (tableId: string | null) => void;
  setCurrentOrder: (order: any) => void;
  hasPermission: (permission: string) => boolean;
  hasModuleAccess: (moduleId: string) => boolean;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  getModuleByComponent: (componentName: string) => ModuleConfig | undefined;
  
  // Revenue and Analytics Methods
  getTodayRevenue: () => number;
  getRevenueBetweenDates: (startDate: string, endDate: string) => number;
  getRevenueByPaymentMethod: (dateFilter?: string) => { cash: number; digital: number; split: number };
  getRevenueByOrderSource: (dateFilter?: string) => Record<string, number>;
  getOrderStats: (dateFilter?: string) => {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  
  // Shared date filtering utilities for consistency
  getOrdersByDateRange: (startDate: string, endDate: string) => Order[];
  getOrdersByDateFilter: (filter: 'today' | 'yesterday' | 'week' | 'month' | 'all') => Order[];
  getOrderStatsByDateFilter: (filter: 'today' | 'yesterday' | 'week' | 'month' | 'all') => {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    cashAmount: number;
    digitalAmount: number;
    completed: number;
    pending: number;
    cancelled: number;
    orders: Order[];
  };
  
  // Recipes Management
  recipes: Recipe[];
  updateRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getRecipesByMenuItem: (menuItemId: string) => Recipe[];
  calculateRecipeCost: (recipeId: string) => number;
  
  // Extended Customers Management
  extendedCustomers: ExtendedCustomer[];
  updateExtendedCustomers: (customers: ExtendedCustomer[]) => void;
  addExtendedCustomer: (customer: ExtendedCustomer) => void;
  updateExtendedCustomer: (id: string, updates: Partial<ExtendedCustomer>) => void;
  deleteExtendedCustomer: (id: string) => void;
  getCustomerOrderHistory: (customerId: string) => ExtendedCustomer['orderHistory'];
  updateCustomerStats: (customerId: string, newOrder: { amount: number; date: string; items: string[] }) => void;
  
  // Expenses Management
  expenses: Expense[];
  updateExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByCategory: (category: string) => Expense[];
  getExpensesByDateRange: (startDate: string, endDate: string) => Expense[];
  getTotalExpenses: (dateFilter?: string) => number;
  getExpensesBySupplier: (supplierId: string) => Expense[];
  
  // Purchase Orders Management
  purchaseOrders: PurchaseOrder[];
  updatePurchaseOrders: (orders: PurchaseOrder[]) => void;
  addPurchaseOrder: (order: PurchaseOrder) => void;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;
  getPurchaseOrdersBySupplier: (supplierId: string) => PurchaseOrder[];
  getPurchaseOrdersByStatus: (status: PurchaseOrder['status']) => PurchaseOrder[];
  
  // Budget Categories Management
  budgetCategories: BudgetCategory[];
  updateBudgetCategories: (categories: BudgetCategory[]) => void;
  addBudgetCategory: (category: BudgetCategory) => void;
  updateBudgetCategory: (id: string, updates: Partial<BudgetCategory>) => void;
  deleteBudgetCategory: (id: string) => void;
  getBudgetCategorySpent: (categoryId: string) => number;
  updateBudgetCategorySpent: (categoryId: string, amount: number) => void;
  
  // Reservations Management
  reservations: Reservation[];
  updateReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  getReservationsByDate: (date: string) => Reservation[];
  getReservationsByTable: (tableId: string) => Reservation[];
  getReservationsByStatus: (status: Reservation['status']) => Reservation[];
  
  // Customer synchronization
  syncAllCustomers: () => void;

  // Staff Management
  staff: Staff[];
  addStaff: (staff: Staff) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  // Shift Management
  shifts: Shift[];
  addShift: (shift: Shift) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;

  // Salary Management
  salaryPayments: SalaryPayment[];
  addSalaryPayment: (payment: SalaryPayment) => void;

  // Categories and Roles
  categoriesAndRoles: { categories: Category[], roles: any[] } | null;
}

// Default tax rules for different countries
const getDefaultTaxRules = (country: string): TaxRule[] => {
  switch (country) {
    case 'India':
      return [
        {
          id: 'cgst',
          name: 'CGST',
          rate: 9,
          isActive: true,
          applicableCategories: ['food', 'beverage'],
          description: 'Central Goods and Services Tax'
        },
        {
          id: 'sgst',
          name: 'SGST',
          rate: 9,
          isActive: true,
          applicableCategories: ['food', 'beverage'],
          description: 'State Goods and Services Tax'
        },
        {
          id: 'bar_cgst',
          name: 'CGST (Bar)',
          rate: 14,
          isActive: true,
          applicableCategories: ['bar'],
          description: 'Central GST for alcoholic beverages'
        },
        {
          id: 'bar_sgst',
          name: 'SGST (Bar)',
          rate: 14,
          isActive: true,
          applicableCategories: ['bar'],
          description: 'State GST for alcoholic beverages'
        }
      ];
    case 'United Kingdom':
    case 'Germany':
    case 'France':
      return [
        {
          id: 'vat',
          name: 'VAT',
          rate: 20,
          isActive: true,
          applicableCategories: ['food', 'beverage', 'bar'],
          description: 'Value Added Tax'
        }
      ];
    case 'United States':
      return [
        {
          id: 'sales_tax',
          name: 'Sales Tax',
          rate: 8.5,
          isActive: true,
          applicableCategories: ['food', 'beverage', 'bar'],
          description: 'State and Local Sales Tax'
        }
      ];
    default:
      return [
        {
          id: 'tax',
          name: 'Tax',
          rate: 10,
          isActive: true,
          applicableCategories: ['food', 'beverage', 'bar'],
          description: 'General Tax'
        }
      ];
  }
};

const defaultSettings: AppSettings = {
  restaurantName: 'Eat With Me Demo',
  country: 'India',
  currency: 'INR',
  currencySymbol: '₹',
  whatsappApiKey: '',
  whatsappPhoneNumber: '',
  taxRules: getDefaultTaxRules('India'),
  defaultTaxCategory: 'food',
  theme: 'light',
  language: 'English',
  notifications: true,
  autoBackup: true,
  multiLocation: false,
  businessAddress: '123 MG Road, Bangalore, Karnataka 560001',
  businessPhone: '+91 80 2345 6789',
  businessEmail: 'info@eatwithme.com',
  taxNumber: '29ABCDE1234F1Z5',
  fssaiNumber: '12345678901234'
};

// Currency mapping based on country
export const countryCurrencyMap: Record<string, { currency: string; symbol: string }> = {
  'India': { currency: 'INR', symbol: '₹' },
  'United States': { currency: 'USD', symbol: '$' },
  'United Kingdom': { currency: 'GBP', symbol: '£' },
  'Canada': { currency: 'CAD', symbol: 'C$' },
  'Australia': { currency: 'AUD', symbol: 'A$' },
  'Germany': { currency: 'EUR', symbol: '€' },
  'France': { currency: 'EUR', symbol: '€' },
  'Japan': { currency: 'JPY', symbol: '¥' },
  'Singapore': { currency: 'SGD', symbol: 'S$' },
  'United Arab Emirates': { currency: 'AED', symbol: 'AED' },
  'South Africa': { currency: 'ZAR', symbol: 'R' },
  'Brazil': { currency: 'BRL', symbol: 'R$' },
  'Mexico': { currency: 'MXN', symbol: '$' },
  'Thailand': { currency: 'THB', symbol: '฿' },
  'Malaysia': { currency: 'MYR', symbol: 'RM' }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loyaltyMembers, setLoyaltyMembers] = useState<LoyaltyMember[]>([]);
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>([]);
  const [loyaltyRules, setLoyaltyRules] = useState<LoyaltyRule[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>([]);
  const [extendedCustomers, setExtendedCustomers] = useState<ExtendedCustomer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [categoriesAndRoles, setCategoriesAndRoles] = useState<{ categories: Category[], roles: any[] } | null>(null);

  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string) => {
    return user?.permissions.includes(permission) ?? false;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return;
      }
      try {
        const [
          menuResponse,
          suppliersResponse,
          customersResponse,
          inventoryResponse,
          categoriesRolesResponse,
          loyaltyMembersResponse,
          loyaltyRewardsResponse,
          loyaltyRulesResponse,
          tablesResponse,
          recipesResponse,
          ordersResponse,
          staffResponse,
          shiftsResponse,
          salaryPaymentsResponse,
          extendedCustomersResponse,
          expensesResponse,
          reservationsResponse,
          purchaseOrdersResponse,
          budgetCategoriesResponse,
        ] = await Promise.all([
          apiClient.get('/menu'),
          apiClient.get('/suppliers'),
          apiClient.get('/customers'),
          apiClient.get('/inventory'),
          apiClient.get('/category-role'),
          apiClient.get('/loyalty/members'),
          apiClient.get('/loyalty/rewards'),
          apiClient.get('/loyalty/rules'),
          apiClient.get('/tables'),
          apiClient.get('/recipes'),
          apiClient.get('/orders'),
          apiClient.get('/staff'),
          apiClient.get('/shifts'),
          apiClient.get('/staff/salary-payments'),
          apiClient.get('/customers/extended'),
          apiClient.get('/expenses'),
          apiClient.get('/reservations'),
          apiClient.get('/suppliers/purchases/all'),
          apiClient.get('/budgets/categories'),
        ]);

        setMenuItems(menuResponse.data);
        setSuppliers(suppliersResponse.data);
        setCustomers(customersResponse.data);
        setInventoryItems(inventoryResponse.data);
        setCategoriesAndRoles(categoriesRolesResponse.data);
        setLoyaltyMembers(loyaltyMembersResponse.data);
        setLoyaltyRewards(loyaltyRewardsResponse.data);
        setLoyaltyRules(loyaltyRulesResponse.data);
        setTables(tablesResponse.data);
        setRecipes(recipesResponse.data);
        setOrders(ordersResponse.data);
        setStaff(staffResponse.data);
        setShifts(shiftsResponse.data);
        setSalaryPayments(salaryPaymentsResponse.data);
        setExtendedCustomers(extendedCustomersResponse.data);
        setExpenses(expensesResponse.data);
        setReservations(reservationsResponse.data);
        setPurchaseOrders(purchaseOrdersResponse.data);
        setBudgetCategories(budgetCategoriesResponse.data);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };

    fetchData();
  }, [user]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  const value: AppContextType = {
    settings,
    updateSettings,
    currentUser: user,
    setCurrentUser: setUser,
    userRole: user?.role as unknown as UserRole | null,
    hasPermission,
    appModules: APP_MODULES,
    availableModules: getAvailableModulesForUser(user?.role as string, user?.permissions || []),
    bottomNavigation: getBottomNavigationForRole(user?.role as string),
    quickActions: getQuickActionsForRole(user?.role as string),
    currentModule: 'dashboard',
    setCurrentModule: () => {},
    selectedTable: null,
    setSelectedTable: () => {},
    currentOrder: null,
    setCurrentOrder: () => {},
    notifications: [],
    addNotification: () => {},
    markNotificationRead: () => {},
    clearNotifications: () => {},
    menuItems,
    updateMenuItems: setMenuItems,
    addMenuItem: (item) => setMenuItems(prev => [...prev, item]),
    updateMenuItem: (id, updates) => setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item)),
    deleteMenuItem: (id) => setMenuItems(prev => prev.filter(item => item.id !== id)),
    orders,
    updateOrders: setOrders,
    addOrder: (order) => setOrders(prev => [...prev, order]),
    updateOrder: (id, updates) => setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o)),
    deleteOrder: (id) => setOrders(prev => prev.filter(o => o.id !== id)),
    getOrdersByTable: (tableNumber) => orders.filter(o => o.tableNumber === tableNumber),
    getOrdersByStatus: (status) => orders.filter(o => o.status === status),
    getOrderById: (id) => orders.find(o => o.id === id),
    suppliers,
    updateSuppliers: setSuppliers,
    addSupplier: (supplier) => setSuppliers(prev => [...prev, supplier]),
    updateSupplier: (id, updates) => setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s)),
    deleteSupplier: (id) => setSuppliers(prev => prev.filter(s => s.id !== id)),
    customers,
    updateCustomers: setCustomers,
    addCustomer: (customer) => setCustomers(prev => [...prev, customer]),
    updateCustomer: (id, updates) => setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c)),
    deleteCustomer: (id) => setCustomers(prev => prev.filter(c => c.id !== id)),
    inventoryItems,
    updateInventoryItems: setInventoryItems,
    addInventoryItem: (item) => setInventoryItems(prev => [...prev, item]),
    updateInventoryItem: (id, updates) => setInventoryItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i)),
    deleteInventoryItem: (id) => setInventoryItems(prev => prev.filter(i => i.id !== id)),
    categories,
    updateCategories: setCategories,
    addCategory: (category) => setCategories(prev => [...prev, category]),
    updateCategory: (id, updates) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c)),
    deleteCategory: (id) => setCategories(prev => prev.filter(c => c.id !== id)),
    getCategoriesByType: (type) => categories.filter(c => c.type === type),
    addTaxRule: () => {},
    updateTaxRule: () => {},
    deleteTaxRule: () => {},
    calculateTaxes: () => ({ taxes: [], totalTax: 0 }),
    loyaltyMembers,
    updateLoyaltyMembers: setLoyaltyMembers,
    addLoyaltyMember: (member) => setLoyaltyMembers(prev => [...prev, member]),
    updateLoyaltyMember: (id, updates) => setLoyaltyMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m)),
    deleteLoyaltyMember: (id) => setLoyaltyMembers(prev => prev.filter(m => m.id !== id)),
    loyaltyRewards,
    updateLoyaltyRewards: setLoyaltyRewards,
    addLoyaltyReward: (reward) => setLoyaltyRewards(prev => [...prev, reward]),
    updateLoyaltyReward: (id, updates) => setLoyaltyRewards(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r)),
    deleteLoyaltyReward: (id) => setLoyaltyRewards(prev => prev.filter(r => r.id !== id)),
    loyaltyRules,
    updateLoyaltyRules: setLoyaltyRules,
    addLoyaltyRule: (rule) => setLoyaltyRules(prev => [...prev, rule]),
    updateLoyaltyRule: (id, updates) => setLoyaltyRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r)),
    deleteLoyaltyRule: (id) => setLoyaltyRules(prev => prev.filter(r => r.id !== id)),
    tables,
    updateTables: setTables,
    addTable: (table) => setTables(prev => [...prev, table]),
    updateTable: (id, updates) => setTables(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)),
    deleteTable: (id) => setTables(prev => prev.filter(t => t.id !== id)),
    getTableById: (id) => tables.find(t => t.id === id),
    getTableByNumber: (number) => tables.find(t => t.number === number),
    getAvailableTables: () => tables.filter(t => t.status === 'free'),
    getTableStats: () => ({ total: tables.length, occupied: tables.filter(t=>t.status === 'occupied').length, free: tables.filter(t=>t.status === 'free').length, reserved: tables.filter(t=>t.status === 'reserved').length, cleaning: 0, revenue: 0 }),
    hasModuleAccess: (moduleId: string) => hasModuleAccess(user?.role as string, moduleId, user?.permissions || []),
    getModuleByComponent: () => undefined,
    getTodayRevenue: () => 0,
    getRevenueBetweenDates: () => 0,
    getRevenueByPaymentMethod: () => ({ cash: 0, digital: 0, split: 0 }),
    getRevenueByOrderSource: () => ({}),
    getOrderStats: () => ({ total: 0, completed: 0, pending: 0, cancelled: 0, totalRevenue: 0, avgOrderValue: 0 }),
    getOrdersByDateRange: () => [],
    getOrdersByDateFilter: () => [],
    getOrderStatsByDateFilter: () => ({ totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, cashAmount: 0, digitalAmount: 0, completed: 0, pending: 0, cancelled: 0, orders: [] }),
    recipes,
    updateRecipes: setRecipes,
    addRecipe: (recipe) => setRecipes(prev => [...prev, recipe]),
    updateRecipe: (id, updates) => setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r)),
    deleteRecipe: (id) => setRecipes(prev => prev.filter(r => r.id !== id)),
    getRecipesByMenuItem: () => [],
    calculateRecipeCost: () => 0,
    extendedCustomers,
    updateExtendedCustomers: setExtendedCustomers,
    addExtendedCustomer: (customer) => setExtendedCustomers(prev => [...prev, customer]),
    updateExtendedCustomer: (id, updates) => setExtendedCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c)),
    deleteExtendedCustomer: (id) => setExtendedCustomers(prev => prev.filter(c => c.id !== id)),
    getCustomerOrderHistory: () => [],
    updateCustomerStats: () => {},
    expenses,
    updateExpenses: setExpenses,
    addExpense: (expense) => setExpenses(prev => [...prev, expense]),
    updateExpense: (id, updates) => setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e)),
    deleteExpense: (id) => setExpenses(prev => prev.filter(e => e.id !== id)),
    getExpensesByCategory: () => [],
    getExpensesByDateRange: () => [],
    getTotalExpenses: () => 0,
    getExpensesBySupplier: () => [],
    purchaseOrders,
    updatePurchaseOrders: setPurchaseOrders,
    addPurchaseOrder: (order) => setPurchaseOrders(prev => [...prev, order]),
    updatePurchaseOrder: (id, updates) => setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p)),
    deletePurchaseOrder: (id) => setPurchaseOrders(prev => prev.filter(p => p.id !== id)),
    getPurchaseOrdersBySupplier: () => [],
    getPurchaseOrdersByStatus: () => [],
    budgetCategories,
    updateBudgetCategories: setBudgetCategories,
    addBudgetCategory: (category) => setBudgetCategories(prev => [...prev, category]),
    updateBudgetCategory: (id, updates) => setBudgetCategories(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b)),
    deleteBudgetCategory: (id) => setBudgetCategories(prev => prev.filter(b => b.id !== id)),
    getBudgetCategorySpent: () => 0,
    updateBudgetCategorySpent: () => {},
    reservations,
    updateReservations: setReservations,
    addReservation: (reservation) => setReservations(prev => [...prev, reservation]),
    updateReservation: (id, updates) => setReservations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r)),
    deleteReservation: (id) => setReservations(prev => prev.filter(r => r.id !== id)),
    getReservationsByDate: () => [],
    getReservationsByTable: () => [],
    getReservationsByStatus: () => [],
    syncAllCustomers: () => {},
    staff,
    addStaff: (s) => setStaff(prev => [...prev, s]),
    updateStaff: (id, updates) => setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s)),
    deleteStaff: (id) => setStaff(prev => prev.filter(s => s.id !== id)),
    shifts,
    addShift: (s) => setShifts(prev => [...prev, s]),
    updateShift: (id, updates) => setShifts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s)),
    salaryPayments,
    addSalaryPayment: (p) => setSalaryPayments(prev => [...prev, p]),
    categoriesAndRoles,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};