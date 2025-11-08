import { Request, Response } from "express";
import { Staff, Role } from "@prisma/client";

// Get all staff
export async function getAllStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const { role } = req.query;
    const where: any = {};
    // FIX: Filter by the related role's name
    if (role && role !== "all") {
      where.role = { name: role as string };
    }

    const staff = await prisma.staff.findMany({
      where,
      // FIX: Include the full Role object in the query result
      include: { role: true },
      orderBy: { name: 'asc' },
    });

    if (!staff || staff.length === 0) {
      return res.json({ staff: [], totalStaff: 0 });
    }

    // FIX: Map the result to return the role's name as a simple string
    const staffWithRoleName = staff.map((s: Staff & { role: Role }) => ({
      ...s,
      role: s.role.name,
    }));

    res.json({ staff: staffWithRoleName, totalStaff: staff.length });
  } catch (err) {
    console.error('Get all staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get staff by ID
export async function getStaffById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const { id } = req.params;
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!staff) {
      return res.status(404).json({ error: "Staff not found" });
    }
    // FIX: Return the role's name from the included object
    res.json({ ...staff, role: staff.role.name });
  } catch (err) {
    console.error('Get staff by ID error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create staff
export async function createStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const { roleId, ...staffData } = req.body;
    const newStaff = await prisma.staff.create({
      data: { ...staffData, role: { connect: { id: roleId } } },
      include: { role: true },
    });
    res.status(201).json({ ...newStaff, role: newStaff.role.name });
  } catch (err) {
    console.error('Create staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update staff
export async function updateStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const { id } = req.params;
    const { roleName, ...updateData } = req.body;

    // FIX: If a roleName is provided, find its ID and add it to the update data
    if (roleName) {
      const role = await prisma.role.findUnique({ where: { name: roleName } });
      if (!role) {
        return res.status(400).json({ message: `Role '${roleName}' does not exist.` });
      }
      updateData.roleId = role.id;
    }

    const staff = await prisma.staff.update({
      where: { id },
      data: updateData,
      include: { role: true },
    });
    res.json({ ...staff, role: staff.role.name });
  } catch (err) {
    console.error('Update staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete staff
export async function deleteStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id } });
    res.json({ deleted: true });
  } catch (err) {
    console.error('Delete staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Search staff
export async function searchStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const { q, role } = req.query;
    const result = await prisma.staff.findMany({
      where: {
        AND: [
          q ? { name: { contains: q as string, mode: "insensitive" } } : {},
          // FIX: Filter by the related role's name
          role && role !== "all" ? { role: { name: { equals: role as string } } } : {}
        ]
      },
      include: { role: true },
    });
    
    const staffWithRoleName = result.map((s: Staff & { role: Role }) => ({
      ...s,
      role: s.role.name,
    }));

    res.json(staffWithRoleName);
  } catch (err) {
    console.error('Search staff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all available roles
export async function getStaffRoles(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    // FIX: Query the Role table directly, as this is the source of truth for roles
    const roles = await prisma.role.findMany({
      select: { name: true }
    });
    res.json(roles.map((r: { name: string }) => r.name));
  } catch (err) {
    console.error('Get staff roles error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get staff stats
export async function getStaffStats(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const totalStaff = await prisma.staff.count();
    res.json({ totalStaff });
  } catch (err) {
    console.error('Get staff stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
