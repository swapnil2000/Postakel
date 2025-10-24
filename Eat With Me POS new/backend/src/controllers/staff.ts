import { Request, Response } from "express";

// Use (req as any).prisma everywhere, and do NOT import PrismaClient here
export async function getAllStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { restaurantId, role } = req.query;role)
  const where: any = {};tAllStaff(req: Request, res: Response) {
  if (restaurantId) where.restaurantId = restaurantId;
  if (role && role !== "all") where.role = role;
  const staff = await prisma.staff.findMany({ where });
  res.json(staff); !== "all") where.role = role;
} const staff = await prisma.staff.findMany({ where });
  res.json(staff);
// By ID
export async function getStaffById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;ffById(req: Request, res: Response) {
  const s = await prisma.staff.findUnique({ where: { id } });
  s ? res.json(s) : res.status(404).json({ error: "Not found" });
} s ? res.json(s) : res.status(404).json({ error: "Not found" });
}
// Create
export async function createStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;: Request, res: Response) {
  const { name, role, phone, email, pin, salary, restaurantId } = req.body;
  const staff = await prisma.staff.create({
    data: { name, role, phone, email, pin, salary, restaurantId }
  });
  res.status(201).json(staff);
}

// Update
export async function updateStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const data = req.body; is not lost on update
  // Ensure restaurantId is not lost on updateere: { id }, data });
  const staff = await prisma.staff.update({ where: { id }, data });
  res.json(staff);
}
// Delete
// Deleteync function deleteStaff(req: Request, res: Response) {
export async function deleteStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;{ id } });
  const { id } = req.params;);
  await prisma.staff.delete({ where: { id } });
  res.json({ deleted: true });
}/ === Filter/Search, Stats, Roles ===

// === Filter/Search, Stats, Roles === Request, res: Response) {
  const { q, role } = req.query;
export async function searchStaff(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { q, role } = req.query;as string, mode: "insensitive" } } : {},
  const where: any = {ole as string } : {}
    AND: [
      q ? { name: { contains: q as string, mode: "insensitive" } } : {},
      role ? { role: role as string } : {}y({ where });
    ].json(staff);
  };
  const staff = await prisma.staff.findMany({ where });
  res.json(staff);ion getStaffRoles(req: Request, res: Response) {
} const roles = await prisma.staff.findMany({
    distinct: ["role"],
export async function getStaffRoles(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const roles = await prisma.staff.findMany({
    distinct: ["role"],
    select: { role: true }
  });t async function getStaffStats(req: Request, res: Response) {
  res.json(roles.map(r => r.role));count();
} const active = await prisma.staff.count({ where: { isActive: true } });
  res.json({ total, active });
export async function getStaffStats(req: Request, res: Response) {
  const prisma = (req as any).prisma;  const total = await prisma.staff.count();  const active = await prisma.staff.count({ where: { isActive: true } });  res.json({ total, active });}