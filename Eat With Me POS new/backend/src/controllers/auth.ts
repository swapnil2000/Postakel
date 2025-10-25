import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getMasterPrisma, getTenantPrisma } from '../utils/dbManager';
import { Request, Response } from 'express';

export async function login(req: Request, res: Response) {
  const { email, password, restaurantId } = req.body;

  try {
    if (!email || typeof email !== 'string' || !email.trim()) {
      console.error('Login error: Email missing or invalid');
      return res.status(400).json({ error: 'Email is required and must be valid.' });
    }
    if (!password || typeof password !== 'string' || !password.trim()) {
      console.error('Login error: Password missing or invalid');
      return res.status(400).json({ error: 'Password is required and must be valid.' });
    }
    if (!restaurantId || typeof restaurantId !== 'string' || !restaurantId.trim()) {
      console.error('Login error: Restaurant ID missing or invalid');
      return res.status(400).json({ error: 'Restaurant ID is required and must be valid.' });
    }

    const master = getMasterPrisma();
    const user = await master.user.findUnique({ where: { email } });
    if (!user) {
      console.error(`Login error: User not found for email ${email}`);
      return res.status(401).json({ error: 'Invalid credentials: user not found.' });
    }

    const restaurant = await master.restaurant.findUnique({ where: { uniqueCode: restaurantId } });
    if (!restaurant) {
      console.error(`Login error: Restaurant not found for ID ${restaurantId}`);
      return res.status(401).json({ error: 'Invalid restaurant ID.' });
    }

    const userRestaurant = await master.userRestaurant.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId: restaurant.id
        }
      }
    });
    if (!userRestaurant) {
      console.error(`Login error: User ${user.id} not associated with restaurant ${restaurant.id}`);
      return res.status(401).json({ error: 'User is not associated with this restaurant.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.error(`Login error: Password mismatch for user ${user.id}`);
      return res.status(401).json({ error: 'Invalid credentials: password mismatch.' });
    }

    const token = jwt.sign({ userId: user.id, restaurantId: restaurant.uniqueCode }, process.env.JWT_SECRET as string, { expiresIn: '8h' });
    console.log(`Login success: User ${user.id} logged in for restaurant ${restaurant.uniqueCode}`);
    res.json({ token, restaurantId: restaurant.uniqueCode });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

