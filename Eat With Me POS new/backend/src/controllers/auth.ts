import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const prisma = (req as any).prisma;
  const tenant = (req as any).tenant;

  if (!prisma) {
    return res.status(400).json({ message: 'Restaurant ID is missing or invalid. Please provide it in the X-Restaurant-Id header.' });
  }
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const staff = await prisma.staff.findUnique({ where: { email } });

    if (staff && (await bcrypt.compare(password, staff.password))) {
      const role = await prisma.role.findUnique({ where: { id: staff.roleId } });
      const accessToken = jwt.sign(
        { staffId: staff.id, roleId: staff.roleId, tenantId: tenant.id },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' }
      );
      res.json({
        accessToken,
        user: {
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: role?.name || 'No Role',
          permissions: role?.permissions && Array.isArray(role.permissions) ? role.permissions : [],
        },
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
}

