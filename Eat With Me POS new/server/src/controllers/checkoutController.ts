import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';

const checkoutSchema = z.object({
  orderId: z.string(),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'split']),
  amount: z.number().min(0),
  splitDetails: z.array(z.object({
    method: z.enum(['cash', 'card', 'upi']),
    amount: z.number().min(0)
  })).optional(),
  customerPhone: z.string().optional(),
  notes: z.string().optional()
});

export const checkoutController = {
  async processPayment(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const validatedData = checkoutSchema.parse(req.body);

      const order = await prisma.order.findFirst({
        where: {
          id: validatedData.orderId,
          vendorId
        }
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const payment = await prisma.payment.create({
        data: {
          orderId: validatedData.orderId,
          vendorId,
          method: validatedData.paymentMethod,
          amount: validatedData.amount,
          splitDetails: validatedData.splitDetails,
          status: 'completed',
          customerPhone: validatedData.customerPhone,
          notes: validatedData.notes
        }
      });

      // Update order status
      await prisma.order.update({
        where: { id: validatedData.orderId },
        data: { 
          status: 'completed',
          paymentStatus: 'paid'
        }
      });

      res.status(201).json(payment);
    } catch (error) {
      logger.error('Process payment error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Payment processing failed' });
      }
    }
  },

  async getPaymentHistory(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const { startDate, endDate } = req.query;

      const payments = await prisma.payment.findMany({
        where: {
          vendorId,
          createdAt: {
            gte: startDate ? new Date(startDate as string) : undefined,
            lte: endDate ? new Date(endDate as string) : undefined
          }
        },
        include: {
          order: {
            select: {
              customerName: true,
              orderNumber: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(payments);
    } catch (error) {
      logger.error('Get payment history error:', error);
      res.status(500).json({ message: 'Failed to fetch payment history' });
    }
  }
};
