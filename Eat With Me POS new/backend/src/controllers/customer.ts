import { Request, Response } from 'express';

export async function getAllCustomers(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get customers.' });
  }
}

export async function createCustomer(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  try {
    const customer = await prisma.customer.create({ data: req.body });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create customer.' });
  }
}

export async function getCustomerById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  try {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
}

export async function updateCustomer(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: req.body,
    });
    res.json(updatedCustomer);
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
}

export async function deleteCustomer(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  try {
    await prisma.customer.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
}
