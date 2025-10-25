import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getMasterPrisma } from '../utils/dbManager';
import { Request, Response } from 'express';

export async function login(req: Request, res: Response) {
  const { email, password, restaurantId } = req.body;

  try {
    console.log('Login attempt:', { email, password, restaurantId });

    if (!restaurantId || typeof restaurantId !== 'string' || !restaurantId.trim()) {
      console.error('Login error: Restaurant ID missing or invalid');
      return res.status(400).json({ error: 'Restaurant ID is required and must be valid.' });
    }

    const master = getMasterPrisma();

    // Find restaurant by uniqueCode and userEmail
    const restaurant = await master.restaurant.findFirst({
      where: { uniqueCode: restaurantId, userEmail: email }
    });
    console.log('Restaurant found:', restaurant);
    if (!restaurant) {
      console.error(`Login error: Restaurant not found for uniqueCode ${restaurantId} and email ${email}`);
      return res.status(401).json({ error: 'Invalid credentials: restaurant or email not found.' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, restaurant.userPassword || '');
    console.log('Password match:', passwordMatch);
    if (!passwordMatch) {
      console.error(`Login error: Password mismatch for restaurant ${restaurant.id}`);
      return res.status(401).json({ error: 'Invalid credentials: password mismatch.' });
    }

    // Success
    const token = jwt.sign({ restaurantId: restaurant.uniqueCode }, process.env.JWT_SECRET as string, { expiresIn: '8h' });
    console.log(`Login success: Restaurant ${restaurant.uniqueCode} logged in`);
    res.json({ token, restaurantId: restaurant.uniqueCode });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

