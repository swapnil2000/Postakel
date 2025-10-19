import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { tableService } from '../services/tableService';

export async function getAllTables(req: AuthRequest, res: Response) {
	try {
		const { restaurantId } = req.body;
		const tables = await tableService.getAllTables(restaurantId);
		res.json(tables);
	} catch (err) {
		console.error('Error Fetching tables:', err);
		res.status(500).json({ message: 'Failed to fetch tables' });
	}
}

export async function createTable(req: AuthRequest, res: Response) {
	try {
		const { restaurantId, tableNumber, capacity } = req.body;
		const newTable = await tableService.createTable({
			restaurantId,
			tableNumber,
			capacity,
		});
		res.status(201).json(newTable);
	} catch (err) {
		console.error({ message: 'Error creating table' });
	}
}

export async function updateTableStatus(req: AuthRequest, res: Response) {
	try {
		const { tableId } = req.body;
		const { status } = req.body;
		const updated = await tableService.updateTableStatus(tableId, status);
		res.json(updated);
	} catch (err) {
		res.status(500).json({ message: 'Failed to update status:' });
	}
}

export async function assignOrder(req: AuthRequest, res: Response) {
	try {
		const { tableId } = req.body;
		const { orderId } = req.body;
		const updated = await tableService.assignOrder(tableId, orderId);
		res.json(updated);
	} catch (err) {
		res.status(500).json({ message: 'Falied to assign order:' });
	}
}

export async function freeTable(req: AuthRequest, res: Response) {
	try {
		const { tableId } = req.body;
		const updated = await tableService.freetable(tableId);
		res.json(updated);
	} catch (err) {
		res.status(500).json({ message: 'Failed to free table' });
	}
}

export async function deleteTable (req: AuthRequest, res:Response) {
    try {
      const { tableId } = req.params;
      const deleted = await tableService.deleteTable(tableId);
      res.json(deleted);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete table" });
    }
}
