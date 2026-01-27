import { PrismaClient } from '@prisma/client';

export class SalaryService {
  static async createSalary(prisma: PrismaClient, userId: string, tenantId: string, data: {
    baseSalary: number;
    allowances?: Record<string, number>;
    deductions?: Record<string, number>;
    netSalary: number;
    paymentMethod?: string;
    bankName?: string;
    accountNumber?: string;
    accountHolderName?: string;
    effectiveFrom: Date;
  }) {
    try {
      const salary = await prisma.salary.create({
        data: {
          tenantId,
          userId,
          baseSalary: data.baseSalary,
          allowances: data.allowances || {},
          deductions: data.deductions || {},
          netSalary: data.netSalary,
          paymentMethod: data.paymentMethod,
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          accountHolderName: data.accountHolderName,
          effectiveFrom: data.effectiveFrom,
        },
      });

      return salary;
    } catch (error) {
      console.error('Error creating salary:', error);
      throw error;
    }
  }

  static async getSalary(prisma: PrismaClient, userId: string, tenantId: string) {
    try {
      const salary = await prisma.salary.findFirst({
        where: {
          userId,
          tenantId,
          effectiveTo: null,
        },
        orderBy: { effectiveFrom: 'desc' },
      });

      return salary;
    } catch (error) {
      console.error('Error fetching salary:', error);
      throw error;
    }
  }

  static async generatePayroll(prisma: PrismaClient, tenantId: string, month: number, year: number) {
    try {
      const users = await prisma.user.findMany({
        where: { tenantId, status: 'active' },
      });

      const payrolls = [];

      for (const user of users) {
        const salary = await this.getSalary(prisma, user.id, tenantId);

        if (salary) {
          const payroll = await prisma.payroll.create({
            data: {
              tenantId,
              userId: user.id,
              month,
              year,
              baseSalary: salary.baseSalary,
              allowances: Object.values(salary.allowances || {}).reduce((a: any, b: any) => a + b, 0),
              deductions: Object.values(salary.deductions || {}).reduce((a: any, b: any) => a + b, 0),
              netSalary: salary.netSalary,
              tax: 0, // Calculate based on rules
              status: 'pending',
            },
          });

          payrolls.push(payroll);
        }
      }

      return payrolls;
    } catch (error) {
      console.error('Error generating payroll:', error);
      throw error;
    }
  }

  static async processPayroll(prisma: PrismaClient, payrollId: string) {
    try {
      const payroll = await prisma.payroll.update({
        where: { id: payrollId },
        data: {
          status: 'processed',
          paidDate: new Date(),
        },
      });

      return payroll;
    } catch (error) {
      console.error('Error processing payroll:', error);
      throw error;
    }
  }
}
