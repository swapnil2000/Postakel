import { PrismaClient } from "@prisma/client";
import { getRedisClient } from '../utils/redisClient';

const prisma = new PrismaClient();
const redis = getRedisClient();

export const tableService = {
    async getAllTables(restaurantId: string) {
        const cacheKey = `tables:${restaurantId}`;
        const cached = await redis?.get(cacheKey);

        if (cached) return JSON.parse(cached);

        const tables = await prisma.table.findMany({
            where: { restaurantId },
            include: { orders: true },
        });

        await redis?.set(cacheKey, JSON.stringify(tables), 'EX', 60);
        return tables;
    
    },

    async createTable(data: { restaurantId: string; tableNumber: number; capacity?: number }) {
        const newTable = await prisma.table.create({ data });
        await redis?.del(`tables:${data.restaurantId}`);
        return newTable;
    },

    async updateTableStatus(tableId: string, status: string) {
        const table = await prisma.table.update({
            where: { id: tableId },
            data: { status }
        });
        await redis?.del(`tables:${table.restaurantId}`)
        return table;
    },

    async assignOrder(tableId: string, orderId: string) {
        const updated = await prisma.table.update({
            where: { id: tableId },
            data: { status: "OCCUPIED", orders: { connect: { id: orderId } } },
        });
        await redis?.del(`tables:${updated.restaurantId}`);
        return updated;
    },

    async freetable(tableId: string) {
        const updated = await prisma.table.update({
            where: { id: tableId },
            data: { status: "AVAILABLE" }
        });
        await redis?.del(`tables:${updated.restaurantId}`);
        return updated;
    },

    async deleteTable(tableId: string) {
        const table = await prisma.table.delete({ where: { id: tableId } });
        await redis?.del(`tables:${table.restaurantId}`);
        return table;
    }
}