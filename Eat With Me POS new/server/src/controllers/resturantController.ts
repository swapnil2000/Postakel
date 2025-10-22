// import { Response } from 'express';
// import { AuthRequest } from '../middlewares/auth';
// import { prisma } from '../app'

// export async function getRestaurant(req: AuthRequest, res: Response) {
//     try {
//         const vendorId = req.vendorId!;
//         const restaurant = await prisma.restaurant.findUnique({ where: { vendorId } });
//         if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
//         res.json(restaurant);
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Coud not fetch restaurant' });
//     }
// }

// export async function updateRestaurant(req: AuthRequest, res: Response) {
//     try {
//         const vendorId = req.vendorId;
//         const payload = req.body;
//         const restaurant = await prisma.restaurant.update({ where: { vendorId }, data: payload });
//         res.json(restaurant);
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).json({message:'Could not update restaurant'})
//     }
// }

// export async function createOrder(req: AuthRequest, res: Response) {
//     try {
//         const vendorId = req.vendorId!;
//         const { items, total, tableNumber } = req.body;

//         const restaurant = await prisma.restaurant.findUnique({ where: { vendorId } });
//         if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

//         const order = await prisma.order.create({
//             data: {
//                 vendorId,
//                 restaurantId: restaurant.id,
//                 items,
//                 total,
//                 tableNumber
//             }
//         });
//         res.json(order);
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).json({ messgae: 'Restaurant not found.' });
//     }
// }
// export async function listOrders(req: AuthRequest, res: Response) {
//     try {
//         const vendorId = req.vendorId;
//         const orders = await prisma.order.findMany({ where: { vendorId }, orderBy: { createdAt: 'desc' } });
//         res.json(orders);
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'COuld not list orders' });
//     }
// }



import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma';
import { logger } from '../utils/logger';

const restaurantSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(10),
  email: z.string().email(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  openingHours: z.array(z.object({
    day: z.enum(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']),
    open: z.string(),
    close: z.string()
  }))
});

export const restaurantController = {
  async updateRestaurantDetails(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      const validatedData = restaurantSchema.parse(req.body);

      const restaurant = await prisma.restaurant.update({
        where: { vendorId },
        data: validatedData
      });

      res.json(restaurant);
    } catch (error) {
      logger.error('Update restaurant details error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid input', errors: error.errors });
      } else {
        res.status(500).json({ message: 'Failed to update restaurant details' });
      }
    }
  },

  async getRestaurantDetails(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      
      const restaurant = await prisma.restaurant.findUnique({
        where: { vendorId },
        include: {
          tables: true,
          menu: true
        }
      });

      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }

      res.json(restaurant);
    } catch (error) {
      logger.error('Get restaurant details error:', error);
      res.status(500).json({ message: 'Failed to fetch restaurant details' });
    }
  }
};
