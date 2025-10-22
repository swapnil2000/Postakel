import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';

const permissionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  module: z.enum(['orders', 'menu', 'staff', 'reports', 'settings'])
});

export const permissionController = {
  async createPermission(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const validatedData = permissionSchema.parse(req.body);

      const permission = await prisma.permission.create({
        data: {
          ...validatedData,
          vendorId
        }
      });

      res.status(201).json(permission);
    } catch (error) {
      logger.error('Create permission error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create permission' });
      }
    }
  },

  async listPermissions(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const { module } = req.query;

      const permissions = await prisma.permission.findMany({
        where: {
          vendorId,
          module: module as string
        },
        orderBy: {
          name: 'asc'
        }
      });

      res.json(permissions);
    } catch (error) {
      logger.error('List permissions error:', error);
      res.status(500).json({ message: 'Failed to fetch permissions' });
    }
  }
};
