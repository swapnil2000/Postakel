import { Request, Response } from "express";

// All reservations
export async function getAllReservations(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const reservations = await prisma.reservation.findMany();
  res.json(reservations);
}

// By ID
export async function getReservationById(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const reservation = await prisma.reservation.findUnique({ where: { id } });
  reservation ? res.json(reservation) : res.status(404).json({ error: "Not found" });
}

// Create
export async function createReservation(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const data = req.body;
  const reservation = await prisma.reservation.create({ data });
  res.status(201).json(reservation);
}

// Update
export async function updateReservation(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const data = req.body;
  const reservation = await prisma.reservation.update({ where: { id }, data });
  res.json(reservation);
}

// Delete
export async function deleteReservation(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  await prisma.reservation.delete({ where: { id } });
  res.json({ deleted: true });
}

// Search/filter by date/status/table
export async function searchReservations(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { date, status, tableId } = req.query;
  const where: any = {
    AND: [
      date ? { date: new Date(date as string) } : {},
      status ? { status: status as string } : {},
      tableId ? { tableId: tableId as string } : {},
    ]
  };
  const reservations = await prisma.reservation.findMany({ where });
  res.json(reservations);
}

// Availability check for a date/time/party size
export async function checkAvailability(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { date, time, partySize } = req.query;
  const reservations = await prisma.reservation.findMany({
    where: {
      date: new Date(date as string),
      time: time as string
    }
  });
  const reservedTables = reservations.map(r => r.tableId);
  const tables = await prisma.table.findMany({
    where: {
      capacity: { gte: Number(partySize) },
      id: { notIn: reservedTables }
    }
  });
  res.json(tables);
}
