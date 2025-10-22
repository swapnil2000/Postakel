import { prisma } from '../prisma';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';
import { Order, OrderItem, PaymentMethod } from '../types';

interface CreateOrderInput {
  vendorId: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  taxes: { name: string; rate: number; amount: number; }[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  tableNumber?: string;
}

export const posBillingService = {
  async createOrder(input: CreateOrderInput): Promise<Order> {
    try {
      const order = await prisma.order.create({
        data: {
          vendorId: input.vendorId,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          items: input.items,
          subtotal: input.subtotal,
          taxes: input.taxes,
          totalAmount: input.totalAmount,
          paymentMethod: input.paymentMethod,
          tableNumber: input.tableNumber,
          status: 'completed',
          orderDate: new Date()
        }
      });

      // Update table status if table number provided
      if (input.tableNumber) {
        await prisma.table.update({
          where: { 
            vendorId_number: {
              vendorId: input.vendorId,
              number: parseInt(input.tableNumber)
            }
          },
          data: { 
            status: 'occupied',
            currentOrderId: order.id
          }
        });
      }

      return order;
    } catch (error) {
      logger.error('Create order error:', error);
      throw new AppError(500, 'Failed to create order');
    }
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      return await prisma.order.findUnique({
        where: { id: orderId }
      });
    } catch (error) {
      logger.error('Get order error:', error);
      throw new AppError(500, 'Failed to fetch order');
    }
  },

  async listOrders(vendorId: string): Promise<Order[]> {
    try {
      return await prisma.order.findMany({
        where: { vendorId },
        orderBy: { orderDate: 'desc' }
      });
    } catch (error) {
      logger.error('List orders error:', error);
      throw new AppError(500, 'Failed to list orders');
    }
  },

  async updateOrderStatus(orderId: string, status: 'completed' | 'cancelled'): Promise<Order> {
    try {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status }
      });

      if (status === 'completed' && order.tableNumber) {
        await prisma.table.update({
          where: {
            vendorId_number: {
              vendorId: order.vendorId,
              number: parseInt(order.tableNumber)
            }
          },
          data: { 
            status: 'free',
            currentOrderId: null
          }
        });
      }

      return order;
    } catch (error) {
      logger.error('Update order status error:', error);
      throw new AppError(500, 'Failed to update order status');
    }
  }
};