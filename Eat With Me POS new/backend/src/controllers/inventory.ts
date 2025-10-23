import { Request, Response } from "express";

// All items
export async function getAllInventoryItems(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const items = await prisma.inventoryItem.findMany();
  res.json(items);
}

// By ID
export async function getInventoryItemById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const item = await prisma.inventoryItem.findUnique({ where: { id } });
  item ? res.json(item) : res.status(404).json({ error: "Not found" });
}

// Create
export async function createInventoryItem(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const data = req.body;
  const item = await prisma.inventoryItem.create({ data });
  res.status(201).json(item);
}

// Update
export async function updateInventoryItem(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const data = req.body;
  const item = await prisma.inventoryItem.update({ where: { id }, data });
  res.json(item);
}

// Delete
export async function deleteInventoryItem(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  await prisma.inventoryItem.delete({ where: { id } });
  res.json({ deleted: true });
}

// === Search, Category, Stats, Low Stock, Expiry ===

export async function searchInventory(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { q, category } = req.query;
  const where: any = {
    AND: [
      q ? { name: { contains: q as string, mode: "insensitive" } } : {},
      category ? { category: category as string } : {}
    ]
  };
  const items = await prisma.inventoryItem.findMany({ where });
  res.json(items);
}

export async function getInventoryCategories(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const categories = await prisma.inventoryItem.findMany({
    distinct: ["category"],
    select: { category: true }
  });
  res.json(categories.map(c => c.category));
}

export async function getInventoryStats(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const total = await prisma.inventoryItem.count();
  const lowStock = await prisma.inventoryItem.count({
    where: { currentStock: { lte: prisma.inventoryItem.fields.minStock } }
  });
  res.json({ total, lowStock });
}
