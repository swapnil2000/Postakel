import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';

const salarySchema = z.object({
  userId: z.string(),
  amount: z.number().min(0),
  month: z.string(),
  year: z.number(),
  bonusAmount: z.number().min(0).optional(),
  deductions: z.number().min(0).optional(),
  comments: z.string().optional()
});

export const salaryController = {
  async createSalaryRecord(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const validatedData = salarySchema.parse(req.body);

      const salary = await prisma.salary.create({
        data: {
          ...validatedData,
          vendorId,
          status: 'pending'
        }
      });

      res.status(201).json(salary);
    } catch (error) {
      logger.error('Create salary record error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create salary record' });
      }
    }
  },

  async getSalaryHistory(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const { userId, year, month } = req.query;

      const salaries = await prisma.salary.findMany({
        where: {
          vendorId,
          userId: userId as string,
          year: year ? parseInt(year as string) : undefined,
          month: month as string
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(salaries);
    } catch (error) {
      logger.error('Get salary history error:', error);
      res.status(500).json({ message: 'Failed to fetch salary history' });
    }
  }
};
