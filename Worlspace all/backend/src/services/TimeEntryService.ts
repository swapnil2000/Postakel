import { PrismaClient } from '@prisma/client';
import { DateUtil, StringUtil } from '../utils';

export class TimeEntryService {
  static async clockIn(prisma: PrismaClient, userId: string, tenantId: string, data: {
    location?: string;
    project?: string;
    description?: string;
  }) {
    try {
      const timeEntry = await prisma.timeEntry.create({
        data: {
          tenantId,
          userId,
          checkInTime: new Date(),
          location: data.location,
          project: data.project,
          description: data.description,
        },
      });

      return timeEntry;
    } catch (error) {
      console.error('Error clocking in:', error);
      throw error;
    }
  }

  static async clockOut(prisma: PrismaClient, timeEntryId: string) {
    try {
      const timeEntry = await prisma.timeEntry.findUnique({
        where: { id: timeEntryId },
      });

      if (!timeEntry) {
        throw new Error('Time entry not found');
      }

      const checkOutTime = new Date();
      const duration = Math.round((checkOutTime.getTime() - timeEntry.checkInTime.getTime()) / (1000 * 60));

      const updated = await prisma.timeEntry.update({
        where: { id: timeEntryId },
        data: {
          checkOutTime,
          duration,
        },
      });

      return updated;
    } catch (error) {
      console.error('Error clocking out:', error);
      throw error;
    }
  }

  static async startBreak(prisma: PrismaClient, timeEntryId: string, data: {
    type: string;
    notes?: string;
  }) {
    try {
      const timeEntry = await prisma.timeEntry.findUnique({
        where: { id: timeEntryId },
      });

      if (!timeEntry) {
        throw new Error('Time entry not found');
      }

      const breakRecord = await prisma.break.create({
        data: {
          tenantId: timeEntry.tenantId,
          timeEntryId,
          type: data.type,
          startTime: new Date(),
          notes: data.notes,
        },
      });

      return breakRecord;
    } catch (error) {
      console.error('Error starting break:', error);
      throw error;
    }
  }

  static async endBreak(prisma: PrismaClient, breakId: string) {
    try {
      const breakRecord = await prisma.break.findUnique({
        where: { id: breakId },
      });

      if (!breakRecord) {
        throw new Error('Break record not found');
      }

      const endTime = new Date();
      const duration = Math.round((endTime.getTime() - breakRecord.startTime.getTime()) / (1000 * 60));

      const updated = await prisma.break.update({
        where: { id: breakId },
        data: {
          endTime,
          duration,
        },
      });

      return updated;
    } catch (error) {
      console.error('Error ending break:', error);
      throw error;
    }
  }

  static async getTimeEntries(prisma: PrismaClient, tenantId: string, userId?: string, startDate?: Date, endDate?: Date) {
    try {
      const where: any = { tenantId };
      if (userId) where.userId = userId;
      if (startDate && endDate) {
        where.checkInTime = {
          gte: startDate,
          lte: endDate,
        };
      }

      const entries = await prisma.timeEntry.findMany({
        where,
        include: { breaks: true },
        orderBy: { checkInTime: 'desc' },
      });

      return entries;
    } catch (error) {
      console.error('Error fetching time entries:', error);
      throw error;
    }
  }

  static async getTodayHours(prisma: PrismaClient, userId: string, tenantId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const entries = await prisma.timeEntry.findMany({
        where: {
          userId,
          tenantId,
          checkInTime: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: { breaks: true },
      });

      let totalMinutes = 0;
      entries.forEach((entry: any) => {
        if (entry.duration) {
          totalMinutes += entry.duration;
          // Subtract break time
          entry.breaks.forEach((breakRecord: any) => {
            if (breakRecord.duration) {
              totalMinutes -= breakRecord.duration;
            }
          });
        }
      });

      return (totalMinutes / 60).toFixed(2);
    } catch (error) {
      console.error('Error calculating today hours:', error);
      throw error;
    }
  }
}
