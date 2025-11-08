import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllTables(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const tables = await prisma.table.findMany({ orderBy: { name: "asc" } });
    res.json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: "Failed to fetch tables" });
  }
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
  const prisma = (req as any).prisma;
  try {
    const newTable = await prisma.table.create({ data: req.body });
    res.status(201).json(newTable);
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ error: "Failed to create table" });
  }
}

export async function updateTable(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  try {
    const updatedTable = await prisma.table.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedTable);
  } catch (error) {
    console.error(`Error updating table ${id}:`, error);
    res.status(500).json({ error: "Failed to update table" });
  }
}

export async function deleteTable(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  try {
    await prisma.table.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting table ${id}:`, error);
    res.status(500).json({ error: "Failed to delete table" });
  }
}

// STATUS, ASSIGNMENT, AVAILABILITY
export async function getTableStats(req: Request, res: Response) {
  const total = await prisma.table.count();
  const occupied = await prisma.table.count({ where: { status: "occupied" } });
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
      ],
    },
  });
  res.json(tables);
}
