import { prisma } from '../app';

export async function getVendorWithRestaurant(vendorId: string) {
    return prisma.vendor.findUnique({ where: { id: vendorId }, include: { restaurant: true } });
    
}