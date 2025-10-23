import { Request, Response } from "express";

// All suppliers
export async function getAllSuppliers(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const suppliers = await prisma.supplier.findMany();
  res.json(suppliers);
}

// By ID
export async function getSupplierById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  supplier ? res.json(supplier) : res.status(404).json({ error: "Not found" });
}

// Create
export async function createSupplier(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const data = req.body;
  const supplier = await prisma.supplier.create({ data });
  res.status(201).json(supplier);
}

// Update
export async function updateSupplier(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const data = req.body;
  const supplier = await prisma.supplier.update({ where: { id }, data });
  res.json(supplier);
}

// Delete
export async function deleteSupplier(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  await prisma.supplier.delete({ where: { id } });
  res.json({ deleted: true });
}

// By status, search, items for this supplier
export async function searchSuppliers(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { q, status } = req.query;
  const where: any = {
    AND: [
      q ? { name: { contains: q as string, mode: "insensitive" } } : {},
      status ? { status: status as string } : {}
    ]
  };
  const suppliers = await prisma.supplier.findMany({ where });
  res.json(suppliers);
}
