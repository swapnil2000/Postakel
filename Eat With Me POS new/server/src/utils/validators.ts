import { z } from 'zod';

export const signupSchema = z.object({
    restaurantName: z.string().min(1).optional(),
    ownerName: z.string().min(1).optional(),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    address: z.string().optional(),
    country: z.string().optional(),
    selectedPlan: z.string().optional()
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const orderSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })),
  subtotal: z.number().min(0),
  taxes: z.array(z.object({
    name: z.string(),
    rate: z.number(),
    amount: z.number()
  })),
  totalAmount: z.number().min(0),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'split']),
  tableNumber: z.string().optional()
});

export const customerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional()
});

export type OrderInput = z.infer<typeof orderSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;