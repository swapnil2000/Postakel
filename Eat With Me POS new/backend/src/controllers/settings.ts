import { Request, Response } from "express";

// Get settings (one per restaurant)
export async function getSettings(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  // Assume a singleton settings row per restaurant
  const settingsArr = await prisma.settings.findMany();
  if (settingsArr.length === 0) return res.json({});
  res.json(settingsArr[0]);
}

// Update settings
export async function updateSettings(req: Request, res: Response) {
  const prisma = (req as any).prisma;
  // Only one settings row
  const settingsArr = await prisma.settings.findMany();
  if (settingsArr.length === 0)
    return res.status(404).json({ error: "No settings found" });
  const [settings] = settingsArr;
  const updated = await prisma.settings.update({
    where: { id: settings.id },
    data: req.body
  });
  res.json(updated);
}
