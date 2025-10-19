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