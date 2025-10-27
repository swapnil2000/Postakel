import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all staff
export async function getAllStaff(req: Request, res: Response) {
  try {
    const { role } = req.query;
    const where: any = {};
    // REMOVED: if (restaurantId) where.restaurantId = restaurantId;
    if (role && role !== "all") where.role = role;
    const staff = await prisma.staff.findMany({ where });

    if (!staff || staff.length === 0) {
      console.log('No staff found');
      return res.json({ staff: [], totalStaff: 0 });
    }

    console.log(`Fetched ${staff.length} staff`);
    res.json({ staff, totalStaff: staff.length });
  } catch (err) {
    console.error('Get all staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get staff by ID
export async function getStaffById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) {
      console.log(`Staff not found: id=${id}`);
      return res.status(404).json({ error: "Staff not found" });
    }
    console.log(`Fetched staff: id=${id}`);
    res.json(staff);
  } catch (err) {
    console.error('Get staff by ID error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create staff
export async function createStaff(req: Request, res: Response) {
  try {
    const { name, role, phone, email, pin, salary, isActive, joinDate } = req.body;
    console.log('Create staff request:', req.body);

    // Basic validation
    if (!name || !role || !phone || !pin || !salary) {
      console.log('Validation failed for staff creation');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert salary to number
    const numericSalary = typeof salary === 'string' ? parseFloat(salary) : salary;

    const staff = await prisma.staff.create({
      data: { name, role, phone, email, pin, salary: numericSalary, isActive, joinDate }
      // REMOVE restaurantId if not in schema
    });
    console.log(`Staff created: ${JSON.stringify(staff)}`);
    res.status(201).json(staff);
  } catch (err) {
    console.error('Create staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update staff
export async function updateStaff(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Staff not found" });
    }
    const staff = await prisma.staff.update({
      where: { id },
      data: req.body,
    });
    res.json(staff);
  } catch (err) {
    console.error('Update staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete staff
export async function deleteStaff(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id } });
    console.log(`Staff deleted: id=${id}`);
    res.json({ deleted: true });
  } catch (err) {
    console.error('Delete staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Search staff
export async function searchStaff(req: Request, res: Response) {
  try {
    const { q, role } = req.query;
    const result = await prisma.staff.findMany({
      where: {
        AND: [
          q ? { name: { contains: q as string, mode: "insensitive" } } : {},
          role && role !== "all" ? { role: { equals: role as string } } : {}
        ]
      }
    });
    console.log(`Searched staff with query: ${JSON.stringify(req.query)}`);
    res.json(result);
  } catch (err) {
    console.error('Search staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get staff roles
export async function getStaffRoles(req: Request, res: Response) {
  try {
    const roles = await prisma.staff.findMany({
      distinct: ['role'],
      select: { role: true }
    });
    console.log('Fetched staff roles');
    res.json(roles.map((r: { role: string }) => r.role));
  } catch (err) {
    console.error('Get staff roles error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get staff stats
export async function getStaffStats(req: Request, res: Response) {
  try {
    const totalStaff = await prisma.staff.count();
    console.log(`Fetched staff stats: totalStaff=${totalStaff}`);
    res.json({ totalStaff });
  } catch (err) {
    console.error('Get staff stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
