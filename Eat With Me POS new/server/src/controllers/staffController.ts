import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

const staffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  roleId: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
  joiningDate: z.string().datetime().optional(),
  salary: z.number().optional(),
});

// GET all staff
export async function getStaff(req: Request, res: Response) {
  try {
    const restaurantId = req.params.restaurantId;
    const staff = await prisma.staff.findMany({
      where: { restaurantId },
      include: {
        shifts: true,
        paymentHistory: true,
        performance: true,
      },
    });
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Error fetching staff' });
  }
}

// ADD staff
export async function addStaff(req: Request, res: Response) {
  try {
    const restaurantId = req.params.restaurantId;
    const { name, role, phone, email, pin, salary } = req.body;

    if (!name || !role || !phone || !pin || !salary)
      return res.status(400).json({ message: 'Missing required fields' });

    const existing = await prisma.staff.findFirst({
      where: { OR: [{ phone }, { email }] },
    });
    if (existing)
      return res.status(400).json({ message: 'Staff member already exists' });

    const staff = await prisma.staff.create({
      data: {
        name,
        role,
        phone,
        email,
        pin,
        salary: parseFloat(salary),
        restaurantId,
      },
    });
    res.status(201).json(staff);
  } catch (error) {
    console.error('Error adding staff:', error);
    res.status(500).json({ message: 'Error adding staff' });
  }
}

// UPDATE staff
export async function updateStaff(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const data = req.body;
    const staff = await prisma.staff.update({
      where: { id },
      data,
    });
    res.json(staff);
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ message: 'Error updating staff' });
  }
}

// DELETE staff
export async function deleteStaff(req: Request, res: Response) {
  try {
    const id = req.params.id;
    await prisma.staff.delete({ where: { id } });
    res.json({ message: 'Staff member deleted' });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ message: 'Error deleting staff' });
  }
}

export const staffController = {
  async createStaffMember(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const validatedData = staffSchema.parse(req.body);

      // Hash password if provided
      if (validatedData.password) {
        validatedData.password = await bcrypt.hash(validatedData.password, 10);
      }

      const staff = await prisma.user.create({
        data: {
          ...validatedData,
          vendorId,
        },
        include: {
          role: true,
        },
      });

      // Remove password from response
      delete staff.password;
      res.status(201).json(staff);
    } catch (error) {
      logger.error('Create staff member error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to create staff member' });
      }
    }
  },

  async listStaffMembers(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;

      const staff = await prisma.user.findMany({
        where: { vendorId },
        include: {
          role: true,
          shifts: {
            orderBy: {
              date: 'desc',
            },
            take: 5,
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      // Remove passwords from response
      staff.forEach((member) => delete member.password);
      res.json(staff);
    } catch (error) {
      logger.error('List staff members error:', error);
      res.status(500).json({ message: 'Failed to fetch staff members' });
    }
  },
};
