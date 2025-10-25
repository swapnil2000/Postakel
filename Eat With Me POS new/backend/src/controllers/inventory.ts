import { Request, Response } from "express";

// All items
export async function getAllInventoryItems(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const items = await prisma.inventoryItem.findMany();
    console.log('Fetched all inventory items');
    res.json(items);
  } catch (err) {
    console.error('Get all inventory items error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// By ID
export async function getInventoryItemById(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    const item = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) {
      console.log(`Inventory item not found: id=${id}`);
      return res.status(404).json({ error: "Not found" });
    }
    res.json(item);
  } catch (err) {
    console.error('Get inventory item by ID error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create
export async function createInventoryItem(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const data = req.body;
    const item = await prisma.inventoryItem.create({ data });
    console.log(`Inventory item created: ${JSON.stringify(item)}`);
    res.status(201).json(item);
  } catch (err) {
    console.error('Create inventory item error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update
export async function updateInventoryItem(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    const data = req.body;
    const item = await prisma.inventoryItem.update({ where: { id }, data });
    console.log(`Inventory item updated: id=${id}`);
    res.json(item);
  } catch (err) {
    console.error('Update inventory item error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete
export async function deleteInventoryItem(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    await prisma.inventoryItem.delete({ where: { id } });
    console.log(`Inventory item deleted: id=${id}`);
    res.json({ deleted: true });
  } catch (err) {
    console.error('Delete inventory item error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// === Search, Category, Stats, Low Stock, Expiry ===

export async function searchInventory(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { q, category } = req.query;
    const where: any = {
      AND: [
        q ? { name: { contains: q as string, mode: "insensitive" } } : {},
        category ? { category: category as string } : {}
      ]
    };
    const items = await prisma.inventoryItem.findMany({ where });
    console.log(`Searched inventory with query: ${JSON.stringify(req.query)}`);
    res.json(items);
  } catch (err) {
    console.error('Search inventory error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getInventoryCategories(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const categories = await prisma.inventoryItem.findMany({
      distinct: ["category"],
      select: { category: true }
    });
    console.log('Fetched inventory categories');
    res.json(categories.map((c: { category: string }) => c.category));
  } catch (err) {
    console.error('Get inventory categories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getInventoryStats(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const total = await prisma.inventoryItem.count();
    const lowStock = await prisma.inventoryItem.count({
      where: { currentStock: { lte: prisma.inventoryItem.fields.minStock } }
    });
    console.log('Fetched inventory stats');
    res.json({ total, lowStock });
  } catch (err) {
    console.error('Get inventory stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
