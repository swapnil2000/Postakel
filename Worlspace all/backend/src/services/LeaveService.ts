import { PrismaClient } from '@prisma/client';
import { DateUtil } from '../utils';

export class LeaveService {
  static async createLeaveRequest(prisma: PrismaClient, userId: string, tenantId: string, data: {
    leaveTypeId: string;
    startDate: Date;
    endDate: Date;
    reason?: string;
  }) {
    try {
      const duration = DateUtil.calculateDaysDifference(data.startDate, data.endDate);

      const leaveRequest = await prisma.leaveRequest.create({
        data: {
          tenantId,
          userId,
          leaveTypeId: data.leaveTypeId,
          startDate: data.startDate,
          endDate: data.endDate,
          duration: duration + 1, // Include both start and end date
          reason: data.reason,
          status: 'pending',
        },
      });

      return leaveRequest;
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }
  }

  static async approveLeaveRequest(prisma: PrismaClient, leaveRequestId: string, approvedBy: string) {
    try {
      const leaveRequest = await prisma.leaveRequest.update({
        where: { id: leaveRequestId },
        data: {
          status: 'approved',
          approvedBy,
          approvedAt: new Date(),
        },
      });

      return leaveRequest;
    } catch (error) {
      console.error('Error approving leave request:', error);
      throw error;
    }
  }

  static async rejectLeaveRequest(prisma: PrismaClient, leaveRequestId: string, rejectionReason: string) {
    try {
      const leaveRequest = await prisma.leaveRequest.update({
        where: { id: leaveRequestId },
        data: {
          status: 'rejected',
          rejectionReason,
        },
      });

      return leaveRequest;
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      throw error;
    }
  }

  static async getLeaveRequests(prisma: PrismaClient, tenantId: string, userId?: string) {
    try {
      const where: any = { tenantId };
      if (userId) where.userId = userId;

      const leaves = await prisma.leaveRequest.findMany({
        where,
        include: { leaveType: true, user: true },
        orderBy: { startDate: 'desc' },
      });

      return leaves;
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  }

  static async getLeaveBalance(prisma: PrismaClient, userId: string, tenantId: string, leaveTypeId: string, year: number) {
    try {
      const balance = await prisma.leaveBalance.findUnique({
        where: {
          tenantId_userId_leaveTypeId_year: {
            tenantId,
            userId,
            leaveTypeId,
            year,
          },
        },
        include: { leaveType: true },
      });

      return balance;
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      throw error;
    }
  }

  static async createLeaveType(prisma: PrismaClient, tenantId: string, data: {
    name: string;
    description?: string;
    daysPerYear: number;
    carryOver?: number;
    requiresApproval?: boolean;
  }) {
    try {
      const leaveType = await prisma.leaveType.create({
        data: {
          tenantId,
          name: data.name,
          description: data.description,
          daysPerYear: data.daysPerYear,
          carryOver: data.carryOver || 0,
          requiresApproval: data.requiresApproval !== false,
        },
      });

      return leaveType;
    } catch (error) {
      console.error('Error creating leave type:', error);
      throw error;
    }
  }

  static async addHoliday(prisma: PrismaClient, tenantId: string, data: {
    name: string;
    date: Date;
    isOptional?: boolean;
    description?: string;
  }) {
    try {
      const holiday = await prisma.holiday.create({
        data: {
          tenantId,
          name: data.name,
          date: data.date,
          isOptional: data.isOptional || false,
          description: data.description,
        },
      });

      return holiday;
    } catch (error) {
      console.error('Error adding holiday:', error);
      throw error;
    }
  }
}
