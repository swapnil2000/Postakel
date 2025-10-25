import { Request, Response } from "express";

// All reservations
export async function getAllReservations(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const reservations = await prisma.reservation.findMany();
    console.log('Fetched all reservations');
    res.json(reservations);
  } catch (err) {
    console.error('Get all reservations error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// By ID
export async function getReservationById(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      console.log(`Reservation not found: id=${id}`);
      return res.status(404).json({ error: "Not found" });
    }
    res.json(reservation);
  } catch (err) {
    console.error('Get reservation by ID error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create
export async function createReservation(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const data = req.body;
    const reservation = await prisma.reservation.create({ data });
    console.log(`Reservation created: ${JSON.stringify(reservation)}`);
    res.status(201).json(reservation);
  } catch (err) {
    console.error('Create reservation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update
export async function updateReservation(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    const data = req.body;
    const reservation = await prisma.reservation.update({ where: { id }, data });
    console.log(`Reservation updated: id=${id}`);
    res.json(reservation);
  } catch (err) {
    console.error('Update reservation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete
export async function deleteReservation(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    await prisma.reservation.delete({ where: { id } });
    console.log(`Reservation deleted: id=${id}`);
    res.json({ deleted: true });
  } catch (err) {
    console.error('Delete reservation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Search/filter by date/status/table
export async function searchReservations(req: Request, res: Response) {
  try {
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
    console.log(`Searched reservations with query: ${JSON.stringify(req.query)}`);
    res.json(reservations);
  } catch (err) {
    console.error('Search reservations error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Availability check for a date/time/party size
export async function checkAvailability(req: Request, res: Response) {
  try {
    const prisma = (req as any).prisma;
    const { date, time, partySize } = req.query;
    const reservations = await prisma.reservation.findMany({
      where: {
        date: new Date(date as string),
        time: time as string
      }
    });
    const reservedTables = reservations.map((r: { tableId: string }) => r.tableId);
    const tables = await prisma.table.findMany({
      where: {
        capacity: { gte: Number(partySize) },
        id: { notIn: reservedTables }
      }
    });
    console.log(`Checked table availability for date=${date}, time=${time}, partySize=${partySize}`);
    res.json(tables);
  } catch (err) {
    console.error('Check availability error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
