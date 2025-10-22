import { prisma } from '../prisma';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';
import { redisClient } from '../utils/redisClient';
import { config } from '../config';

export const tableService = {
  async getAllTables(vendorId: string) {
    try {
      // Try Redis cache first if enabled
      if (config.redis.enabled) {
        const cachedTables = await redisClient.get(`tables:${vendorId}`);
        if (cachedTables) {
          return JSON.parse(cachedTables);
        }
      }

      const tables = await prisma.table.findMany({
        where: { vendorId },
        include: {
          currentOrder: true
        }
      });

      // Cache results if Redis is enabled
      if (config.redis.enabled) {
        await redisClient.setEx(
          `tables:${vendorId}`,
          300, // 5 minutes cache
          JSON.stringify(tables)
        );
      }

      return tables;
    } catch (error) {
      logger.error('Get all tables error:', error);
      throw new AppError(500, 'Failed to fetch tables');
    }
  },

  async updateTableStatus(
    vendorId: string,
    tableNumber: number,
    status: 'free' | 'occupied' | 'reserved'
  ) {
    try {
      const table = await prisma.table.update({
        where: {
          vendorId_number: {
            vendorId,
            number: tableNumber
          }
        },
        data: { status }
      });

      // Invalidate cache
      if (config.redis.enabled) {
        await redisClient.del(`tables:${vendorId}`);
      }

      return table;
    } catch (error) {
      logger.error('Update table status error:', error);
      throw new AppError(500, 'Failed to update table status');
    }
  },

  async assignCustomerToTable(
    vendorId: string,
    tableNumber: number,
    customerName: string
  ) {
    try {
      const table = await prisma.table.update({
        where: {
          vendorId_number: {
            vendorId,
            number: tableNumber
          }
        },
        data: {
          status: 'occupied',
          customer: customerName
        }
      });

      // Invalidate cache
      if (config.redis.enabled) {
        await redisClient.del(`tables:${vendorId}`);
      }

      return table;
    } catch (error) {
      logger.error('Assign customer to table error:', error);
      throw new AppError(500, 'Failed to assign customer to table');
    }
  }
};
