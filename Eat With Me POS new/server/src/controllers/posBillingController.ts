import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { posBillingService } from '../services/posBillingService';
import { tableService } from '../services/tableService';

/**
 * Main POS billing controller - handles orders, customers and simple table queries.
 * Keep controller thin; business logic lives in posBillingService.
 */

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const vendorId = req.user?.vendorId;
    const payload = req.body;
    const order = await posBillingService.createOrder(vendorId, payload);
    res.status(201).json(order);
  } catch (err) {
    console.error('POS createOrder error', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
}

export async function listOrders(req: AuthRequest, res: Response) {
  try {
    const vendorId = req.user?.vendorId;
    const orders = await posBillingService.listOrders(vendorId);
    res.json(orders);
  } catch (err) {
    console.error('POS listOrders error', err);
    res.status(500).json({ message: 'Failed to list orders' });
  }
}

export async function getOrder(req: AuthRequest, res: Response) {
  try {
    const { orderId } = req.params;
    const order = await posBillingService.getOrderById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('POS getOrder error', err);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
}

export async function listAvailableTables(req: AuthRequest, res: Response) {
  try {
    // Reuse existing service for table data
    const vendorId = req.user?.vendorId;
    // tableService.getAllTables expects a restaurantId in your workspace; pass vendorId/restaurantId as appropriate
    const tables = await tableService.getAllTables(vendorId as string);
    const available = (tables || []).filter((t: any) => t.status === 'free');
    res.json(available);
  } catch (err) {
    console.error('POS listAvailableTables error', err);
    res.status(500).json({ message: 'Failed to fetch tables' });
  }
}

export async function createCustomer(req: AuthRequest, res: Response) {
  try {
    const vendorId = req.user?.vendorId;
    const payload = req.body;
    const customer = await posBillingService.createCustomer(vendorId, payload);
    res.status(201).json(customer);
  } catch (err) {
    console.error('POS createCustomer error', err);
    res.status(500).json({ message: 'Failed to create customer' });
  }
}

export async function updateCustomer(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updated = await posBillingService.updateCustomer(id, payload);
    res.json(updated);
  } catch (err) {
    console.error('POS updateCustomer error', err);
    res.status(500).json({ message: 'Failed to update customer' });
  }
}