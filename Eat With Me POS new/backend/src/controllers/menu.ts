import { Request, Response } from "express";

export async function getAllMenuItems(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const menu = await prisma.menuItem.findMany();
  res.json(menu);
}

export async function getMenuItemById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const menuItem = await prisma.menuItem.findUnique({ where: { id } });
  menuItem ? res.json(menuItem) : res.status(404).json({ error: "Not found" });
}

export async function createMenuItem(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const item = await prisma.menuItem.create({ data: req.body });
  res.status(201).json(item);
}

export async function updateMenuItem(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const item = await prisma.menuItem.update({ where: { id }, data: req.body });
  res.json(item);
}

export async function deleteMenuItem(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  await prisma.menuItem.delete({ where: { id } });
  res.json({ deleted: true });
}

// FILTERS, DIET, POPULAR, SEARCH, SUGGESTIONS

export async function searchMenuItems(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { q, category, isVeg, isPopular } = req.query;
  const result = await prisma.menuItem.findMany({
    where: {
      AND: [
        q ? { name: { contains: q as string, mode: "insensitive" } } : {},
        category ? { category: { equals: category as string } } : {},
        isVeg !== undefined ? { isVeg: isVeg === "true" } : {},
        isPopular !== undefined ? { isPopular: isPopular === "true" } : {}
      ]
    }
  });
  res.json(result);
}

export async function getMenuCategories(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const categories = await prisma.menuItem.findMany({
    distinct: ['category'],
    select: { category: true }
  });
  res.json(categories.map(c => c.category));
}

// AI/INSIGHTS/RECOMMENDATIONS STUB
export async function getMenuInsights(req: Request, res: Response) {
  // Replace this with your real AI/ML recommendation logic
  res.json({
    topSellers: ['Paneer Tikka', 'Burger', 'Pizza'],
    recommended: ['Sizzling Brownie', 'Grilled Fish'],
    lowPerformers: ['Garlic Soup']
  });
}
