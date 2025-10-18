import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  loyaltyPoints: number;
  lastVisit: string;
  averageRating: number;
  preferredCuisine?: string;
  tags: string[];
  status: 'active' | 'inactive';
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
  deliveryType?: 'dine-in' | 'delivery' | 'pickup';
  completedAt?: string;
  preparedBy?: string;
  totalAmount: number;
  subtotal: number;
  taxes: Array<{name: string, rate: number, amount: number}>;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'split';
  feedback?: string;
  rating?: number;
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

const defaultSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Fresh Vegetable Suppliers',
    category: 'Vegetables',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@freshveggies.com',
    address: 'Sector 12, Gurgaon, Haryana',
    gstNumber: '07ABCDE1234F1Z5',
    rating: 4.5,
    status: 'active',
    creditDays: 15,
    totalOrders: 145,
    totalAmount: 850000,
    lastOrderDate: '2024-03-15'
  },
  {
    id: '2',
    name: 'Spice World Trading',
    category: 'Spices',
    contactPerson: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya@spiceworld.com',
    address: 'Karol Bagh, New Delhi',
    gstNumber: '07FGHIJ5678K2L9',
    rating: 4.8,
    status: 'active',
    creditDays: 30,
    totalOrders: 89,
    totalAmount: 650000,
    lastOrderDate: '2024-03-14'
  },
  {
    id: '3',
    name: 'Dairy Fresh Products',
    category: 'Dairy',
    contactPerson: 'Amit Patel',
    phone: '+91 76543 21098',
    email: 'amit@dairyfresh.com',
    address: 'Anand, Gujarat',
    gstNumber: '24KLMNO3456P7Q1',
    rating: 4.2,
    status: 'active',
    creditDays: 7,
    totalOrders: 203,
    totalAmount: 1200000,
    lastOrderDate: '2024-03-16'
  },
  {
    id: '4',
    name: 'Delhi Electric Supply',
    category: 'Utilities',
    contactPerson: 'Service Desk',
    phone: '+91 11 23456789',
    email: 'service@delhielectric.com',
    address: 'Connaught Place, New Delhi',
    gstNumber: '07UTILS123456',
    rating: 3.8,
    status: 'active',
    creditDays: 0,
    totalOrders: 12,
    totalAmount: 180000,
    lastOrderDate: '2024-03-15'
  },
  {
    id: '5',
    name: 'Uniform World',
    category: 'Supplies',
    contactPerson: 'Suresh Singh',
    phone: '+91 98765 11111',
    email: 'suresh@uniformworld.com',
    address: 'Lajpat Nagar, New Delhi',
    gstNumber: '07UNIFORM5678',
    rating: 4.1,
    status: 'active',
    creditDays: 15,
    totalOrders: 5,
    totalAmount: 45000,
    lastOrderDate: '2024-03-13'
  },
  {
    id: '6',
    name: 'TechFix Solutions',
    category: 'Services',
    contactPerson: 'Rahul Mehta',
    phone: '+91 87654 22222',
    email: 'rahul@techfix.com',
    address: 'Nehru Place, New Delhi',
    gstNumber: '07TECHFIX789',
    rating: 4.3,
    status: 'active',
    creditDays: 7,
    totalOrders: 8,
    totalAmount: 65000,
    lastOrderDate: '2024-03-12'
  }
];

const defaultCustomers: Customer[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    phone: '+91 98765 43210',
    email: 'arjun.sharma@email.com',
    address: 'Sector 15, Gurgaon',
    joinDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 3500,
    loyaltyPoints: 350,
    lastVisit: '2024-03-15',
    averageRating: 4.5,
    preferredCuisine: 'North Indian',
    tags: ['VIP', 'Regular'],
    status: 'active'
  },
  {
    id: '2',
    name: 'Priya Patel',
    phone: '+91 87654 32109',
    email: 'priya.patel@email.com',
    address: 'Bandra West, Mumbai',
    joinDate: '2024-02-10',
    totalOrders: 8,
    totalSpent: 2200,
    loyaltyPoints: 220,
    lastVisit: '2024-03-14',
    averageRating: 4.2,
    tags: ['Regular'],
    status: 'active'
  },
  {
    id: '3',
    name: 'Rajesh Patel',
    phone: '+91 99988 77766',
    email: 'rajesh.patel@email.com',
    address: '123 Gandhi Nagar, Delhi',
    joinDate: new Date().toISOString().split('T')[0],
    totalOrders: 1,
    totalSpent: 520,
    loyaltyPoints: 52,
    lastVisit: new Date().toISOString().split('T')[0],
    averageRating: 5.0,
    tags: ['New Customer'],
    status: 'active'
  },
  {
    id: '4',
    name: 'Priya Singh',
    phone: '+91 88776 65543',
    email: 'priya.singh@email.com',
    address: 'Whitefield, Bangalore',
    joinDate: new Date().toISOString().split('T')[0],
    totalOrders: 1,
    totalSpent: 320,
    loyaltyPoints: 32,
    lastVisit: new Date().toISOString().split('T')[0],
    averageRating: 4.8,
    tags: ['New Customer'],
    status: 'active'
  },
  {
    id: '5',
    name: 'Amit Gupta',
    phone: '+91 77665 54321',
    email: 'amit.gupta@email.com',
    address: 'Koramangala, Bangalore',
    joinDate: new Date().toISOString().split('T')[0],
    totalOrders: 1,
    totalSpent: 440,
    loyaltyPoints: 44,
    lastVisit: new Date().toISOString().split('T')[0],
    averageRating: 4.5,
    tags: ['Takeaway Preferred'],
    status: 'active'
  }
];

const defaultInventoryItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Basmati Rice',
    category: 'Grains',
    unit: 'kg',
    currentStock: 25,
    minStock: 10,
    maxStock: 100,
    costPerUnit: 120,
    supplierId: '1',
    expiryDate: '2024-06-15',
    lastPurchase: '2024-01-10',
    usedThisMonth: 45
  },
  {
    id: '2',
    name: 'Chicken',
    category: 'Meat',
    unit: 'kg',
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    costPerUnit: 280,
    supplierId: '2',
    expiryDate: '2024-01-20',
    lastPurchase: '2024-01-15',
    usedThisMonth: 32
  }
];

const defaultCategories: Category[] = [
  // Menu Categories
  { id: '1', name: 'Starters', type: 'menu', isActive: true },
  { id: '2', name: 'Main Course', type: 'menu', isActive: true },
  { id: '3', name: 'Beverages', type: 'menu', isActive: true },
  { id: '4', name: 'Desserts', type: 'menu', isActive: true },
  { id: '5', name: 'Bar', type: 'menu', isActive: true },
  
  // Expense Categories
  { id: '6', name: 'Raw Materials', type: 'expense', isActive: true },
  { id: '7', name: 'Utilities', type: 'expense', isActive: true },
  { id: '8', name: 'Staff', type: 'expense', isActive: true },
  { id: '9', name: 'Maintenance', type: 'expense', isActive: true },
  { id: '10', name: 'Transportation', type: 'expense', isActive: true },
  
  // Inventory Categories
  { id: '11', name: 'Vegetables', type: 'inventory', isActive: true },
  { id: '12', name: 'Spices', type: 'inventory', isActive: true },
  { id: '13', name: 'Dairy', type: 'inventory', isActive: true },
  { id: '14', name: 'Meat', type: 'inventory', isActive: true },
  { id: '15', name: 'Grains', type: 'inventory', isActive: true },
  
  // Supplier Categories
  { id: '16', name: 'Food Suppliers', type: 'supplier', isActive: true },
  { id: '17', name: 'Utilities', type: 'supplier', isActive: true },
  { id: '18', name: 'Services', type: 'supplier', isActive: true },
  { id: '19', name: 'Supplies', type: 'supplier', isActive: true }
];

