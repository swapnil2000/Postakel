import { PrismaClient } from '@prisma/client';

export class ReportService {
  static async generateAttendanceReport(prisma: PrismaClient, tenantId: string, startDate: Date, endDate: Date) {
    try {
      const timeEntries = await prisma.timeEntry.findMany({
        where: {
          tenantId,
          checkInTime: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: { user: true, breaks: true },
      });

      const reportData = timeEntries.map((entry: any) => ({
        userId: entry.userId,
        userName: entry.user.fullName,
        date: entry.checkInTime,
        checkIn: entry.checkInTime,
        checkOut: entry.checkOutTime,
        totalHours: entry.duration ? entry.duration / 60 : 0,
        breaks: entry.breaks.length,
        location: entry.location,
      }));

      return reportData;
    } catch (error) {
      console.error('Error generating attendance report:', error);
      throw error;
    }
  }

  static async generateLeaveReport(prisma: PrismaClient, tenantId: string, year: number) {
    try {
      const leaveRequests = await prisma.leaveRequest.findMany({
        where: {
          tenantId,
          startDate: {
            gte: new Date(`${year}-01-01`),
            lte: new Date(`${year}-12-31`),
          },
        },
        include: { user: true, leaveType: true },
      });

      const reportData = leaveRequests.map((leave: any) => ({
        userId: leave.userId,
        userName: leave.user.fullName,
        leaveType: leave.leaveType.name,
        startDate: leave.startDate,
        endDate: leave.endDate,
        duration: leave.duration,
        status: leave.status,
        reason: leave.reason,
      }));

      return reportData;
    } catch (error) {
      console.error('Error generating leave report:', error);
      throw error;
    }
  }

  static async generateSalaryReport(prisma: PrismaClient, tenantId: string, month: number, year: number) {
    try {
      const payrolls = await prisma.payroll.findMany({
        where: {
          tenantId,
          month,
          year,
        },
        include: { user: true },
      });

      const reportData = payrolls.map((payroll: any) => ({
        userId: payroll.userId,
        userName: payroll.user.fullName,
        baseSalary: payroll.baseSalary,
        allowances: payroll.allowances,
        deductions: payroll.deductions,
        tax: payroll.tax,
        netSalary: payroll.netSalary,
        status: payroll.status,
      }));

      return reportData;
    } catch (error) {
      console.error('Error generating salary report:', error);
      throw error;
    }
  }

  static async createReport(prisma: PrismaClient, tenantId: string, createdById: string, data: {
    name: string;
    description?: string;
    type: string;
    category?: string;
    parameters?: Record<string, any>;
    data?: any;
  }) {
    try {
      const report = await prisma.report.create({
        data: {
          tenantId,
          createdById,
          name: data.name,
          description: data.description,
          type: data.type,
          category: data.category,
          parameters: data.parameters || {},
          data: data.data || {},
        },
      });

      return report;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  static async getReports(prisma: PrismaClient, tenantId: string, type?: string) {
    try {
      const where: any = { tenantId };
      if (type) where.type = type;

      const reports = await prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return reports;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }
}
