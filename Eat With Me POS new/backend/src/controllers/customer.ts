import { Request, Response } from 'express';

export async function getAllCustomers(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const customers = await prisma.customer.findMany();
  res.json(customers);
}

export async function getCustomerById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const customer = await prisma.customer.findUnique({ where: { id } });
  customer ? res.json(customer) : res.status(404).json({ error: "Not found" });
}

export async function createCustomer(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { name, phone, email } = req.body;
  const customer = await prisma.customer.create({ data: { name, phone, email } });
  res.status(201).json(customer);
}

export async function updateCustomer(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const { name, phone, email } = req.body;
  const customer = await prisma.customer.update({ where: { id }, data: { name, phone, email } });
  res.json(customer);
}

export async function deleteCustomer(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  await prisma.customer.delete({ where: { id } });
  res.json({ deleted: true });
}
