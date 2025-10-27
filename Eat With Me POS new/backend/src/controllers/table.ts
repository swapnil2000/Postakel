import { Request, Response } from "express";
import { PrismaClient } from '../../prisma/generated/tenant';

const prisma = new PrismaClient();

export async function getAllTables(req: Request, res: Response) {
  const tables = await prisma.table.findMany();
  res.json(tables);
}

export async function getTableById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const table = await prisma.table.findUnique({ where: { id } });
    if (!table) {
      return res.status(404).json({ error: "Table not found" });
    }
    res.json(table);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
}

export async function createTable(req: Request, res: Response) {
  const { number, status, capacity } = req.body;
  try {
    if (number === undefined || status === undefined || capacity === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const table = await prisma.table.create({
      data: { number, status, capacity }
    });
    res.json(table);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
}

export async function updateTable(req: Request, res: Response) {
  const { id } = req.params;
  const data = req.body;
  const table = await prisma.table.update({ where: { id }, data });
  res.json(table);
}

export async function deleteTable(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.table.delete({ where: { id } });
  res.json({ deleted: true });
}

// STATUS, ASSIGNMENT, AVAILABILITY
export async function getTableStats(req: Request, res: Response) {
  const total = await prisma.table.count();
  const occupied = await prisma.table.count({ where: { status: 'occupied' } });
  const available = total - occupied;
  res.json({ total, occupied, available });
}

export async function searchTables(req: Request, res: Response) {
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
