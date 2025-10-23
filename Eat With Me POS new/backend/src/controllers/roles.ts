import { Request, Response } from "express";

export async function getAllRoles(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  // If using a Role model, use findMany()
  const roles = [
    "Manager",
    "Cashier",
    "Waiter",
    "Chef",
    "Kitchen Staff",
    "Helper",
    "Owner",
    "Admin"
  ]; // example list, can fetch from database if using a roles table
  res.json(roles);
}
