import { Request, Response } from "express";

export async function getAllMenuItems(req: Request, res: Response) {
  // FIX: Use the tenant-specific prisma client from the request
  const prisma = (req as any).prisma;
  try {
    const menu = await prisma.menuItem.findMany({
      orderBy: { category: 'asc' }
    });
    console.log('Fetched all menu items for tenant.');
    res.json(menu);
  } catch (err) {
    console.error('Get all menu items error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMenuItemById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const { id } = req.params;
    const menuItem = await prisma.menuItem.findUnique({ where: { id } });
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: errorMessage });
  }
}

export async function createMenuItem(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const {
      name, price, category, description, available, isVeg, spiceLevel,
      cookingTime, isPopular, allergens, calories, protein, carbs, fat
    } = req.body;

    // Find the category by name to get its ID
    const categoryRecord = await prisma.category.findFirst({ where: { name: category } });
    if (!categoryRecord) {
      return res.status(400).json({ error: `Category '${category}' not found.` });
    }

    const item = await prisma.menuItem.create({
      data: {
        name, price, description, available, isVeg, spiceLevel, cookingTime,
        isPopular, allergens, calories, protein, carbs, fat,
        // FIX: Connect to the category using its ID
        category: { connect: { id: categoryRecord.id } }
      }
    });
    console.log(`Menu item created: ${JSON.stringify(item)}`);
    res.status(201).json(item);
  } catch (err) {
    console.error('Create menu item error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateMenuItem(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const { id } = req.params;
    const { category, ...data } = req.body;

    if (category) {
        const categoryRecord = await prisma.category.findFirst({ where: { name: category } });
        if (categoryRecord) {
            data.categoryId = categoryRecord.id;
        }
    }

    const item = await prisma.menuItem.update({ where: { id }, data });
    console.log(`Menu item updated: id=${id}`);
    res.json(item);
  } catch (err) {
    console.error('Update menu item error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteMenuItem(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const { id } = req.params;
    await prisma.menuItem.delete({ where: { id } });
    console.log(`Menu item deleted: id=${id}`);
    res.json({ deleted: true });
  } catch (err) {
    console.error('Delete menu item error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function searchMenuItems(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const { q, category, isVeg, isPopular } = req.query;
    const result = await prisma.menuItem.findMany({
      where: {
        AND: [
          q ? { name: { contains: q as string, mode: "insensitive" } } : {},
          // FIX: Filter by the related category's name
          category ? { category: { name: { equals: category as string } } } : {},
          isVeg !== undefined ? { isVeg: isVeg === "true" } : {},
          isPopular !== undefined ? { isPopular: isPopular === "true" } : {}
        ]
      },
      // FIX: Include the category name in the result
      include: { category: true }
    });
    console.log(`Searched menu items with query: ${JSON.stringify(req.query)}`);
    res.json(result);
  } catch (err) {
    console.error('Search menu items error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// This function is now obsolete as you have a dedicated /api/categories endpoint
// export async function getMenuCategories(req: Request, res: Response) { ... }

// AI/INSIGHTS/RECOMMENDATIONS STUB
export async function getMenuInsights(req: Request, res: Response) {
  try {
    console.log('Fetched menu insights');
    res.json({
      topSellers: ['Paneer Tikka', 'Burger', 'Pizza'],
      recommended: ['Sizzling Brownie', 'Grilled Fish'],
      lowPerformers: ['Garlic Soup']
    });
  } catch (err) {
    console.error('Get menu insights error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
