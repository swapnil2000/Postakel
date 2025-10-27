import { Request, Response } from "express";
import { PrismaClient } from '../../prisma/generated/tenant'; 

const prisma = new PrismaClient();

export async function getAllMenuItems(req: Request, res: Response) {
  try {
    const menu = await prisma.menuItem.findMany();
    console.log('Fetched all menu items');
    res.json(menu);
  } catch (err) {
    console.error('Get all menu items error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMenuItemById(req: Request, res: Response) {
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
  try {
    const {
      name,
      price,
      category,
      description,
      available,
      isVeg,
      spiceLevel,
      cookingTime,
      isPopular,
      allergens,
      calories,
      protein,
      carbs,
      fat,
      restaurantId
    } = req.body;

    if (!restaurantId) {
      return res.status(400).json({ error: 'restaurantId is required' });
    }

    const item = await prisma.menuItem.create({
      data: {
        name: 'Chole',
        price: 100,
        category: 'Main Course',
        description: 'Type of curry',
        available: true,
        isVeg: true,
        spiceLevel: 'mild',
        cookingTime: 15,
        isPopular: false,
        allergens: [],
        calories: 10,
        protein: 10,
        carbs: 10,
        fat: 10,
        restaurantId: '8870880' // Use a valid Restaurant ID from your database
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
  try {
    const { id } = req.params;
    const item = await prisma.menuItem.update({ where: { id }, data: req.body });
    console.log(`Menu item updated: id=${id}`);
    res.json(item);
  } catch (err) {
    console.error('Update menu item error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteMenuItem(req: Request, res: Response) {
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

// FILTERS, DIET, POPULAR, SEARCH, SUGGESTIONS

export async function searchMenuItems(req: Request, res: Response) {
  try {
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
    console.log(`Searched menu items with query: ${JSON.stringify(req.query)}`);
    res.json(result);
  } catch (err) {
    console.error('Search menu items error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMenuCategories(req: Request, res: Response) {
  try {
    const categories = await prisma.menuItem.findMany({
      distinct: ['category'],
      select: { category: true }
    });
    console.log('Fetched menu categories');
    res.json(categories.map((c: { category: string }) => c.category));
  } catch (err) {
    console.error('Get menu categories error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// AI/INSIGHTS/RECOMMENDATIONS STUB
export async function getMenuInsights(req: Request, res: Response) {
  try {
    // Replace this with your real AI/ML recommendation logic
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
