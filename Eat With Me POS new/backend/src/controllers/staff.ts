import { Request, Response } from "express";

// All staff
export async function getAllStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const staff = await prisma.staff.findMany();
  res.json(staff);
}

// By ID
export async function getStaffById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const s = await prisma.staff.findUnique({ where: { id } });
  s ? res.json(s) : res.status(404).json({ error: "Not found" });
}

// Create
export async function createStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { name, role, phone, email, pin, salary } = req.body;
  const staff = await prisma.staff.create({
    data: { name, role, phone, email, pin, salary }
  });
  res.status(201).json(staff);
}

// Update
export async function updateStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const data = req.body;
  const staff = await prisma.staff.update({ where: { id }, data });
  res.json(staff);
}

// Delete
export async function deleteStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  await prisma.staff.delete({ where: { id } });
  res.json({ deleted: true });
}

// === Filter/Search, Stats, Roles ===

export async function searchStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { q, role } = req.query;
  const where: any = {
    AND: [
      q ? { name: { contains: q as string, mode: "insensitive" } } : {},
      role ? { role: role as string } : {}
    ]
  };
  const staff = await prisma.staff.findMany({ where });
  res.json(staff);
}

export async function getStaffRoles(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const roles = await prisma.staff.findMany({
    distinct: ["role"],
    select: { role: true }
  });
  res.json(roles.map(r => r.role));
}

export async function getStaffStats(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const total = await prisma.staff.count();
  const active = await prisma.staff.count({ where: { isActive: true } });
  res.json({ total, active });
}
