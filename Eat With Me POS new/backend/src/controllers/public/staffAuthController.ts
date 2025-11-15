import { Request, Response } from 'express';
import { getMasterPrisma } from '../../utils/masterPrisma';
import { getTenantPrismaClient } from '../../utils/dbManager';
import bcrypt from 'bcryptjs';

export async function staffLogin(req: Request, res: Response) {
  const { restaurantId, email, password } = req.body;
  if (!restaurantId || !email || !password) {
    return res.status(400).json({ message: 'Missing credentials.' });
  }

  // Find tenant by restaurantId in master DB
  const masterPrisma = getMasterPrisma();
  const tenant = await masterPrisma.tenant.findUnique({ where: { restaurantId } });
  if (!tenant) return res.status(404).json({ message: 'Tenant not found.' });

  // Connect to tenant DB
  const tenantPrisma = getTenantPrismaClient(tenant.dbName);

  // Find staff by email
  const staff = await tenantPrisma.staff.findUnique({ where: { email } });
  if (!staff) return res.status(401).json({ message: 'Invalid email or password.' });

  // Verify password
  const valid = await bcrypt.compare(password, staff.password);
  if (!valid) return res.status(401).json({ message: 'Invalid email or password.' });

  // Return staff info and permissions
  return res.json({
    id: staff.id,
    name: staff.name,
    email: staff.email,
    permissions: staff.permissions,
    dashboardModules: staff.dashboardModules,
    roleId: staff.roleId,
    // Add other fields as needed
  });
}