import { Request, Response } from "express";

/**
 * Inventory controller - uses prisma instance attached by tenant middleware:
 * const prisma = (req as any).prisma;
 *
 * Exposes:
 * - getAllInventoryItems (GET /inventory)
 * - getInventoryItemById (GET /inventory/:id)
 * - createInventoryItem (POST /inventory)
 * - updateInventoryItem (PUT /inventory/:id)
 * - deleteInventoryItem (DELETE /inventory/:id)
 * - getInventoryCategories (GET /inventory/categories)
 * - getInventoryStats (GET /inventory/stats)
 * - createPurchaseEntry (POST /inventory/purchases)
 * - getPurchaseEntries (GET /inventory/purchases)
 */

export async function getAllInventoryItems(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const items = await prisma.inventoryItem.findMany({
      include: { supplier: true }
    });
    return res.json(items);
  } catch (err) {
    console.error('[Inventory] Get all inventory items error:', err);
    return res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
}

export async function getInventoryItemById(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { supplier: true }
    });
    if (!item) return res.status(404).json({ error: 'Inventory item not found' });
    return res.json(item);
  } catch (err) {
    console.error('[Inventory] Get item by id error:', err);
    return res.status(500).json({ error: 'Failed to fetch inventory item' });
  }
}

export async function createInventoryItem(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const body = req.body;

    const data = {
      name: body.name,
      category: body.category,
      unit: body.unit,
      currentStock: Number(body.currentStock || 0),
      minStock: Number(body.minStock || 0),
      maxStock: Number(body.maxStock || 0),
      costPerUnit: Number(body.costPerUnit || 0),
      supplierId: body.supplierId || null,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
      lastPurchase: body.lastPurchase ? new Date(body.lastPurchase) : null
    };

    const created = await prisma.inventoryItem.create({ data });
    return res.status(201).json(created);
  } catch (err) {
    console.error('[Inventory] Create item error:', err);
    return res.status(500).json({ error: 'Failed to create inventory item' });
  }
}

export async function updateInventoryItem(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    const body = req.body;

    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.category !== undefined) data.category = body.category;
    if (body.unit !== undefined) data.unit = body.unit;
    if (body.currentStock !== undefined) data.currentStock = Number(body.currentStock);
    if (body.minStock !== undefined) data.minStock = Number(body.minStock);
    if (body.maxStock !== undefined) data.maxStock = Number(body.maxStock);
    if (body.costPerUnit !== undefined) data.costPerUnit = Number(body.costPerUnit);
    if (body.supplierId !== undefined) data.supplierId = body.supplierId;
    if (body.expiryDate !== undefined) data.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
    if (body.lastPurchase !== undefined) data.lastPurchase = body.lastPurchase ? new Date(body.lastPurchase) : null;

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data
    });
    return res.json(updated);
  } catch (err) {
    console.error('[Inventory] Update item error:', err);
    return res.status(500).json({ error: 'Failed to update inventory item' });
  }
}

export async function deleteInventoryItem(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    await prisma.inventoryItem.delete({ where: { id } });
    return res.json({ deleted: true });
  } catch (err) {
    console.error('[Inventory] Delete item error:', err);
    return res.status(500).json({ error: 'Failed to delete inventory item' });
  }
}

export async function getInventoryCategories(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const categories = await prisma.inventoryItem.findMany({
      distinct: ['category'],
      select: { category: true }
    });
    return res.json(categories.map((c: any) => c.category));
  } catch (err) {
    console.error('[Inventory] Get categories error:', err);
    return res.status(500).json({ error: 'Failed to get categories' });
  }
}

export async function getInventoryStats(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const items = await prisma.inventoryItem.findMany();

    const toNumber = (v: any) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    const isExpiringSoon = (expiryDate?: Date | string | null) => {
      if (!expiryDate) return false;
      const expiry = new Date(expiryDate);
      if (isNaN(expiry.getTime())) return false;
      const today = new Date();
      const days = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return days <= 7 && days >= 0;
    };

    const total = Array.isArray(items) ? items.length : 0;
    const lowStock = (items || []).reduce((count: number, item: any) => {
      if (!item) return count;
      const current = toNumber(item.currentStock);
      const min = toNumber(item.minStock);
      return current <= min ? count + 1 : count;
    }, 0);

    const expiringSoon = (items || []).reduce((count: number, item: any) => {
      if (!item) return count;
      return isExpiringSoon(item.expiryDate) ? count + 1 : count;
    }, 0);

    const totalValue = (items || []).reduce((sum: number, item: any) => {
      if (!item) return sum;
      return sum + toNumber(item.currentStock) * toNumber(item.costPerUnit);
    }, 0);

    return res.json({ total, lowStock, expiringSoon, totalValue });
  } catch (err) {
    console.error('[Inventory] Get inventory stats error:', err);
    return res.status(500).json({ error: 'Failed to get inventory stats' });
  }
}

/**
 * Purchase entries - record a purchase and update inventory stock & lastPurchase
 * POST /inventory/purchases
 * body: { supplierId?, invoiceNumber?, date?, items: [{ inventoryItemId, quantity, unitPrice }] , notes? }
 */
export async function createPurchaseEntry(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const body = req.body;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ error: 'Purchase items required' });
    }

    // compute totals
    const totalAmount = body.items.reduce((s: number, it: any) => s + (Number(it.quantity || 0) * Number(it.unitPrice || 0)), 0);

    // create purchase and items in a transaction
    const created = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          supplierId: body.supplierId || null,
          invoiceNumber: body.invoiceNumber || null,
          date: body.date ? new Date(body.date) : new Date(),
          totalAmount,
          notes: body.notes || null
        }
      });

      for (const it of body.items) {
        const qty = Number(it.quantity || 0);
        const unitPrice = Number(it.unitPrice || 0);
        const totalPrice = qty * unitPrice;

        // create purchase item
        await tx.purchaseItem.create({
          data: {
            purchaseId: purchase.id,
            inventoryItemId: it.inventoryItemId,
            quantity: qty,
            unitPrice,
            totalPrice
          }
        });

        // update inventory stock and lastPurchase
        await tx.inventoryItem.update({
          where: { id: it.inventoryItemId },
          data: {
            currentStock: { increment: qty },
            lastPurchase: new Date()
          }
        });
      }

      return purchase;
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error('[Inventory] Create purchase entry error:', err);
    return res.status(500).json({ error: 'Failed to create purchase entry' });
  }
}

export async function getPurchaseEntries(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const purchases = await prisma.purchase.findMany({
      include: {
        supplier: true,
        items: {
          include: { inventoryItem: true }
        }
      },
      orderBy: { date: 'desc' }
    });
    return res.json(purchases);
  } catch (err) {
    console.error('[Inventory] Get purchases error:', err);
    return res.status(500).json({ error: 'Failed to get purchase entries' });
  }
}
