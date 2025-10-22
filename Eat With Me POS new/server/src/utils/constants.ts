export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
  SPLIT: 'split'
} as const;

export const TABLE_STATUS = {
  FREE: 'free',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved'
} as const;

export const CACHE_KEYS = {
  TABLES: 'tables',
  MENU: 'menu',
  ORDERS: 'orders'
} as const;