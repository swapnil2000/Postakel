import { Request, Response } from "express";

// Get all staff
export async function getAllStaff(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { restaurantId, role } = req.query;
    const where: any = {};
    if (restaurantId) where.restaurantId = restaurantId;
    if (role && role !== "all") where.role = role;
    const staff = await prisma.staff.findMany({ where });
    console.log(`Fetched staff for restaurantId=${restaurantId}, role=${role}`);
    res.json(staff);
  } catch (err) {
    console.error('Get all staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get staff by ID
export async function getStaffById(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) {
      console.log(`Staff not found: id=${id}`);
      return res.status(404).json({ error: "Not found" });
    }
    res.json(staff);
  } catch (err) {
    console.error('Get staff by ID error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create staff
export async function createStaff(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { name, role, phone, email, pin, salary, restaurantId } = req.body;
    const staff = await prisma.staff.create({
      data: { name, role, phone, email, pin, salary: parseFloat(salary), restaurantId }
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
    const prisma = (req as any).prisma;
    const { id } = req.params;
    const data = req.body;
    const staff = await prisma.staff.update({ where: { id }, data });
    console.log(`Staff updated: id=${id}, data=${JSON.stringify(data)}`);
    res.json(staff);
  } catch (err) {
    console.error('Update staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete staff
export async function deleteStaff(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
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
    const prisma = (req as any).prisma;
    const { q, role, restaurantId } = req.query;
    const where: any = {
      ...(restaurantId ? { restaurantId } : {}),
      ...(role && role !== "all" ? { role } : {}),
      ...(q ? { name: { contains: q as string, mode: "insensitive" } } : {})
    };
    const staff = await prisma.staff.findMany({ where });
    console.log(`Searched staff with query: ${JSON.stringify(req.query)}`);
    res.json(staff);
  } catch (err) {
    console.error('Search staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get staff roles
export async function getStaffRoles(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const roles = await prisma.staff.findMany({
      distinct: ["role"],
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
    const prisma = (req as any).prisma;
    const total = await prisma.staff.count();
    const active = await prisma.staff.count({ where: { isActive: true } });
    console.log('Fetched staff stats');
    res.json({ total, active });
  } catch (err) {
    console.error('Get staff stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
