import { Request, Response } from "express";

// All expenses
export async function getAllExpenses(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const expenses = await prisma.expense.findMany();
  res.json(expenses);
}

// By ID
export async function getExpenseById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const expense = await prisma.expense.findUnique({ where: { id } });
  expense ? res.json(expense) : res.status(404).json({ error: "Not found" });
}

// Create
export async function createExpense(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const data = req.body;
  const expense = await prisma.expense.create({ data });
  res.status(201).json(expense);
}

// Update
export async function updateExpense(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const data = req.body;
  const expense = await prisma.expense.update({ where: { id }, data });
  res.json(expense);
}

// Delete
export async function deleteExpense(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  await prisma.expense.delete({ where: { id } });
  res.json({ deleted: true });
}

// Filter/search by timeframe, category, vendor
export async function searchExpenses(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { from, to, category, vendor } = req.query;
  const where: any = {
    AND: [
      from ? { date: { gte: new Date(from as string) } } : {},
      to ? { date: { lte: new Date(to as string) } } : {},
      category ? { category: category as string } : {},
      vendor ? { vendor: { contains: vendor as string, mode: "insensitive" } } : {}
    ]
  };
  const expenses = await prisma.expense.findMany({ where });
  res.json(expenses);
}

// Expenses summary/stats
export async function getExpenseStats(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { from, to } = req.query;
  const summary = await prisma.expense.aggregate({
    _sum: { amount: true },
    _count: { _all: true },
    where: {
      date: {
        gte: from ? new Date(from as string) : undefined,
        lte: to ? new Date(to as string) : undefined
      }
    }
  });
  res.json(summary);
}