const defaultLoyaltyMembers: LoyaltyMember[] = [
  {
    id: '1',
    customerName: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@email.com',
    points: 1250,
    tier: 'gold',
    totalSpent: 45000,
    totalVisits: 28,
    joinDate: '2023-06-15',
    lastVisit: '2024-03-15',
    status: 'active'
  },
  {
    id: '2',
    customerName: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya@email.com',
    points: 890,
    tier: 'silver',
    totalSpent: 28000,
    totalVisits: 15,
    joinDate: '2023-08-20',
    lastVisit: '2024-03-14',
    status: 'active'
  },
  {
    id: '3',
    customerName: 'Amit Patel',
    phone: '+91 76543 21098',
    points: 2180,
    tier: 'platinum',
    totalSpent: 78000,
    totalVisits: 45,
    joinDate: '2023-03-10',
    lastVisit: '2024-03-16',
    status: 'active'
  },
  {
    id: '4',
    customerName: 'Sneha Reddy',
    phone: '+91 65432 10987',
    email: 'sneha@email.com',
    points: 340,
    tier: 'bronze',
    totalSpent: 12000,
    totalVisits: 8,
    joinDate: '2024-01-12',
    lastVisit: '2024-03-10',
    status: 'active'
  }
];

const defaultLoyaltyRewards: LoyaltyReward[] = [
  {
    id: '1',
    title: '10% Off Next Order',
    description: '10% discount on your next order (max ₹200)',
    pointsRequired: 500,
    type: 'discount',
    value: 10,
    currentRedemptions: 23,
    maxRedemptions: 100,
    isActive: true
  },
  {
    id: '2',
    title: 'Free Dessert',
    description: 'Complimentary dessert of your choice',
    pointsRequired: 300,
    type: 'free_item',
    value: 150,
    currentRedemptions: 8,
    maxRedemptions: 50,
    isActive: true
  },
  {
    id: '3',
    title: '₹100 Cashback',
    description: '₹100 cashback on orders above ₹1000',
    pointsRequired: 800,
    type: 'cashback',
    value: 100,
    currentRedemptions: 5,
    isActive: true
  }
];

const defaultLoyaltyRules: LoyaltyRule[] = [
  {
    id: '1',
    name: 'Standard Points',
    type: 'earn',
    condition: 'Earn 1 point per ₹10 spent',
    pointsPerRupee: 0.1,
    isActive: true
  },
  {
    id: '2',
    name: 'Weekend Bonus',
    type: 'bonus',
    condition: 'Double points on weekends',
    bonusPoints: 100,
    isActive: true
  },
  {
    id: '3',
    name: 'Large Order Bonus',
    type: 'bonus',
    condition: 'Bonus points for orders above ₹1000',
    bonusPoints: 50,
    minOrderValue: 1000,
    isActive: true
  }
];

const defaultMenuItems: MenuItem[] = [
  { 
    id: '1', 
    name: 'Paneer Tikka', 
    price: 180, 
    category: 'Starters', 
    available: true, 
    description: 'Grilled cottage cheese with spices',
    isVeg: true,
    spiceLevel: 'medium',
    cookingTime: 15,
    rating: 4.5,
    isPopular: true,
    allergens: ['Dairy'],
    taxCategory: 'food',
    nutritionalInfo: { calories: 320, protein: 18, carbs: 8, fat: 25 }
  },
  { 
    id: '2', 
    name: 'Chicken Tikka', 
    price: 220, 
    category: 'Starters', 
    available: true, 
    description: 'Tender chicken marinated in yogurt and spices',
    isVeg: false,
    spiceLevel: 'medium',
    cookingTime: 20,
    rating: 4.7,
    isPopular: true,
    allergens: ['Dairy'],
    taxCategory: 'food',
    nutritionalInfo: { calories: 280, protein: 35, carbs: 3, fat: 12 }
  },
  { 
    id: '3', 
    name: 'Dal Makhani', 
    price: 160, 
    category: 'Main Course', 
    available: true, 
    description: 'Rich and creamy black lentils',
    isVeg: true,
    spiceLevel: 'mild',
    cookingTime: 25,
    rating: 4.6,
    isPopular: true,
    allergens: ['Dairy'],
    taxCategory: 'food',
    nutritionalInfo: { calories: 250, protein: 12, carbs: 30, fat: 10 }
  },
  { 
    id: '4', 
    name: 'Butter Chicken', 
    price: 280, 
    category: 'Main Course', 
    available: true, 
    description: 'Chicken in tomato-based curry',
    isVeg: false,
    spiceLevel: 'mild',
    cookingTime: 30,
    rating: 4.8,
    isPopular: true,
    allergens: ['Dairy'],
    taxCategory: 'food',
    nutritionalInfo: { calories: 420, protein: 32, carbs: 12, fat: 28 }
  },
  { 
    id: '5', 
    name: 'Hyderabadi Biryani', 
    price: 250, 
    category: 'Main Course', 
    available: true, 
    description: 'Aromatic basmati rice with spices',
    isVeg: false,
    spiceLevel: 'medium',
    cookingTime: 45,
    rating: 4.9,
    isPopular: true,
    allergens: ['Dairy'],
    taxCategory: 'food',
    nutritionalInfo: { calories: 520, protein: 25, carbs: 65, fat: 18 }
  },
  { 
    id: '6', 
    name: 'Masala Chai', 
    price: 30, 
    category: 'Beverages', 
    available: true, 
    description: 'Traditional Indian spiced tea',
    isVeg: true,
    spiceLevel: 'mild',
    cookingTime: 5,
    rating: 4.2,
    isPopular: false,
    allergens: ['Dairy'],
    taxCategory: 'beverage',
    nutritionalInfo: { calories: 80, protein: 2, carbs: 12, fat: 3 }
  },
  { 
    id: '7', 
    name: 'Old Monk Rum', 
    price: 150, 
    category: 'Bar', 
    available: true, 
    description: 'Premium dark rum - 60ml peg',
    isVeg: true,
    spiceLevel: 'mild',
    cookingTime: 2,
    rating: 4.4,
    isPopular: true,
    allergens: [],
    taxCategory: 'bar',
    nutritionalInfo: { calories: 120, protein: 0, carbs: 0, fat: 0 }
  }
];

// Generate default table data
const generateDefaultTables = (): Table[] => {
  const statuses: ('free' | 'occupied' | 'reserved')[] = ['free', 'occupied', 'reserved'];
  const waiters = ['Raj', 'Priya', 'Amit', 'Sunita', 'Rohit', 'Neha', 'Vikram', 'Meera'];
  const customers = ['Sharma Family', 'Kumar Party', 'Gupta Family', 'Singh Sir', 'Patel Group', 'Agarwal Family', 'Mishra Sir', 'Jain Family', 'Verma Party', 'Chopra Group'];
  const capacities = [2, 4, 6, 8];
  
  const tables: Table[] = [];
  
  for (let i = 1; i <= 45; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const capacity = capacities[Math.floor(Math.random() * capacities.length)];
    const waiter = waiters[Math.floor(Math.random() * waiters.length)];
    
    let table: Table = {
      id: i.toString(),
      number: i,
      capacity,
      status,
      waiter
    };
    
    if (status === 'occupied') {
      table.customer = customers[Math.floor(Math.random() * customers.length)];
      table.orderAmount = Math.floor(Math.random() * 1500) + 200;
      table.timeOccupied = `${Math.floor(Math.random() * 90) + 5} min`;
      table.guests = Math.floor(Math.random() * capacity) + 1;
      table.lastOrderId = `ORD${Date.now()}${i}`;
    } else if (status === 'reserved') {
      table.customer = customers[Math.floor(Math.random() * customers.length)];
      table.guests = Math.floor(Math.random() * capacity) + 1;
      table.reservationTime = `${Math.floor(Math.random() * 30) + 5} min`;
      table.reservationName = table.customer;
      table.reservationPhone = `+91 ${Math.floor(Math.random() * 900000000) + 100000000}`;
    }
    
    tables.push(table);
  }
  
  return tables;
};

const defaultTables: Table[] = generateDefaultTables();

// Default recipes data
const defaultRecipes: Recipe[] = [
  {
    id: 'recipe1',
    menuItemId: '1',
    menuItemName: 'Paneer Tikka',
    ingredients: [
      { inventoryItemId: '1', inventoryItemName: 'Paneer', quantity: 0.2, unit: 'kg' },
      { inventoryItemId: '5', inventoryItemName: 'Yogurt', quantity: 0.1, unit: 'kg' },
      { inventoryItemId: '3', inventoryItemName: 'Spices', quantity: 0.05, unit: 'kg' }
    ],
    yield: 2,
    cost: 80,
    preparationTime: 30,
    instructions: ['Marinate paneer in yogurt and spices', 'Grill for 15 minutes', 'Serve hot']
  },
  {
    id: 'recipe2',
    menuItemId: '4',
    menuItemName: 'Butter Chicken',
    ingredients: [
      { inventoryItemId: '2', inventoryItemName: 'Chicken', quantity: 0.3, unit: 'kg' },
      { inventoryItemId: '4', inventoryItemName: 'Tomatoes', quantity: 0.2, unit: 'kg' },
      { inventoryItemId: '5', inventoryItemName: 'Cream', quantity: 0.1, unit: 'liter' }
    ],
    yield: 2,
    cost: 120,
    preparationTime: 45,
    instructions: ['Cook chicken', 'Prepare tomato gravy', 'Add cream and simmer']
  }
];

