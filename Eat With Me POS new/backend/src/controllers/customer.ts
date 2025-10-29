import { Request, Response } from 'express';

export async function getAllCustomers(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const customers = await prisma.customer.findMany();
    console.log('[getAllCustomers] Success:', customers.length, 'customers found');
    res.json(customers);
  } catch (error) {
    console.error('[getAllCustomers] Error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}

export async function getCustomerById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (customer) {
      console.log(`[getCustomerById] Success: Found customer ${id}`);
      res.json(customer);
    } else {
      console.warn(`[getCustomerById] Not found: ${id}`);
      res.status(404).json({ error: "Not found" });
    }
  } catch (error) {
    console.error('[getCustomerById] Error:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
}

export async function createCustomer(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { name, phone, email } = req.body;
  try {
    const customer = await prisma.customer.create({
      data: { name, phone, email }
    });
    console.log('[createCustomer] Success:', customer.id);
    res.status(201).json(customer);
  } catch (error) {
    console.error('[createCustomer] Error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
}

// Update customer upon order placement (integrated version)
export async function logOrderForCustomer(prisma: any, customerId: string, orderAmount: number) {
  if (!customerId) return;
  try {
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        totalOrders: { increment: 1 },
        totalSpent: { increment: orderAmount },
        lastVisit: new Date(),
      }
    });
    console.log(`[logOrderForCustomer] Updated stats for customer ${customerId}`);
  } catch (error) {
    console.error(`[logOrderForCustomer] Error updating stats for customer ${customerId}:`, error);
  }
}

export async function updateCustomer(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const { name, phone, email } = req.body;
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: { name, phone, email }
    });
    console.log('[updateCustomer] Success:', id);
    res.json(customer);
  } catch (error) {
    console.error('[updateCustomer] Error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
}

export async function deleteCustomer(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  try {
    await prisma.customer.delete({ where: { id } });
    console.log('[deleteCustomer] Success:', id);
    res.json({ deleted: true });
  } catch (error) {
    console.error('[deleteCustomer] Error:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
}
