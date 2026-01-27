import axios from 'axios';
import { TenantContextService } from './TenantService';
import { PrismaClient } from '@prisma/client';

export interface CompanySignupPayload {
  signupId: string;
  companyId: string; // Unique company identifier
  companyName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  industry?: string;
  companySize?: string;
  plan: string;
  adminName?: string;
  password: string;
}

export class SignupWebhookService {
  static async processCompanySignup(payload: CompanySignupPayload): Promise<any> {
    try {
      console.log('[INFO] SignupWebhookService.processCompanySignup - Starting signup processing');
      console.log('[INFO] SignupWebhookService.processCompanySignup - Email:', payload.email, 'Company:', payload.companyName);

      // Step 1: Create tenant database entry in backend master database
      console.log('[INFO] SignupWebhookService.processCompanySignup - Step 1: Creating tenant in backend database');
      const tenantData = await this.createTenantInBackend(payload);
      console.log('[SUCCESS] SignupWebhookService.processCompanySignup - Step 1 complete: Tenant created. Subdomain:', tenantData.subdomain);

      // Step 2: Notify admin-backend to activate the account
      console.log('[INFO] SignupWebhookService.processCompanySignup - Step 2: Notifying admin backend for activation');
      await this.notifyAdminBackendActivation(payload.signupId, tenantData.id);
      console.log('[SUCCESS] SignupWebhookService.processCompanySignup - Step 2 complete: Admin backend notified');

      // Step 3: Initialize tenant database with admin user
      console.log('[INFO] SignupWebhookService.processCompanySignup - Step 3: Initializing tenant database');
      await this.initializeTenantDatabase(tenantData, payload);
      console.log('[SUCCESS] SignupWebhookService.processCompanySignup - Step 3 complete: Tenant database initialized');

      console.log('[SUCCESS] SignupWebhookService.processCompanySignup - Signup processing complete for:', payload.email);

      const result = {
        success: true,
        tenantId: tenantData.id,
        subdomain: tenantData.subdomain,
        message: 'Signup processed successfully',
      };
      console.log('[INFO] SignupWebhookService.processCompanySignup - Returning result');
      return result;
    } catch (error) {
      console.error('[ERROR] SignupWebhookService.processCompanySignup - Signup processing failed for:', payload.email, error);
      throw error;
    }
  }

  private static async createTenantInBackend(payload: CompanySignupPayload): Promise<any> {
    try {
      console.log('[INFO] SignupWebhookService.createTenantInBackend - Creating tenant for:', payload.companyName);
      console.log('[INFO] SignupWebhookService.createTenantInBackend - Database URL configured');

      const masterPrisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
      console.log('[INFO] SignupWebhookService.createTenantInBackend - Master Prisma client initialized');

      // Generate subdomain
      console.log('[INFO] SignupWebhookService.createTenantInBackend - Generating subdomain');
      const baseSubdomain = payload.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      let subdomain = baseSubdomain;
      let counter = 1;

      while (await masterPrisma.tenant.findUnique({ where: { subdomain } })) {
        subdomain = `${baseSubdomain}-${counter}`;
        counter++;
      }
      console.log('[INFO] SignupWebhookService.createTenantInBackend - Subdomain assigned:', subdomain);

      const dbName = `postakel_${subdomain}`;
      console.log('[INFO] SignupWebhookService.createTenantInBackend - Database name:', dbName);

      console.log('[INFO] SignupWebhookService.createTenantInBackend - Saving tenant record to database');
      const tenant = await masterPrisma.tenant.create({
        data: {
          subdomain,
          name: payload.companyName,
          email: payload.email,
          phone: payload.phone || '',
          address: payload.address || '',
          country: payload.country,
          industry: payload.industry,
          companySize: payload.companySize,
          plan: payload.plan,
          dbName,
          dbUser: process.env.TENANT_DB_USER || 'postgres',
          dbPassword: process.env.TENANT_DB_PASSWORD || '',
          dbHost: process.env.TENANT_DB_HOST || 'localhost',
          dbPort: parseInt(process.env.TENANT_DB_PORT || '5432'),
          timezone: 'Asia/Kolkata',
          currency: 'INR',
          currencySymbol: '₹',
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '12',
          weekStartsOn: 'Monday',
          language: 'en',
          subscriptionStatus: 'active',
          startDate: new Date(),
          trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          maxEmployees: this.getMaxEmployees(payload.plan),
        },
      });

      await masterPrisma.$disconnect();

      console.log('[SUCCESS] SignupWebhookService.createTenantInBackend - Tenant record created. ID:', tenant.id, 'Subdomain:', subdomain);
      console.log('[INFO] SignupWebhookService.createTenantInBackend - Tenant details - Plan:', tenant.plan, 'Status:', tenant.subscriptionStatus);

      return tenant;
    } catch (error) {
      console.error('[ERROR] SignupWebhookService.createTenantInBackend - Tenant creation failed for', payload.companyName, error);
      throw error;
    }
  }