// Removed first duplicate - keeping second version below


// Removed first duplicate - keeping second version below


// Removed first duplicate - keeping second version below


// Generate sample orders for demonstration
const generateDefaultOrders = (): Order[] => {
  const orderSources: Order['orderSource'][] = ['dine-in', 'zomato', 'swiggy', 'takeaway'];
  const statuses: Order['status'][] = ['new', 'preparing', 'ready', 'completed'];
  const waiters = ['Raj', 'Priya', 'Amit', 'Sunita'];
  const priorities: Order['priority'][] = ['normal', 'high', 'urgent'];
  
  return [
    {
      id: 'ORD001',
      tableNumber: 5,
      orderSource: 'dine-in',
      customerName: 'Sharma Family',
      customerPhone: '+91 98765 43210',
      items: [
        { id: '1', name: 'Butter Chicken', quantity: 2, price: 280, category: 'Main Course' },
        { id: '2', name: 'Garlic Naan', quantity: 3, price: 60, category: 'Breads' },
        { id: '3', name: 'Dal Makhani', quantity: 1, price: 160, category: 'Main Course' }
      ],
      status: 'new',
      orderTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedTime: 25,
      priority: 'normal',
      waiter: 'Raj',
      deliveryType: 'dine-in',
      paymentMethod: 'cash',
      specialInstructions: 'Less spicy for kids',
      totalAmount: 1000,
      subtotal: 840,
      taxes: [
        { name: 'CGST', rate: 9, amount: 75.6 },
        { name: 'SGST', rate: 9, amount: 75.6 }
      ]
    },
    {
      id: 'ORD002',
      tableNumber: 3,
      orderSource: 'dine-in',
      customerName: 'Kumar Party',
      customerPhone: '+91 87654 32109',
      items: [
        { id: '4', name: 'Chicken Biryani', quantity: 1, price: 250, category: 'Main Course' },
        { id: '5', name: 'Raita', quantity: 1, price: 80, category: 'Sides' }
      ],
      status: 'preparing',
      orderTime: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedTime: 35,
      priority: 'high',
      waiter: 'Priya',
      deliveryType: 'dine-in',
      paymentMethod: 'card',
      preparedBy: 'Chef Ravi',
      totalAmount: 389,
      subtotal: 330,
      taxes: [
        { name: 'CGST', rate: 9, amount: 29.7 },
        { name: 'SGST', rate: 9, amount: 29.7 }
      ]
    },
    {
      id: 'ORD003',
      orderSource: 'zomato',
      customerName: 'Rajesh Patel',
      customerPhone: '+91 99988 77766',
      items: [
        { id: '6', name: 'Paneer Tikka', quantity: 1, price: 240, category: 'Starters' },
        { id: '7', name: 'Roti', quantity: 4, price: 25, category: 'Breads' },
        { id: '8', name: 'Mixed Vegetables', quantity: 1, price: 180, category: 'Main Course' }
      ],
      status: 'new',
      orderTime: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedTime: 20,
      priority: 'normal',
      waiter: 'Online',
      deliveryType: 'delivery',
      paymentMethod: 'upi',
      deliveryAddress: '123 Gandhi Nagar, Delhi',
      totalAmount: 520,
      subtotal: 440,
      taxes: [
        { name: 'CGST', rate: 9, amount: 39.6 },
        { name: 'SGST', rate: 9, amount: 39.6 }
      ]
    },
    {
      id: 'ORD004',
      orderSource: 'swiggy',
      customerName: 'Priya Singh',
      customerPhone: '+91 88776 65543',
      items: [
        { id: '9', name: 'Masala Dosa', quantity: 2, price: 120, category: 'South Indian' },
        { id: '10', name: 'Filter Coffee', quantity: 2, price: 40, category: 'Beverages' }
      ],
      status: 'ready',
      orderTime: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedTime: 15,
      priority: 'high',
      waiter: 'Online',
      deliveryType: 'pickup',
      paymentMethod: 'card',
      totalAmount: 320,
      subtotal: 280,
      taxes: [
        { name: 'CGST', rate: 7.5, amount: 21 },
        { name: 'SGST', rate: 7.5, amount: 21 }
      ]
    },
    {
      id: 'ORD005',
      orderSource: 'takeaway',
      customerName: 'Amit Gupta',
      customerPhone: '+91 77665 54321',
      items: [
        { id: '11', name: 'Chicken Tikka', quantity: 1, price: 320, category: 'Starters' },
        { id: '12', name: 'Jeera Rice', quantity: 1, price: 120, category: 'Rice' }
      ],
      status: 'completed',
      orderTime: new Date(Date.now() - 45 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedTime: 0,
      priority: 'normal',
      waiter: 'POS System',
      deliveryType: 'takeaway',
      paymentMethod: 'cash',
      totalAmount: 440,
      subtotal: 440,
      taxes: [],
      completedAt: new Date(Date.now() - 30 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      rating: 4.5,
      feedback: 'Great food quality and quick service!'
    },
    // Additional completed orders with ratings for AI analysis
    {
      id: 'ORD006',
      orderSource: 'dine-in',
      tableNumber: 8,
      customerName: 'Sharma Family',
      customerPhone: '+91 99887 76654',
      items: [
        { id: '1', name: 'Butter Chicken', quantity: 1, price: 280, category: 'Main Course' },
        { id: '2', name: 'Naan', quantity: 2, price: 45, category: 'Breads' },
        { id: '6', name: 'Masala Chai', quantity: 2, price: 30, category: 'Beverages' }
      ],
      status: 'completed',
      orderTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedTime: 0,
      actualCookingTime: 18,
      priority: 'normal',
      waiter: 'Raj',
      deliveryType: 'dine-in',
      paymentMethod: 'upi',
      totalAmount: 400,
      subtotal: 400,
      taxes: [],
      completedAt: new Date(Date.now() - 90 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      rating: 5,
      feedback: 'Absolutely delicious! Best butter chicken in the city.'
    },
    {
      id: 'ORD007',
      orderSource: 'swiggy',
      customerName: 'Anjali Verma',
      customerPhone: '+91 88990 01122',
      items: [
        { id: '5', name: 'Hyderabadi Biryani', quantity: 1, price: 250, category: 'Main Course' },
        { id: '10', name: 'Raita', quantity: 1, price: 80, category: 'Sides' }
      ],
      status: 'completed',
      orderTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedTime: 0,
      actualCookingTime: 35,
      priority: 'normal',
      waiter: 'Online',
      deliveryType: 'delivery',
      paymentMethod: 'card',
      totalAmount: 330,
      subtotal: 330,
      taxes: [],
      completedAt: new Date(Date.now() - 150 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      rating: 4,
      feedback: 'Good taste but delivery was slightly delayed.'
    },
    {
      id: 'ORD008',
      orderSource: 'dine-in',
      tableNumber: 12,
      customerName: 'Dev Patel',
      customerPhone: '+91 77554 43322',
      items: [
        { id: '3', name: 'Dal Makhani', quantity: 1, price: 160, category: 'Main Course' },
        { id: '4', name: 'Jeera Rice', quantity: 1, price: 120, category: 'Rice' },
        { id: '6', name: 'Masala Chai', quantity: 1, price: 30, category: 'Beverages' }
      ],
      status: 'completed',
      orderTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedTime: 0,
      actualCookingTime: 22,
      priority: 'normal',
      waiter: 'Priya',
      deliveryType: 'dine-in',
      paymentMethod: 'cash',
      totalAmount: 310,
      subtotal: 310,
      taxes: [],
      completedAt: new Date(Date.now() - 210 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      rating: 3.5,
      feedback: 'Food was okay but service was slow.'
    },
    {
      id: 'ORD009',
      orderSource: 'zomato',
      customerName: 'Meera Shah',
      customerPhone: '+91 66443 32211',
      items: [
        { id: '1', name: 'Butter Chicken', quantity: 2, price: 280, category: 'Main Course' },
        { id: '2', name: 'Naan', quantity: 4, price: 45, category: 'Breads' }
      ],
      status: 'completed',
      orderTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedTime: 0,
      actualCookingTime: 25,
      priority: 'high',
      waiter: 'Online',
      deliveryType: 'delivery',
      paymentMethod: 'upi',
      totalAmount: 740,
      subtotal: 740,
      taxes: [],
      completedAt: new Date(Date.now() - 330 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      rating: 4.8,
      feedback: 'Excellent food! Will definitely order again.'
    },
    {
      id: 'ORD010',
      orderSource: 'takeaway',
      customerName: 'Suresh Kumar',
      customerPhone: '+91 55332 21100',
      items: [
        { id: '5', name: 'Hyderabadi Biryani', quantity: 1, price: 250, category: 'Main Course' },
        { id: '6', name: 'Masala Chai', quantity: 1, price: 30, category: 'Beverages' }
      ],
      status: 'completed',
      orderTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      orderDate: new Date().toISOString().split('T')[0],
      estimatedTime: 0,
      actualCookingTime: 40,
      priority: 'normal',
      waiter: 'POS System',
      deliveryType: 'takeaway',
      paymentMethod: 'card',
      totalAmount: 280,
      subtotal: 280,
      taxes: [],
      completedAt: new Date(Date.now() - 450 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      rating: 4.2,
      feedback: 'Great biryani as always!'
    },
    // Previous day orders for trend analysis
    {
      id: 'ORD011',
      orderSource: 'dine-in',
      tableNumber: 5,
      customerName: 'Rakesh Agarwal',
      customerPhone: '+91 44556 67788',
      items: [
        { id: '3', name: 'Dal Makhani', quantity: 1, price: 160, category: 'Main Course' },
        { id: '2', name: 'Naan', quantity: 2, price: 45, category: 'Breads' }
      ],
      status: 'completed',
      orderTime: '7:30 PM',
      orderDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
      estimatedTime: 0,
      actualCookingTime: 20,
      priority: 'normal',
      waiter: 'Amit',
      deliveryType: 'dine-in',
      paymentMethod: 'cash',
      totalAmount: 250,
      subtotal: 250,
      taxes: [],
      completedAt: '8:00 PM',
      rating: 3.8,
      feedback: 'Food was good but ambiance could be better.'
    },
    {
      id: 'ORD012',
      orderSource: 'swiggy',
      customerName: 'Pooja Reddy',
      customerPhone: '+91 33445 56677',
      items: [
        { id: '5', name: 'Hyderabadi Biryani', quantity: 2, price: 250, category: 'Main Course' }
      ],
      status: 'completed',
      orderTime: '8:15 PM',
      orderDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
      estimatedTime: 0,
      actualCookingTime: 45,
      priority: 'normal',
      waiter: 'Online',
      deliveryType: 'delivery',
      paymentMethod: 'upi',
      totalAmount: 500,
      subtotal: 500,
      taxes: [],
      completedAt: '9:15 PM',
      rating: 4.7,
      feedback: 'Outstanding biryani! Perfectly cooked.'
    }
  ];
};

const defaultOrders: Order[] = generateDefaultOrders();

const defaultStaff: Staff[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    role: 'Manager',
    phone: '+91 98765 43210',
    email: 'rajesh@eatwithme.com',
    pin: '1234',
    isActive: true,
    joinDate: '2024-01-15',
    salary: 45000,
    currentShift: 'Evening',
    permissions: ['dashboard', 'pos', 'reports', 'menu', 'staff', 'settings', 'inventory', 'kitchen', 'tables', 'customers', 'marketing'],
    dashboardModules: ['dashboard', 'pos', 'reports', 'staff', 'tables'],
    performance: {
      ordersHandled: 150,
      avgOrderTime: 12,
      customerRating: 4.7
    },
    salaryDetails: {
      baseSalary: 40000,
      allowances: 5000,
      deductions: 1000,
      overtime: 1000,
      totalSalary: 45000
    },
    paymentHistory: []
  },
  {
    id: '2',
    name: 'Priya Singh',
    role: 'Cashier',
    phone: '+91 87654 32109',
    pin: '2345',
    isActive: true,
    joinDate: '2024-02-01',
    salary: 25000,
    permissions: ['pos', 'reports', 'customers'],
    dashboardModules: ['pos', 'customers'],
    performance: {
      ordersHandled: 200,
      avgOrderTime: 8,
      customerRating: 4.5
    },
    salaryDetails: {
      baseSalary: 22000,
      allowances: 3000,
      deductions: 500,
      overtime: 500,
      totalSalary: 25000
    },
    paymentHistory: []
  },
  {
    id: '3',
    name: 'Amit Sharma',
    role: 'Waiter',
    phone: '+91 76543 21098',
    pin: '3456',
    isActive: true,
    joinDate: '2024-01-20',
    salary: 18000,
    currentShift: 'Morning',
    permissions: ['pos', 'tables', 'customers'],
    dashboardModules: ['tables', 'pos'],
    performance: {
      ordersHandled: 180,
      avgOrderTime: 10,
      customerRating: 4.6
    },
    salaryDetails: {
      baseSalary: 15000,
      allowances: 3000,
      deductions: 0,
      overtime: 0,
      totalSalary: 18000
    },
    paymentHistory: []
  },
  {
    id: '4',
    name: 'Chef Ravi',
    role: 'Chef',
    phone: '+91 65432 10987',
    pin: '4567',
    isActive: true,
    joinDate: '2024-01-10',
    salary: 35000,
    currentShift: 'Evening',
    permissions: ['kitchen', 'menu', 'inventory'],
    dashboardModules: ['kitchen', 'inventory'],
    performance: {
      ordersHandled: 300,
      avgOrderTime: 15,
      customerRating: 4.8
    },
    salaryDetails: {
      baseSalary: 32000,
      allowances: 3000,
      deductions: 0,
      overtime: 0,
      totalSalary: 35000
    },
    paymentHistory: []
  }
];

const defaultShifts: Shift[] = [];
const defaultSalaryPayments: SalaryPayment[] = [];

// Default Extended Customers Data
const defaultExtendedCustomers: ExtendedCustomer[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@email.com',
    whatsappOptIn: true,
    birthDate: '1985-06-15',
    preferences: ['Vegetarian', 'Spicy Food'],
    orderHistory: [
      {
        id: 'order_1',
        date: '2024-01-15',
        items: ['Paneer Butter Masala', 'Garlic Naan'],
        amount: 450,
        table: 5
      }
    ],
    totalSpent: 2150,
    visitCount: 8,
    averageOrderValue: 268,
    lastVisit: '2024-01-15',
    loyaltyPoints: 215,
    tier: 'silver'
  },
  {
    id: '2',
    name: 'Priya Singh',
    phone: '+91 87654 32109',
    email: 'priya@email.com',
    whatsappOptIn: true,
    anniversary: '2020-02-14',
    preferences: ['Italian', 'Continental'],
    orderHistory: [
      {
        id: 'order_2',
        date: '2024-01-12',
        items: ['Margherita Pizza', 'Cappuccino'],
        amount: 380,
        table: 3
      }
    ],
    totalSpent: 1520,
    visitCount: 5,
    averageOrderValue: 304,
    lastVisit: '2024-01-12',
    loyaltyPoints: 152,
    tier: 'bronze'
  }
];

// Default Expenses Data
const defaultExpenses: Expense[] = [
  {
    id: 'exp_1',
    title: 'Monthly Rent',
    category: 'Fixed Costs',
    subcategory: 'Rent',
    amount: 50000,
    date: '2024-01-01',
    vendor: 'Property Owner',
    description: 'Monthly restaurant rent',
    paymentMethod: 'bank_transfer',
    status: 'paid',
    receiptNumber: 'REC001',
    recurring: true,
    recurringPeriod: 'monthly',
    approvedBy: 'Manager',
    netAmount: 50000
  },
  {
    id: 'exp_2',
    title: 'Electricity Bill',
    category: 'Utilities',
    subcategory: 'Power',
    amount: 8500,
    date: '2024-01-05',
    vendor: 'State Electricity Board',
    description: 'Monthly electricity charges',
    paymentMethod: 'upi',
    status: 'paid',
    receiptNumber: 'EB2024001',
    recurring: true,
    recurringPeriod: 'monthly',
    taxAmount: 1500,
    netAmount: 7000
  },
  {
    id: 'exp_3',
    title: 'Fresh Vegetables',
    category: 'Ingredients',
    subcategory: 'Vegetables',
    amount: 3200,
    date: '2024-01-15',
    vendor: 'Local Vegetable Supplier',
    paymentMethod: 'cash',
    status: 'paid',
    supplierId: 'sup_1',
    tags: ['daily', 'fresh'],
    netAmount: 3200
  }
];

// Default Reservations Data
const defaultReservations: Reservation[] = [
  {
    id: 'res_1',
    customerName: 'Amit Sharma',
    customerPhone: '+91 99887 66554',
    customerEmail: 'amit@email.com',
    date: '2024-01-20',
    time: '19:30',
    partySize: 4,
    tableNumber: 8,
    status: 'confirmed',
    specialRequests: 'Anniversary celebration, need cake arrangement',
    occasion: 'Anniversary',
    createdAt: '2024-01-15T10:30:00Z',
    source: 'phone',
    priority: 'high',
    reminderSent: false
  },
  {
    id: 'res_2',
    customerName: 'Sarah Johnson',
    customerPhone: '+91 88776 65543',
    date: '2024-01-22',
    time: '20:00',
    partySize: 6,
    tableNumber: 12,
    status: 'pending',
    specialRequests: 'Business dinner, quiet section preferred',
    createdAt: '2024-01-16T14:20:00Z',
    source: 'online',
    priority: 'normal',
    reminderSent: false
  },
  {
    id: 'res_3',
    customerName: 'Vikram Patel',
    customerPhone: '+91 77665 54432',
    date: '2024-01-18',
    time: '13:00',
    partySize: 2,
    tableNumber: 5,
    status: 'completed',
    createdAt: '2024-01-10T09:15:00Z',
    source: 'walk-in',
    priority: 'normal',
    reminderSent: true,
    arrivalStatus: 'on-time',
    diningDuration: 90,
    orderTotal: 850,
    rating: 5,
    feedback: 'Excellent food and service!'
  }
];

// Default Purchase Orders Data
const defaultPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'PO001',
    supplierId: '1',
    supplierName: 'Fresh Vegetable Suppliers',
    orderDate: '2024-03-15',
    expectedDate: '2024-03-18',
    status: 'shipped',
    totalAmount: 25000,
    items: [
      { itemName: 'Tomatoes', quantity: 50, unit: 'kg', rate: 30, amount: 1500 },
      { itemName: 'Onions', quantity: 100, unit: 'kg', rate: 25, amount: 2500 },
      { itemName: 'Potatoes', quantity: 75, unit: 'kg', rate: 20, amount: 1500 }
    ]
  },
  {
    id: 'PO002',
    supplierId: '2',
    supplierName: 'Spice World Trading',
    orderDate: '2024-03-14',
    expectedDate: '2024-03-20',
    status: 'confirmed',
    totalAmount: 15000,
    items: [
      { itemName: 'Garam Masala', quantity: 10, unit: 'kg', rate: 400, amount: 4000 },
      { itemName: 'Turmeric Powder', quantity: 20, unit: 'kg', rate: 180, amount: 3600 }
    ]
  }
];

// Default Budget Categories Data
const defaultBudgetCategories: BudgetCategory[] = [
  {
    id: 'budget_1',
    name: 'Raw Materials',
    budget: 50000,
    spent: 35000,
    icon: 'Utensils',
    color: 'bg-green-100 text-green-700',
    description: 'Food ingredients and cooking materials',
    isActive: true
  },
  {
    id: 'budget_2',
    name: 'Utilities',
    budget: 25000,
    spent: 18200,
    icon: 'Zap',
    color: 'bg-yellow-100 text-yellow-700',
    description: 'Electricity, water, gas, and other utilities',
    isActive: true
  },
  {
    id: 'budget_3',
    name: 'Staff',
    budget: 80000,
    spent: 12000,
    icon: 'Users',
    color: 'bg-blue-100 text-blue-700',
    description: 'Staff salaries and benefits',
    isActive: true
  },
  {
    id: 'budget_4',
    name: 'Maintenance',
    budget: 15000,
    spent: 5500,
    icon: 'Building',
    color: 'bg-purple-100 text-purple-700',
    description: 'Equipment and facility maintenance',
    isActive: true
  },
  {
    id: 'budget_5',
    name: 'Transportation',
    budget: 10000,
    spent: 7500,
    icon: 'Truck',
    color: 'bg-orange-100 text-orange-700',
    description: 'Delivery and transportation costs',
    isActive: true
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Existing state
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(defaultMenuItems);
  const [suppliers, setSuppliers] = useState<Supplier[]>(defaultSuppliers);
  const [customers, setCustomers] = useState<Customer[]>(defaultCustomers);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(defaultInventoryItems);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [tables, setTables] = useState<Table[]>(defaultTables);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);
  const [loyaltyMembers, setLoyaltyMembers] = useState<LoyaltyMember[]>(defaultLoyaltyMembers);
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>(defaultLoyaltyRewards);
  const [loyaltyRules, setLoyaltyRules] = useState<LoyaltyRule[]>(defaultLoyaltyRules);
  
  // New data state
  const [recipes, setRecipes] = useState<Recipe[]>(defaultRecipes);
  const [extendedCustomers, setExtendedCustomers] = useState<ExtendedCustomer[]>(defaultExtendedCustomers);
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [reservations, setReservations] = useState<Reservation[]>(defaultReservations);
  const [staff, setStaff] = useState<Staff[]>(defaultStaff);
  const [shifts, setShifts] = useState<Shift[]>(defaultShifts);
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>(defaultSalaryPayments);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(defaultPurchaseOrders);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(defaultBudgetCategories);
  
  // New dynamic state
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [currentModule, setCurrentModule] = useState('dashboard');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  // Derived state
  const userRole = currentUser ? USER_ROLES.find(role => role.id === currentUser.role) : null;
  const availableModules = currentUser 
    ? getAvailableModulesForUser(currentUser.role, currentUser.permissions)
    : [];
  const bottomNavigation = currentUser ? getBottomNavigationForRole(currentUser.role) : [];
  const quickActions = currentUser ? getQuickActionsForRole(currentUser.role) : [];

  // Update navigation when user changes
  useEffect(() => {
    if (currentUser) {
      // Auto-navigate to first available module if current module is not accessible
      const hasAccess = hasModuleAccess(currentUser.role, currentModule, currentUser.permissions);
      if (!hasAccess && availableModules.length > 0) {
        setCurrentModule(availableModules[0].id);
      }
    }
  }, [currentUser, currentModule, availableModules]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // If country changes, update tax rules and currency
      if (newSettings.country && newSettings.country !== prev.country) {
        updated.taxRules = getDefaultTaxRules(newSettings.country);
        updated.currency = countryCurrencyMap[newSettings.country]?.currency || 'USD';
        updated.currencySymbol = countryCurrencyMap[newSettings.country]?.symbol || '$';
      }
      return updated;
    });
  };

  const updateMenuItems = (items: MenuItem[]) => {
    setMenuItems(items);
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  // Staff functions
  const addStaff = (staffMember: Staff) => {
    setStaff(prev => [...prev, staffMember]);
  };

  const updateStaff = (id: string, updates: Partial<Staff>) => {
    setStaff(prev => prev.map(staffMember => 
      staffMember.id === id ? { ...staffMember, ...updates } : staffMember
    ));
  };

  const deleteStaff = (id: string) => {
    setStaff(prev => prev.filter(staffMember => staffMember.id !== id));
  };

  // Shift functions
  const addShift = (shift: Shift) => {
    setShifts(prev => [...prev, shift]);
  };

  const updateShift = (id: string, updates: Partial<Shift>) => {
    setShifts(prev => prev.map(shift => 
      shift.id === id ? { ...shift, ...updates } : shift
    ));
  };

  // Salary payment functions
  const addSalaryPayment = (payment: SalaryPayment) => {
    setSalaryPayments(prev => [...prev, payment]);
  };

  // Supplier functions
  const updateSuppliers = (newSuppliers: Supplier[]) => {
    setSuppliers(newSuppliers);
  };

  const addSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [...prev, supplier]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(supplier => 
      supplier.id === id ? { ...supplier, ...updates } : supplier
    ));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
  };

  // Customer functions
  const updateCustomers = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  // Inventory functions  
  const updateInventoryItems = (items: InventoryItem[]) => {
    setInventoryItems(items);
  };

  const addInventoryItem = (item: InventoryItem) => {
    setInventoryItems(prev => [...prev, item]);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteInventoryItem = (id: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== id));
  };

  // Category functions
  const updateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };

  const getCategoriesByType = (type: Category['type']) => {
    return categories.filter(category => category.type === type && category.isActive);
  };

  const addTaxRule = (taxRule: TaxRule) => {
    setSettings(prev => ({
      ...prev,
      taxRules: [...prev.taxRules, taxRule]
    }));
  };

  const updateTaxRule = (id: string, updates: Partial<TaxRule>) => {
    setSettings(prev => ({
      ...prev,
      taxRules: prev.taxRules.map(rule => 
        rule.id === id ? { ...rule, ...updates } : rule
      )
    }));
  };

  const deleteTaxRule = (id: string) => {
    setSettings(prev => ({
      ...prev,
      taxRules: prev.taxRules.filter(rule => rule.id !== id)
    }));
  };

  const calculateTaxes = (baseAmount: number, taxCategory: string) => {
    const applicableTaxes = settings.taxRules.filter(rule => 
      rule.isActive && (
        rule.applicableCategories.includes(taxCategory) ||
        rule.applicableCategories.includes('all')
      )
    );

    const taxes = applicableTaxes.map(rule => ({
      name: rule.name,
      rate: rule.rate,
      amount: (baseAmount * rule.rate) / 100
    }));

    const totalTax = taxes.reduce((sum, tax) => sum + tax.amount, 0);

    return { taxes, totalTax };
  };

  // Loyalty Management Methods
  const updateLoyaltyMembers = (members: LoyaltyMember[]) => {
    setLoyaltyMembers(members);
  };

  const addLoyaltyMember = (member: LoyaltyMember) => {
    setLoyaltyMembers(prev => [...prev, member]);
  };

  const updateLoyaltyMember = (id: string, updates: Partial<LoyaltyMember>) => {
    setLoyaltyMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  const deleteLoyaltyMember = (id: string) => {
    setLoyaltyMembers(prev => prev.filter(member => member.id !== id));
  };

  const updateLoyaltyRewards = (rewards: LoyaltyReward[]) => {
    setLoyaltyRewards(rewards);
  };

  const addLoyaltyReward = (reward: LoyaltyReward) => {
    setLoyaltyRewards(prev => [...prev, reward]);
  };

  const updateLoyaltyReward = (id: string, updates: Partial<LoyaltyReward>) => {
    setLoyaltyRewards(prev => prev.map(reward => 
      reward.id === id ? { ...reward, ...updates } : reward
    ));
  };

  const deleteLoyaltyReward = (id: string) => {
    setLoyaltyRewards(prev => prev.filter(reward => reward.id !== id));
  };

  const updateLoyaltyRules = (rules: LoyaltyRule[]) => {
    setLoyaltyRules(rules);
  };

  const addLoyaltyRule = (rule: LoyaltyRule) => {
    setLoyaltyRules(prev => [...prev, rule]);
  };

  const updateLoyaltyRule = (id: string, updates: Partial<LoyaltyRule>) => {
    setLoyaltyRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, ...updates } : rule
    ));
  };

  const deleteLoyaltyRule = (id: string) => {
    setLoyaltyRules(prev => prev.filter(rule => rule.id !== id));
  };

  // New dynamic methods
  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    // Reset some state when user changes
    if (!user) {
      setSelectedTable(null);
      setCurrentOrder(null);
      setCurrentModule('dashboard');
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission) || currentUser.permissions.includes('*');
  };

  const hasModuleAccessMethod = (moduleId: string): boolean => {
    if (!currentUser) return false;
    return hasModuleAccess(currentUser.role, moduleId, currentUser.permissions);
  };

  const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only last 50 notifications
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getModuleByComponent = (componentName: string): ModuleConfig | undefined => {
    return APP_MODULES.find(module => module.component === componentName);
  };

  // Table management functions
  const updateTables = (newTables: Table[]) => {
    setTables(newTables);
  };

  const addTable = (table: Table) => {
    setTables(prev => [...prev, table]);
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    setTables(prev => prev.map(table => 
      table.id === id ? { ...table, ...updates } : table
    ));
  };

  const deleteTable = (id: string) => {
    setTables(prev => prev.filter(table => table.id !== id));
  };

  const getTableById = (id: string): Table | undefined => {
    return tables.find(table => table.id === id);
  };

  const getTableByNumber = (number: number): Table | undefined => {
    return tables.find(table => table.number === number);
  };

  const getAvailableTables = (): Table[] => {
    return tables.filter(table => table.status === 'free');
  };

  const getTableStats = () => {
    return {
      total: tables.length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      free: tables.filter(t => t.status === 'free').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      revenue: tables.reduce((sum, t) => sum + (t.orderAmount || 0), 0)
    };
  };

  // Order management functions
  const updateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const getOrdersByTable = (tableNumber: number): Order[] => {
    return orders.filter(order => order.tableNumber === tableNumber);
  };

  const getOrdersByStatus = (status: Order['status']): Order[] => {
    return orders.filter(order => order.status === status);
  };

  const getOrderById = (id: string): Order | undefined => {
    return orders.find(order => order.id === id);
  };

  // Revenue and analytics methods
  const getTodayRevenue = () => {
    const today = new Date().toISOString().split('T')[0];
    return orders
      .filter(order => order.orderDate === today && order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const getRevenueBetweenDates = (startDate: string, endDate: string) => {
    return orders
      .filter(order => 
        order.orderDate >= startDate && 
        order.orderDate <= endDate && 
        order.status === 'completed'
      )
      .reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const getRevenueByPaymentMethod = (dateFilter?: string) => {
    let filteredOrders = orders.filter(order => order.status === 'completed');
    
    if (dateFilter) {
      const today = new Date().toISOString().split('T')[0];
      filteredOrders = filteredOrders.filter(order => order.orderDate === today);
    }

    const cash = filteredOrders
      .filter(order => order.paymentMethod === 'cash')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const digital = filteredOrders
      .filter(order => ['upi', 'card'].includes(order.paymentMethod || ''))
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const split = filteredOrders
      .filter(order => order.paymentMethod === 'split')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return { cash, digital, split };
  };

  const getRevenueByOrderSource = (dateFilter?: string) => {
    let filteredOrders = orders.filter(order => order.status === 'completed');
    
    if (dateFilter) {
      const today = new Date().toISOString().split('T')[0];
      filteredOrders = filteredOrders.filter(order => order.orderDate === today);
    }

    return filteredOrders.reduce((acc, order) => {
      const source = order.orderSource;
      acc[source] = (acc[source] || 0) + order.totalAmount;
      return acc;
    }, {} as Record<string, number>);
  };

  const getOrderStats = (dateFilter?: string) => {
    let filteredOrders = orders;
    
    if (dateFilter) {
      const today = new Date().toISOString().split('T')[0];
      filteredOrders = orders.filter(order => order.orderDate === today);
    }

    const total = filteredOrders.length;
    const completed = filteredOrders.filter(order => order.status === 'completed').length;
    const pending = filteredOrders.filter(order => 
      ['new', 'preparing', 'ready'].includes(order.status)
    ).length;
    const cancelled = filteredOrders.filter(order => order.status === 'cancelled').length;

    const totalRevenue = filteredOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const avgOrderValue = completed > 0 ? Math.round(totalRevenue / completed) : 0;

    return { total, completed, pending, cancelled, totalRevenue, avgOrderValue };
  };

  // Shared date filtering utilities for consistency across components
  const getOrdersByDateRange = (startDate: string, endDate: string): Order[] => {
    return orders.filter(order => 
      order.orderDate >= startDate && order.orderDate <= endDate
    );
  };

  const getOrdersByDateFilter = (filter: 'today' | 'yesterday' | 'week' | 'month' | 'all'): Order[] => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (filter) {
      case 'today':
        return orders.filter(order => order.orderDate === today);
      case 'yesterday':
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        return orders.filter(order => order.orderDate === yesterday);
      case 'week':
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        return orders.filter(order => order.orderDate >= weekAgo && order.orderDate <= today);
      case 'month':
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        return orders.filter(order => order.orderDate >= monthAgo && order.orderDate <= today);
      case 'all':
      default:
        return orders;
    }
  };

  const getOrderStatsByDateFilter = (filter: 'today' | 'yesterday' | 'week' | 'month' | 'all') => {
    const filteredOrders = getOrdersByDateFilter(filter);
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    
    // Payment method breakdown
    const cashAmount = filteredOrders
      .filter(order => order.paymentMethod === 'cash')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    
    const digitalAmount = filteredOrders
      .filter(order => ['upi', 'card'].includes(order.paymentMethod || ''))
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Status breakdown  
    const completed = filteredOrders.filter(order => order.status === 'completed').length;
    const pending = filteredOrders.filter(order => 
      ['new', 'preparing', 'ready'].includes(order.status)
    ).length;
    const cancelled = filteredOrders.filter(order => order.status === 'cancelled').length;

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      cashAmount,
      digitalAmount,
      completed,
      pending,
      cancelled,
      orders: filteredOrders
    };
  };

  // Recipes Management Functions
  const updateRecipes = (newRecipes: Recipe[]) => {
    setRecipes(newRecipes);
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prev => [...prev, recipe]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => prev.map(recipe => 
      recipe.id === id ? { ...recipe, ...updates } : recipe
    ));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const getRecipesByMenuItem = (menuItemId: string): Recipe[] => {
    return recipes.filter(recipe => recipe.menuItemId === menuItemId);
  };

  const calculateRecipeCost = (recipeId: string): number => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return 0;
    
    return recipe.ingredients.reduce((total, ingredient) => {
      const inventoryItem = inventoryItems.find(item => item.id === ingredient.inventoryItemId);
      if (inventoryItem) {
        return total + (ingredient.quantity * inventoryItem.costPerUnit);
      }
      return total;
    }, 0);
  };

  // Extended Customers Management Functions
  const updateExtendedCustomers = (newCustomers: ExtendedCustomer[]) => {
    setExtendedCustomers(newCustomers);
  };

  const addExtendedCustomer = (customer: ExtendedCustomer) => {
    setExtendedCustomers(prev => [...prev, customer]);
  };

  const updateExtendedCustomer = (id: string, updates: Partial<ExtendedCustomer>) => {
    setExtendedCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  };

  const deleteExtendedCustomer = (id: string) => {
    setExtendedCustomers(prev => prev.filter(customer => customer.id !== id));
  };

  const getCustomerOrderHistory = (customerId: string): ExtendedCustomer['orderHistory'] => {
    const customer = extendedCustomers.find(c => c.id === customerId);
    return customer?.orderHistory || [];
  };

  const updateCustomerStats = (customerId: string, newOrder: { amount: number; date: string; items: string[] }) => {
    setExtendedCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const newOrderHistory = [...customer.orderHistory, {
          id: `ORD${Date.now()}`,
          ...newOrder
        }];
        const newTotalSpent = customer.totalSpent + newOrder.amount;
        const newVisitCount = customer.visitCount + 1;
        const newAverageOrderValue = Math.round(newTotalSpent / newVisitCount);
        
        return {
          ...customer,
          orderHistory: newOrderHistory,
          totalSpent: newTotalSpent,
          visitCount: newVisitCount,
          averageOrderValue: newAverageOrderValue,
          lastVisit: newOrder.date,
          loyaltyPoints: (customer.loyaltyPoints || 0) + Math.floor(newOrder.amount / 10)
        };
      }
      return customer;
    }));
  };

  // Expenses Management Functions
  const updateExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
  };

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [...prev, expense]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, ...updates } : expense
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const getExpensesByCategory = (category: string): Expense[] => {
    return expenses.filter(expense => expense.category === category);
  };

  const getExpensesByDateRange = (startDate: string, endDate: string): Expense[] => {
    return expenses.filter(expense => 
      expense.date >= startDate && expense.date <= endDate
    );
  };

  const getTotalExpenses = (dateFilter?: string): number => {
    let filteredExpenses = expenses;
    
    if (dateFilter) {
      const today = new Date().toISOString().split('T')[0];
      filteredExpenses = expenses.filter(expense => expense.date === today);
    }
    
    return filteredExpenses
      .filter(expense => expense.status === 'paid')
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getExpensesBySupplier = (supplierId: string): Expense[] => {
    return expenses.filter(expense => expense.supplierId === supplierId);
  };

  // Purchase Orders Management Functions
  const updatePurchaseOrders = (newOrders: PurchaseOrder[]) => {
    setPurchaseOrders(newOrders);
  };

  const addPurchaseOrder = (order: PurchaseOrder) => {
    setPurchaseOrders(prev => [...prev, order]);
  };

  const updatePurchaseOrder = (id: string, updates: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
  };

  const deletePurchaseOrder = (id: string) => {
    setPurchaseOrders(prev => prev.filter(order => order.id !== id));
  };

  const getPurchaseOrdersBySupplier = (supplierId: string): PurchaseOrder[] => {
    return purchaseOrders.filter(order => order.supplierId === supplierId);
  };

  const getPurchaseOrdersByStatus = (status: PurchaseOrder['status']): PurchaseOrder[] => {
    return purchaseOrders.filter(order => order.status === status);
  };

  // Budget Categories Management Functions
  const updateBudgetCategories = (newCategories: BudgetCategory[]) => {
    setBudgetCategories(newCategories);
  };

  const addBudgetCategory = (category: BudgetCategory) => {
    setBudgetCategories(prev => [...prev, category]);
  };

  const updateBudgetCategory = (id: string, updates: Partial<BudgetCategory>) => {
    setBudgetCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteBudgetCategory = (id: string) => {
    setBudgetCategories(prev => prev.filter(category => category.id !== id));
  };

  const getBudgetCategorySpent = (categoryId: string): number => {
    const category = budgetCategories.find(c => c.id === categoryId);
    return category?.spent || 0;
  };

  const updateBudgetCategorySpent = (categoryId: string, amount: number) => {
    setBudgetCategories(prev => prev.map(category => 
      category.id === categoryId 
        ? { ...category, spent: category.spent + amount } 
        : category
    ));
  };

  // Reservations Management Functions
  const updateReservations = (newReservations: Reservation[]) => {
    setReservations(newReservations);
  };

  const addReservation = (reservation: Reservation) => {
    setReservations(prev => [...prev, reservation]);
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations(prev => prev.map(reservation => 
      reservation.id === id ? { ...reservation, ...updates } : reservation
    ));
  };

  const deleteReservation = (id: string) => {
    setReservations(prev => prev.filter(reservation => reservation.id !== id));
  };

  const getReservationsByDate = (date: string): Reservation[] => {
    return reservations.filter(reservation => reservation.date === date);
  };

  const getReservationsByTable = (tableId: string): Reservation[] => {
    return reservations.filter(reservation => reservation.tableId === tableId);
  };

  const getReservationsByStatus = (status: Reservation['status']): Reservation[] => {
    return reservations.filter(reservation => reservation.status === status);
  };

  // Customer Synchronization Functions
  const syncCustomerFromReservation = (reservation: Reservation) => {
    const existingCustomer = extendedCustomers.find(c => 
      c.phone === reservation.customerPhone || 
      (reservation.customerEmail && c.email === reservation.customerEmail)
    );

    if (!existingCustomer) {
      const newCustomer: ExtendedCustomer = {
        id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: reservation.customerName,
        phone: reservation.customerPhone,
        email: reservation.customerEmail,
        whatsappOptIn: false,
        preferences: [],
        orderHistory: [],
        totalSpent: 0,
        visitCount: 0,
        averageOrderValue: 0,
        lastVisit: reservation.date,
        loyaltyPoints: 0,
        tier: 'bronze'
      };
      
      setExtendedCustomers(prev => [...prev, newCustomer]);
      
      // Also add to basic customers list
      const basicCustomer: Customer = {
        id: newCustomer.id,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        totalOrders: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        lastVisit: reservation.date,
        averageRating: 0,
        tags: [],
        status: 'active'
      };
      
      setCustomers(prev => [...prev, basicCustomer]);
      
      return newCustomer;
    }
    return existingCustomer;
  };

  const syncCustomerFromOrder = (order: Order) => {
    if (!order.customerName || !order.customerPhone) return;

    const existingCustomer = extendedCustomers.find(c => 
      c.phone === order.customerPhone || 
      (order.customerEmail && c.email === order.customerEmail)
    );

    if (!existingCustomer) {
      const newCustomer: ExtendedCustomer = {
        id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        whatsappOptIn: false,
        preferences: [],
        orderHistory: [{
          id: order.id,
          date: order.orderTime,
          items: order.items.map(i => i.name),
          amount: order.totalAmount,
          table: order.tableNumber || 0
        }],
        totalSpent: order.totalAmount,
        visitCount: 1,
        averageOrderValue: order.totalAmount,
        lastVisit: order.orderTime,
        loyaltyPoints: Math.floor(order.totalAmount / 10),
        tier: 'bronze'
      };
      
      setExtendedCustomers(prev => [...prev, newCustomer]);
      
      // Also add to basic customers list
      const basicCustomer: Customer = {
        id: newCustomer.id,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        totalOrders: 1,
        totalSpent: order.totalAmount,
        loyaltyPoints: Math.floor(order.totalAmount / 10),
        lastVisit: order.orderTime,
        averageRating: 0,
        tags: [],
        status: 'active'
      };
      
      setCustomers(prev => [...prev, basicCustomer]);
    } else {
      // Update existing customer with new order
      const orderHistoryItem = {
        id: order.id,
        date: order.orderTime,
        items: order.items.map(i => i.name),
        amount: order.totalAmount,
        table: order.tableNumber || 0
      };

      setExtendedCustomers(prev => prev.map(customer => {
        if (customer.id === existingCustomer.id) {
          const updatedOrderHistory = [...customer.orderHistory, orderHistoryItem];
          const totalSpent = customer.totalSpent + order.totalAmount;
          const visitCount = customer.visitCount + 1;
          
          return {
            ...customer,
            orderHistory: updatedOrderHistory,
            totalSpent,
            visitCount,
            averageOrderValue: totalSpent / visitCount,
            lastVisit: order.orderTime,
            loyaltyPoints: customer.loyaltyPoints + Math.floor(order.totalAmount / 10)
          };
        }
        return customer;
      }));

      // Update basic customer too
      setCustomers(prev => prev.map(customer => {
        if (customer.id === existingCustomer.id) {
          return {
            ...customer,
            totalOrders: customer.totalOrders + 1,
            totalSpent: customer.totalSpent + order.totalAmount,
            loyaltyPoints: customer.loyaltyPoints + Math.floor(order.totalAmount / 10),
            lastVisit: order.orderTime
          };
        }
        return customer;
      }));
    }
  };

  const syncCustomerFromTable = (table: Table) => {
    if (table.status === 'reserved' && table.reservationName && table.reservationPhone) {
      const fakeReservation: Reservation = {
        id: `temp_${table.id}`,
        customerName: table.reservationName,
        customerPhone: table.reservationPhone,
        date: new Date().toISOString().split('T')[0],
        time: table.reservationTime || '00:00',
        partySize: table.guests || 2,
        tableNumber: table.number,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        source: 'phone',
        priority: 'normal',
        reminderSent: false
      };
      
      syncCustomerFromReservation(fakeReservation);
    }
    
    if (table.status === 'occupied' && table.customer) {
      // Try to find if this customer already exists by name
      const existingCustomer = extendedCustomers.find(c => 
        c.name.toLowerCase() === table.customer?.toLowerCase()
      );

      if (!existingCustomer && table.customer) {
        const newCustomer: ExtendedCustomer = {
          id: `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: table.customer,
          phone: 'N/A', // Will be updated when we get actual phone
          whatsappOptIn: false,
          preferences: [],
          orderHistory: [],
          totalSpent: table.orderAmount || 0,
          visitCount: 1,
          averageOrderValue: table.orderAmount || 0,
          lastVisit: new Date().toISOString().split('T')[0],
          loyaltyPoints: Math.floor((table.orderAmount || 0) / 10),
          tier: 'bronze'
        };
        
        setExtendedCustomers(prev => [...prev, newCustomer]);
      }
    }
  };

  const syncAllCustomers = () => {
    // Sync customers from reservations
    reservations.forEach(reservation => {
      syncCustomerFromReservation(reservation);
    });

    // Sync customers from orders
    orders.forEach(order => {
      if (order.customerName && order.customerPhone) {
        syncCustomerFromOrder(order);
      }
    });

    // Sync customers from tables
    tables.forEach(table => {
      syncCustomerFromTable(table);
    });
  };

  // Auto-sync on component mount and data changes
  useEffect(() => {
    syncAllCustomers();
  }, [reservations.length, orders.length, tables.length]);

  // Additional effect to sync on app startup
  useEffect(() => {
    syncAllCustomers();
  }, []);

  return (
    <AppContext.Provider value={{ 
      // Dynamic app config
      appModules: APP_MODULES,
      availableModules,
      bottomNavigation,
      quickActions,
      
      // User state
      currentUser,
      userRole,
      
      // App state
      currentModule,
      selectedTable,
      currentOrder,
      notifications,
      
      // Settings & data
      settings, 
      updateSettings, 
      menuItems, 
      updateMenuItems,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      orders,
      updateOrders,
      addOrder,
      updateOrder,
      deleteOrder,
      getOrdersByTable,
      getOrdersByStatus,
      getOrderById,
      suppliers,
      updateSuppliers,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      customers,
      updateCustomers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      inventoryItems,
      updateInventoryItems,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      categories,
      updateCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      getCategoriesByType,
      addTaxRule,
      updateTaxRule,
      deleteTaxRule,
      calculateTaxes,
      
      // Loyalty management
      loyaltyMembers,
      updateLoyaltyMembers,
      addLoyaltyMember,
      updateLoyaltyMember,
      deleteLoyaltyMember,
      loyaltyRewards,
      updateLoyaltyRewards,
      addLoyaltyReward,
      updateLoyaltyReward,
      deleteLoyaltyReward,
      loyaltyRules,
      updateLoyaltyRules,
      addLoyaltyRule,
      updateLoyaltyRule,
      deleteLoyaltyRule,
      
      // Table management
      tables,
      updateTables,
      addTable,
      updateTable,
      deleteTable,
      getTableById,
      getTableByNumber,
      getAvailableTables,
      getTableStats,
      
      // Dynamic methods
      setCurrentUser,
      setCurrentModule,
      setSelectedTable,
      setCurrentOrder,
      hasPermission,
      hasModuleAccess: hasModuleAccessMethod,
      addNotification,
      markNotificationRead,
      clearNotifications,
      getModuleByComponent,
      
      // Revenue and Analytics methods
      getTodayRevenue,
      getRevenueBetweenDates,
      getRevenueByPaymentMethod,
      getRevenueByOrderSource,
      getOrderStats,
      
      // Shared date filtering utilities
      getOrdersByDateRange,
      getOrdersByDateFilter,
      getOrderStatsByDateFilter,
      
      // Recipes Management
      recipes,
      updateRecipes,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      getRecipesByMenuItem,
      calculateRecipeCost,
      
      // Extended Customers Management
      extendedCustomers,
      updateExtendedCustomers,
      addExtendedCustomer,
      updateExtendedCustomer,
      deleteExtendedCustomer,
      getCustomerOrderHistory,
      updateCustomerStats,
      
      // Expenses Management
      expenses,
      updateExpenses,
      addExpense,
      updateExpense,
      deleteExpense,
      getExpensesByCategory,
      getExpensesByDateRange,
      getTotalExpenses,
      getExpensesBySupplier,
      
      // Purchase Orders Management
      purchaseOrders,
      updatePurchaseOrders,
      addPurchaseOrder,
      updatePurchaseOrder,
      deletePurchaseOrder,
      getPurchaseOrdersBySupplier,
      getPurchaseOrdersByStatus,
      
      // Budget Categories Management
      budgetCategories,
      updateBudgetCategories,
      addBudgetCategory,
      updateBudgetCategory,
      deleteBudgetCategory,
      getBudgetCategorySpent,
      updateBudgetCategorySpent,
      
      // Reservations Management
      reservations,
      updateReservations,
      addReservation,
      updateReservation,
      deleteReservation,
      getReservationsByDate,
      getReservationsByTable,
      getReservationsByStatus,
      syncAllCustomers,

      // Staff Management
      staff,
      addStaff,
      updateStaff,
      deleteStaff,

      // Shift Management
      shifts,
      addShift,
      updateShift,

      // Salary Management
      salaryPayments,
      addSalaryPayment
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};