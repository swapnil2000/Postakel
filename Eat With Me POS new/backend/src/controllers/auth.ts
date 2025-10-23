import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getMasterPrisma, getTenantPrisma } from '../utils/dbManager';

export async function login(req, res) {
  const { email, password, restaurantId } = req.body;
  if (!email || !password || !restaurantId) {
    return res.status(400).json({ error: 'Email, password, restaurantId required' });
  }
  const master = getMasterPrisma();
  const user = await master.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const restaurant = await master.restaurant.findUnique({ where: { uniqueCode: restaurantId } });
  if (!restaurant || restaurant.userId !== user.id) return res.status(401).json({ error: 'Invalid restaurant for this user' });
  if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, restaurantId: restaurant.uniqueCode }, process.env.JWT_SECRET as string, { expiresIn: '8h' });
  res.json({ token, restaurantId: restaurant.uniqueCode });
}