  private static async notifyAdminBackendActivation(signupId: string, tenantId: string): Promise<void> {
    try {
      console.log('[INFO] SignupWebhookService.notifyAdminBackendActivation - Sending activation request');
      console.log('[INFO] SignupWebhookService.notifyAdminBackendActivation - SignupId:', signupId, 'TenantId:', tenantId);

      const adminBackendUrl = process.env.ADMIN_BACKEND_URL || 'http://localhost:4001';
      console.log('[INFO] SignupWebhookService.notifyAdminBackendActivation - Admin backend URL:', adminBackendUrl);

      const response = await axios.post(`${adminBackendUrl}/api/signup/activate`, {
        signupId,
        tenantId,
      });

      console.log('[SUCCESS] SignupWebhookService.notifyAdminBackendActivation - Activation request successful');
      console.log('[INFO] SignupWebhookService.notifyAdminBackendActivation - Response status:', response.status);
    } catch (error) {
      console.error('[ERROR] SignupWebhookService.notifyAdminBackendActivation - Activation request failed', error);
      // Don't throw - continue with tenant database initialization
    }
  }

  private static async initializeTenantDatabase(tenant: any, payload: CompanySignupPayload): Promise<void> {
    try {
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - Initializing database for:', tenant.subdomain);
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - Tenant credentials - Host:', tenant.dbHost, 'Port:', tenant.dbPort, 'DB:', tenant.dbName);

      // Get tenant-specific Prisma client
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - Getting tenant-specific Prisma client');
      const tenantPrisma = TenantContextService.getTenantPrisma(
        tenant.dbHost,
        tenant.dbPort,
        tenant.dbName,
        tenant.dbUser,
        tenant.dbPassword
      );
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - Tenant Prisma client initialized');

      // Create admin user in tenant database
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - Creating admin user with email:', payload.email);
      const adminUser = await tenantPrisma.user.create({
        data: {
          tenantId: tenant.id,
          firstName: (payload.adminName || 'Admin').split(' ')[0],
          lastName: (payload.adminName || 'Admin').split(' ')[1] || '',
          fullName: payload.adminName || 'Admin',
          email: payload.email,
          password: payload.password, // Password should already be hashed from signup
          role: 'admin',
          status: 'active',
          title: 'Administrator',
          department: 'Administration',
          location: payload.city || 'Headquarters',
          startDate: new Date(),
        },
      });

      console.log('[SUCCESS] SignupWebhookService.initializeTenantDatabase - Admin user created. ID:', adminUser.id, 'Email:', adminUser.email);

      // Create admin user permissions with all access
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - Creating admin permissions for user:', adminUser.id);
      const adminPermissions = await tenantPrisma.userPermission.create({
        data: {
          tenantId: tenant.id,
          userId: adminUser.id,
          // Dashboard
          dashboardView: true,
          dashboardCompanyStats: true,
          dashboardTeamStats: true,
          // Time Tracking
          timetrackerView: true,
          timetrackerCreate: true,
          timetrackerEdit: true,
          timetrackerExport: true,
          timetrackerApprove: true,
          timetrackerScope: 'all',
          // Leave
          leaveView: true,
          leaveCreate: true,
          leaveEdit: true,
          leaveDelete: true,
          leaveApprove: true,
          leaveManage: true,
          leaveScope: 'all',
          // Tasks
          tasksView: true,
          tasksCreate: true,
          tasksEdit: true,
          tasksDelete: true,
          tasksAssign: true,
          tasksScope: 'all',
          // Team
          teamView: true,
          teamEdit: true,
          teamManage: true,
          teamScope: 'all',
          // Salary
          salaryView: true,
          salaryEdit: true,
          salaryManage: true,
          // Performance
          performanceView: true,
          performanceCreate: true,
          performanceEdit: true,
          performanceManage: true,
          // Assets
          assetView: true,
          assetCreate: true,
          assetEdit: true,
          assetDelete: true,
          // Reports
          reportView: true,
          reportCreate: true,
          reportManage: true,
          // Settings
          settingsView: true,
          settingsEdit: true,
          settingsManage: true,
          // Users
          usersManage: true,
        },
      });

      console.log('[SUCCESS] SignupWebhookService.initializeTenantDatabase - Admin permissions created. ID:', adminPermissions.id);
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - All 50+ permissions enabled for admin user');

      // Create default departments
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - Creating default departments');
      const dept1 = await tenantPrisma.department.create({
        data: {
          tenantId: tenant.id,
          name: 'Administration',
          description: 'Administrative Department',
          head: adminUser.id,
        },
      });
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - Department created: Administration, ID:', dept1.id);

      const dept2 = await tenantPrisma.department.create({
        data: {
          tenantId: tenant.id,
          name: 'Operations',
          description: 'Operations Department',
          head: adminUser.id,
        },
      });
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - Department created: Operations, ID:', dept2.id);

      await tenantPrisma.$disconnect();

      console.log('[SUCCESS] SignupWebhookService.initializeTenantDatabase - Tenant database initialization complete');
      console.log('[INFO] SignupWebhookService.initializeTenantDatabase - Summary - AdminUser:', adminUser.id, 'Permissions:', adminPermissions.id, 'Departments: 2');
    } catch (error) {
      console.error('[ERROR] SignupWebhookService.initializeTenantDatabase - Database initialization failed for', tenant?.subdomain, error);
      throw error;
    }
  }

  private static getMaxEmployees(plan: string): number {
    const planLimits: Record<string, number> = {
      free: 5,
      starter: 10,
      professional: 25,
      enterprise: 50,
    };
    return planLimits[plan] || 10;
  }
}
