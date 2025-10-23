import { Request, Response } from "express";

export async function getAllTables(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const tables = await prisma.table.findMany();
  res.json(tables);
}

export async function getTableById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const table = await prisma.table.findUnique({ where: { id } });
  if (table) {
    res.json(table);
  } else {
    res.status(404).json({ error: "Table not found" });
  }
}

export async function createTable(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { number, status, capacity } = req.body;
  const table = await prisma.table.create({ data: { number, status, capacity } });
  res.status(201).json(table);
}

export async function updateTable(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const data = req.body;
  const table = await prisma.table.update({ where: { id }, data });
  res.json(table);
}

export async function deleteTable(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  await prisma.table.delete({ where: { id } });
  res.json({ deleted: true });
}

// STATUS, ASSIGNMENT, AVAILABILITY
export async function getTableStats(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const total = await prisma.table.count();
  const occupied = await prisma.table.count({ where: { status: 'occupied' } });
  const available = total - occupied;
  res.json({ total, occupied, available });
}

export async function searchTables(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { number, status, capacity } = req.query;
  const tables = await prisma.table.findMany({
    where: {
      AND: [
        number ? { number: Number(number) } : {},
        status ? { status: status as string } : {},
        capacity ? { capacity: Number(capacity) } : {},
      ]
    }
  });
  res.json(tables);
}
