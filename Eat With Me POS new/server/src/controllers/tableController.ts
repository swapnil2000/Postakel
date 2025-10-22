import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fetch all tables for a restaurant
export async function getTables(req: Request, res: Response) {
  try {
    const restaurantId = req.params.restaurantId;
    const tables = await prisma.table.findMany({
      where: { restaurantId },
      orderBy: { tableNumber: 'asc' },
    });
    res.json(tables);
  } catch (error) {
    console.error('Fetch tables error:', error);
    res.status(500).json({ message: 'Could not fetch tables' });
  }
}

// Add a new table
export async function addTable(req: Request, res: Response) {
  try {
    const restaurantId = req.params.restaurantId;
    const newTable = req.body;

    // Check if tableNumber already exists for restaurant
    const existingTable = await prisma.table.findFirst({
      where: { tableNumber: newTable.number, restaurantId },
    });

    if (existingTable) {
      return res.status(400).json({ message: 'Table number already exists' });
    }

    const createdTable = await prisma.table.create({
      data: {
        tableNumber: newTable.number,
        capacity: newTable.capacity,
        status: newTable.status || 'AVAILABLE',
        waiter: newTable.waiter ?? null,
        customer: newTable.customer ?? null,
        orderAmount: newTable.orderAmount ?? 0,
        timeOccupied: newTable.timeOccupied ?? null,
        guests: newTable.guests ?? 0,
        restaurantId,
      },
    });

    res.status(201).json(createdTable);
  } catch (error) {
    console.error('Add table error:', error);
    res.status(500).json({ message: 'Failed to add table' });
  }
}

// Update a table by ID
export async function updateTable(req: Request, res: Response) {
  try {
    const tableId = req.params.id;
    const data = req.body;

    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: data,
    });

    res.json(updatedTable);
  } catch (error) {
    console.error('Update table error:', error);
    res.status(500).json({ message: 'Failed to update table' });
  }
}

// Delete a table by ID
export async function deleteTable(req: Request, res: Response) {
  try {
    const tableId = req.params.id;

    await prisma.table.delete({ where: { id: tableId } });

    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Delete table error:', error);
    res.status(500).json({ message: 'Failed to delete table' });
  }
}
