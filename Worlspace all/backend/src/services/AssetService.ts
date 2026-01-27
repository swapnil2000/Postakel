import { PrismaClient } from '@prisma/client';

export class AssetService {
  static async createAsset(prisma: PrismaClient, tenantId: string, data: {
    name: string;
    category: string;
    description?: string;
    serialNumber?: string;
    purchaseDate: Date;
    purchaseCost: number;
    vendor?: string;
    warrantyExpiry?: Date;
    location?: string;
  }) {
    try {
      const assetTag = `ASSET-${Date.now()}`;

      const asset = await prisma.asset.create({
        data: {
          tenantId,
          name: data.name,
          category: data.category,
          description: data.description,
          assetTag,
          serialNumber: data.serialNumber,
          purchaseDate: data.purchaseDate,
          purchaseCost: data.purchaseCost,
          vendor: data.vendor,
          warrantyExpiry: data.warrantyExpiry,
          location: data.location,
        },
      });

      return asset;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  }

  static async assignAsset(prisma: PrismaClient, assetId: string, userId: string, tenantId: string, notes?: string) {
    try {
      // Update asset status
      await prisma.asset.update({
        where: { id: assetId },
        data: { status: 'assigned' },
      });

      // Create assignment
      const assignment = await prisma.assetAssignment.create({
        data: {
          tenantId,
          assetId,
          userId,
          assignedAt: new Date(),
          notes,
        },
      });

      return assignment;
    } catch (error) {
      console.error('Error assigning asset:', error);
      throw error;
    }
  }

  static async returnAsset(prisma: PrismaClient, assignmentId: string, condition?: string) {
    try {
      const assignment = await prisma.assetAssignment.update({
        where: { id: assignmentId },
        data: {
          returnedAt: new Date(),
          condition,
        },
      });

      // Update asset status
      await prisma.asset.update({
        where: { id: assignment.assetId },
        data: { status: 'available' },
      });

      return assignment;
    } catch (error) {
      console.error('Error returning asset:', error);
      throw error;
    }
  }

  static async getAssets(prisma: PrismaClient, tenantId: string, category?: string) {
    try {
      const where: any = { tenantId };
      if (category) where.category = category;

      const assets = await prisma.asset.findMany({
        where,
        include: { assignments: true },
        orderBy: { createdAt: 'desc' },
      });

      return assets;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  }

  static async logMaintenance(prisma: PrismaClient, assetId: string, tenantId: string, data: {
    type: string;
    description: string;
    cost?: number;
    vendor?: string;
    completedAt: Date;
  }) {
    try {
      const log = await prisma.maintenanceLog.create({
        data: {
          assetId,
          tenantId,
          type: data.type,
          description: data.description,
          cost: data.cost,
          vendor: data.vendor,
          completedAt: data.completedAt,
        },
      });

      return log;
    } catch (error) {
      console.error('Error logging maintenance:', error);
      throw error;
    }
  }
}
