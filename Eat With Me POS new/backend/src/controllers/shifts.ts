import { Request, Response } from "express";

// Get all shift logs
export async function getAllShifts(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const shifts = await prisma.shiftLog
    ? await prisma.shiftLog.findMany()
    : [];
  res.json(shifts);
}

// Create shift entry
export async function createShift(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { staffId, startTime, endTime, type } = req.body;
  if (!prisma.shiftLog)
    return res.status(501).json({ error: "Shifts not enabled in schema." });
  const shift = await prisma.shiftLog.create({
    data: { staffId, startTime, endTime, type }
  });
  res.status(201).json(shift);
}

// By staffId
export async function getStaffShifts(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { staffId } = req.params;
  if (!prisma.shiftLog)
    return res.status(501).json({ error: "Shifts not enabled in schema." });
  const shifts = await prisma.shiftLog.findMany({ where: { staffId } });
  res.json(shifts);
}
// Update shift entry
export async function updateShift(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  const { id } = req.params;
  const { staffId, startTime, endTime, type } = req.body;
  if (!prisma.shiftLog)
    return res.status(501).json({ error: "Shifts not enabled in schema." });
  const shift = await prisma.shiftLog.update({
    where: { id },
    data: { staffId, startTime, endTime, type }
  });
  res.json(shift);
}

// Delete shift entry
export async function deleteShift(req: Request, res: Response) {
  const prisma = (req as any).prisma;   
  const { id } = req.params;
  if (!prisma.shiftLog)
    return res.status(501).json({ error: "Shifts not enabled in schema." });
  await prisma.shiftLog.delete({ where: { id } });
  res.status(204).send();
}
