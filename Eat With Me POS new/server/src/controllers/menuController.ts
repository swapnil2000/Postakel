import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

const menuItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  category: z.string().min(1),
  description: z.string().optional(),
  available: z.boolean().default(true),
  image: z.string().optional(),
  preparationTime: z.number().min(0).optional(),
  taxCategory: z.string().optional()
});

export const menuController = {
  async createMenuItem(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const validatedData = menuItemSchema.parse(req.body);

      const menuItem = await prisma.menuItem.create({
        data: {
          ...validatedData,
          vendorId
        }
      });

      res.status(201).json(menuItem);
    } catch (error) {
      logger.error('Create menu item error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create menu item' });
      }
    }
  },

  async updateMenuItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vendorId = req.user?.vendorId;
      const validatedData = menuItemSchema.partial().parse(req.body);

      const menuItem = await prisma.menuItem.update({
        where: { 
          id_vendorId: {
            id,
            vendorId
          }
        },
        data: validatedData
      });

      res.json(menuItem);
    } catch (error) {
      logger.error('Update menu item error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update menu item' });
      }
    }
  }
};
