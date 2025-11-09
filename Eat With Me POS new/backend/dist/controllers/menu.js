"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllMenuItems = getAllMenuItems;
exports.getMenuItemById = getMenuItemById;
exports.createMenuItem = createMenuItem;
exports.updateMenuItem = updateMenuItem;
exports.deleteMenuItem = deleteMenuItem;
exports.searchMenuItems = searchMenuItems;
exports.getMenuInsights = getMenuInsights;
async function getAllMenuItems(req, res) {
    // FIX: Use the tenant-specific prisma client from the request
    const prisma = req.prisma;
    try {
        const menu = await prisma.menuItem.findMany({
            orderBy: { category: 'asc' }
        });
        console.log('Fetched all menu items for tenant.');
        res.json(menu);
    }
    catch (err) {
        console.error('Get all menu items error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function getMenuItemById(req, res) {
    const prisma = req.prisma;
    try {
        const { id } = req.params;
        const menuItem = await prisma.menuItem.findUnique({ where: { id } });
        if (!menuItem) {
            return res.status(404).json({ error: "Menu item not found" });
        }
        res.json(menuItem);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: errorMessage });
    }
}
async function createMenuItem(req, res) {
    const prisma = req.prisma;
    try {
        const { name, price, category, description, available, isVeg, spiceLevel, cookingTime, isPopular, allergens, calories, protein, carbs, fat } = req.body;
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
    }
    catch (err) {
        console.error('Create menu item error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function updateMenuItem(req, res) {
    const prisma = req.prisma;
    try {
        const { id } = req.params;
        const _a = req.body, { category } = _a, data = __rest(_a, ["category"]);
        if (category) {
            const categoryRecord = await prisma.category.findFirst({ where: { name: category } });
            if (categoryRecord) {
                data.categoryId = categoryRecord.id;
            }
        }
        const item = await prisma.menuItem.update({ where: { id }, data });
        console.log(`Menu item updated: id=${id}`);
        res.json(item);
    }
    catch (err) {
        console.error('Update menu item error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function deleteMenuItem(req, res) {
    const prisma = req.prisma;
    try {
        const { id } = req.params;
        await prisma.menuItem.delete({ where: { id } });
        console.log(`Menu item deleted: id=${id}`);
        res.json({ deleted: true });
    }
    catch (err) {
        console.error('Delete menu item error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function searchMenuItems(req, res) {
    const prisma = req.prisma;
    try {
        const { q, category, isVeg, isPopular } = req.query;
        const result = await prisma.menuItem.findMany({
            where: {
                AND: [
                    q ? { name: { contains: q, mode: "insensitive" } } : {},
                    // FIX: Filter by the related category's name
                    category ? { category: { name: { equals: category } } } : {},
                    isVeg !== undefined ? { isVeg: isVeg === "true" } : {},
                    isPopular !== undefined ? { isPopular: isPopular === "true" } : {}
                ]
            },
            // FIX: Include the category name in the result
            include: { category: true }
        });
        console.log(`Searched menu items with query: ${JSON.stringify(req.query)}`);
        res.json(result);
    }
    catch (err) {
        console.error('Search menu items error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// This function is now obsolete as you have a dedicated /api/categories endpoint
// export async function getMenuCategories(req: Request, res: Response) { ... }
// AI/INSIGHTS/RECOMMENDATIONS STUB
async function getMenuInsights(req, res) {
    try {
        console.log('Fetched menu insights');
        res.json({
            topSellers: ['Paneer Tikka', 'Burger', 'Pizza'],
            recommended: ['Sizzling Brownie', 'Grilled Fish'],
            lowPerformers: ['Garlic Soup']
        });
    }
    catch (err) {
        console.error('Get menu insights error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
//# sourceMappingURL=menu.js.map