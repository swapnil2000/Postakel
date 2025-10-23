import { Request, Response } from "express";

// Unified for menu, expense, inventory, supplier: get all categories by type
export async function getCategories(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { type } = req.query; // 'menu','expense','inventory','supplier'
  let categories: string[] = [];
  switch (type) {
    case "menu":
      categories = (await prisma.menuItem.findMany({
        distinct: ["category"], select: { category: true }
      })).map(c => c.category);
      break;
    case "expense":
      categories = (await prisma.expense.findMany({
        distinct: ["category"], select: { category: true }
      })).map(c => c.category);
      break;
    case "inventory":
      categories = (await prisma.inventoryItem.findMany({
        distinct: ["category"], select: { category: true }
      })).map(c => c.category);
      break;
    case "supplier":
      categories = (await prisma.supplier.findMany({
        distinct: ["category"], select: { category: true }
      })).map(c => c.category);
      break;
    default:
      return res.status(400).json({ error: "Missing or invalid type" });
  }
  res.json(categories);
}
