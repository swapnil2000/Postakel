import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';

const roleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.array(z.string())
});

export const roleController = {
  async createRole(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const validatedData = roleSchema.parse(req.body);

      const role = await prisma.role.create({
        data: {
          name: validatedData.name,
          description: validatedData.description,
          vendorId,
          permissions: {
            connect: validatedData.permissions.map(id => ({ id }))
          }
        },
        include: {
          permissions: true
        }
      });

      res.status(201).json(role);
    } catch (error) {
      logger.error('Create role error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create role' });
      }
    }
  },

  async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vendorId = req.user?.vendorId;
      const validatedData = roleSchema.parse(req.body);

      const role = await prisma.role.update({
        where: { 
          id_vendorId: {
            id,
            vendorId
          }
        },
        data: {
          name: validatedData.name,
          description: validatedData.description,
          permissions: {
            set: validatedData.permissions.map(id => ({ id }))
          }
        },
        include: {
          permissions: true
        }
      });

      res.json(role);
    } catch (error) {
      logger.error('Update role error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update role' });
      }
    }
  }
};
