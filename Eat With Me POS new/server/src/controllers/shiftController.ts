import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';

const shiftSchema = z.object({
  userId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  type: z.enum(['morning', 'evening', 'night']),
  notes: z.string().optional(),
});

export const shiftController = {
  async createShift(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const validatedData = shiftSchema.parse(req.body);

      const shift = await prisma.shift.create({
        data: {
          ...validatedData,
          vendorId,
        },
      });

      res.status(201).json(shift);
    } catch (error) {
      logger.error('Create shift error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create shift' });
      }
    }
  },

  async updateShift(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vendorId = req.user?.vendorId;
      const validatedData = shiftSchema.partial().parse(req.body);

      const shift = await prisma.shift.update({
        where: {
          id_vendorId: {
            id,
            vendorId,
          },
        },
        data: validatedData,
      });

      res.json(shift);
    } catch (error) {
      logger.error('Update shift error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update shift' });
      }
    }
  },

  async getShiftSchedule(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const { startDate, endDate } = req.query;

      const shifts = await prisma.shift.findMany({
        where: {
          vendorId,
          date: {
            gte: startDate as string,
            lte: endDate as string,
          },
        },
        include: {
          user: {
            select: {
              name: true,
              role: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
      });

      res.json(shifts);
    } catch (error) {
      logger.error('Get shift schedule error:', error);
      res.status(500).json({ message: 'Failed to fetch shift schedule' });
    }
  },
};
