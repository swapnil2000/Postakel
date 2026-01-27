import { PrismaClient } from '@prisma/client';

export class DepartmentService {
  static async createDepartment(prisma: PrismaClient, tenantId: string, data: {
    name: string;
    description?: string;
    head?: string;
    budget?: number;
  }) {
    try {
      const department = await prisma.department.create({
        data: {
          tenantId,
          name: data.name,
          description: data.description,
          head: data.head,
          budget: data.budget,
        },
      });

      return department;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }

  static async getDepartments(prisma: PrismaClient, tenantId: string) {
    try {
      const departments = await prisma.department.findMany({
        where: { tenantId },
        orderBy: { name: 'asc' },
      });

      return departments;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  static async updateDepartment(prisma: PrismaClient, departmentId: string, data: any) {
    try {
      const department = await prisma.department.update({
        where: { id: departmentId },
        data,
      });

      return department;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  }
}

export class LocationService {
  static async createLocation(prisma: PrismaClient, tenantId: string, data: {
    name: string;
    address: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
    phone?: string;
    timezone: string;
  }) {
    try {
      const location = await prisma.location.create({
        data: {
          tenantId,
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          zipCode: data.zipCode,
          phone: data.phone,
          timezone: data.timezone,
        },
      });

      return location;
    } catch (error) {
      console.error('Error creating location:', error);
      throw error;
    }
  }

  static async getLocations(prisma: PrismaClient, tenantId: string) {
    try {
      const locations = await prisma.location.findMany({
        where: { tenantId },
        orderBy: { name: 'asc' },
      });

      return locations;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }
}

export class JobTitleService {
  static async createJobTitle(prisma: PrismaClient, tenantId: string, data: {
    title: string;
    department: string;
    level?: string;
    description?: string;
    salary_range_min?: number;
    salary_range_max?: number;
  }) {
    try {
      const jobTitle = await prisma.jobTitle.create({
        data: {
          tenantId,
          title: data.title,
          department: data.department,
          level: data.level,
          description: data.description,
          salary_range_min: data.salary_range_min,
          salary_range_max: data.salary_range_max,
        },
      });

      return jobTitle;
    } catch (error) {
      console.error('Error creating job title:', error);
      throw error;
    }
  }

  static async getJobTitles(prisma: PrismaClient, tenantId: string, department?: string) {
    try {
      const where: any = { tenantId };
      if (department) where.department = department;

      const jobTitles = await prisma.jobTitle.findMany({
        where,
        orderBy: { title: 'asc' },
      });

      return jobTitles;
    } catch (error) {
      console.error('Error fetching job titles:', error);
      throw error;
    }
  }
}

export class PermissionService {
  static async setUserPermissions(prisma: PrismaClient, tenantId: string, userId: string, permissions: any) {
    try {
      const existing = await prisma.userPermission.findUnique({
        where: { tenantId_userId: { tenantId, userId } },
      });

      if (existing) {
        return await prisma.userPermission.update({
          where: { id: existing.id },
          data: permissions,
        });
      }

      return await prisma.userPermission.create({
        data: {
          tenantId,
          userId,
          ...permissions,
        },
      });
    } catch (error) {
      console.error('Error setting user permissions:', error);
      throw error;
    }
  }

  static async getUserPermissions(prisma: PrismaClient, userId: string) {
    try {
      const permissions = await prisma.userPermission.findUnique({
        where: { tenantId_userId: { tenantId: '', userId } }, // This needs adjustment based on context
      });

      return permissions;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      throw error;
    }
  }
}
