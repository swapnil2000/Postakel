export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  vendorId: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Order {
  id: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  taxes: Tax[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  tableNumber?: string;
  vendorId: string;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'split';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

export interface Tax {
  name: string;
  rate: number;
  amount: number;
}