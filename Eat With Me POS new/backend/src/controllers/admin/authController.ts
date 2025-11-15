import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getMasterPrisma } from '../../utils/masterPrisma';
import { recordAdminAudit } from '../../utils/adminAuditLogger';

function getRefreshTokenExpiry(rememberMe?: boolean) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 60 : 30));
  return expiresAt;
}

export async function adminLogin(req: Request, res: Response) {
  const { email, password, rememberMe } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Admin authentication secret is not configured.' });
  }

  const masterPrisma = getMasterPrisma();
  const adminUser = await masterPrisma.adminUser.findUnique({ where: { email } });

  if (!adminUser || !adminUser.isActive) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const isValidPassword = await bcrypt.compare(password, adminUser.passwordHash);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid admin credentials.' });
  }

  const accessToken = jwt.sign(
    {
      sub: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
      type: 'admin',
    },
    secret,
    { expiresIn: rememberMe ? '12h' : '2h' }
  );

  let refreshToken: string | undefined;
  const loginTime = new Date();
  if (rememberMe) {
    refreshToken = crypto.randomBytes(48).toString('hex');
    await masterPrisma.adminRefreshToken.create({
      data: {
        adminId: adminUser.id,
        token: refreshToken,
        expiresAt: getRefreshTokenExpiry(true),
      },
    });
  }

  await masterPrisma.adminUser.update({
    where: { id: adminUser.id },
    data: { lastLoginAt: loginTime },
  });

  await recordAdminAudit(adminUser.id, 'ADMIN_LOGIN', 'AdminUser', adminUser.id, {
    rememberMe: Boolean(rememberMe),
    ip: req.ip,
  });

  return res.json({
    accessToken,
    refreshToken,
    admin: {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
      lastLoginAt: loginTime,
    },
  });
}
