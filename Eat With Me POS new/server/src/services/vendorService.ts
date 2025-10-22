import { prisma } from '../prisma';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export const vendorService = {
  async getVendorDetails(vendorId: string) {
    try {
      const vendor = await prisma.vendor.findUnique({
        where: { id: vendorId },
        include: {
          restaurant: true,
          staff: {
            include: {
              role: true
            }
          },
          menu: true,
          tables: true
        }
      });

      if (!vendor) {
        throw new AppError(404, 'Vendor not found');
      }

      return vendor;
    } catch (error) {
      logger.error('Get vendor details error:', error);
      throw error;
    }
  },

  async updateVendorSettings(vendorId: string, settings: any) {
    try {
      return await prisma.vendor.update({
        where: { id: vendorId },
        data: {
          settings: settings
        }
      });
    } catch (error) {
      logger.error('Update vendor settings error:', error);
      throw new AppError(500, 'Failed to update vendor settings');
    }
  },

  async getVendorStats(vendorId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [dailyOrders, monthlyRevenue, activeStaff] = await Promise.all([
        prisma.order.count({
          where: {
            vendorId,
            createdAt: {
              gte: today
            }
          }
        }),
        prisma.order.aggregate({
          where: {
            vendorId,
            createdAt: {
              gte: new Date(today.getFullYear(), today.getMonth(), 1)
            }
          },
          _sum: {
            totalAmount: true
          }
        }),
        prisma.user.count({
          where: {
            vendorId,
            status: 'active'
          }
        })
      ]);

      return {
        dailyOrders,
        monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
        activeStaff
      };
    } catch (error) {
      logger.error('Get vendor stats error:', error);
      throw new AppError(500, 'Failed to fetch vendor statistics');
    }
  }
};