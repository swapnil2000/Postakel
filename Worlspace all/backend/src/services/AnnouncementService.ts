import { PrismaClient } from '@prisma/client';

export class AnnouncementService {
  static async createAnnouncement(prisma: PrismaClient, userId: string, tenantId: string, data: {
    title: string;
    content: string;
    category?: string;
    priority?: string;
    expiresAt?: Date;
    attachments?: string[];
  }) {
    try {
      const announcement = await prisma.announcement.create({
        data: {
          tenantId,
          createdById: userId,
          title: data.title,
          content: data.content,
          category: data.category,
          priority: data.priority || 'normal',
          expiresAt: data.expiresAt,
          attachments: data.attachments || [],
        },
      });

      return announcement;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  static async getAnnouncements(prisma: PrismaClient, tenantId: string) {
    try {
      const now = new Date();

      const announcements = await prisma.announcement.findMany({
        where: {
          tenantId,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: now } },
          ],
        },
        include: { createdBy: true },
        orderBy: { createdAt: 'desc' },
      });

      return announcements;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw error;
    }
  }

  static async markAnnouncementAsViewed(prisma: PrismaClient, announcementId: string, userId: string) {
    try {
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcementId },
      });

      if (!announcement) {
        throw new Error('Announcement not found');
      }

      const viewedBy = announcement.viewedBy || [];
      if (!viewedBy.includes(userId)) {
        viewedBy.push(userId);
      }

      const updated = await prisma.announcement.update({
        where: { id: announcementId },
        data: { viewedBy },
      });

      return updated;
    } catch (error) {
      console.error('Error marking announcement as viewed:', error);
      throw error;
    }
  }
}
