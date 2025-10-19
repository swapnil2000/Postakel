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



import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { prisma } from '../app';

/**
 * Get restaurant info for the logged-in vendor
 */
export async function getRestaurant(req: AuthRequest, res: Response) {
  try {
    const vendorId = req.vendorId!;
    const restaurant = await prisma.restaurant.findFirst({ where: { vendorId } });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch restaurant' });
  }
}

/**
 * Update restaurant info for the logged-in vendor
 */
export async function updateRestaurant(req: AuthRequest, res: Response) {
  try {
    const vendorId = req.vendorId!;
    const payload = req.body;

    // Find the restaurant first
    const restaurant = await prisma.restaurant.findFirst({ where: { vendorId } });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: payload,
    });

    res.json(updatedRestaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update restaurant' });
  }
}

/**
 * Create a new order for the vendor's restaurant
 * Expects: { items: [{ name, price, quantity }], totalAmount: number, tableNumber?: number }
 */
export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const vendorId = req.vendorId!;
    const { items, totalAmount, tableNumber } = req.body;

    const restaurant = await prisma.restaurant.findFirst({ where: { vendorId } });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const order = await prisma.order.create({
      data: {
        restaurantId: restaurant.id,
        vendorId,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
}

/**
 * List all orders for the vendor's restaurant
 */
export async function listOrders(req: AuthRequest, res: Response) {
  try {
    const vendorId = req.vendorId!;
    const restaurant = await prisma.restaurant.findFirst({ where: { vendorId } });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const orders = await prisma.order.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not list orders' });
  }
}
