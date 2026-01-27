import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { PasswordUtil, StringUtil } from '../utils';
import { EmailService } from './EmailService';

const masterPrisma = new PrismaClient({
  datasources: {
    db: {
      url: config.database_url,
    },
  },
});

export class TenantAuthService {
  static async registerTenant(tenantData: {
    name: string;
    email: string;
    password: string;
    plan: string;
    industry?: string;
    companySize?: string;
  }) {
    try {
      const { name, email, password, plan } = tenantData;

      // Check if email already exists
      const existingTenant = await masterPrisma.tenant.findFirst({
        where: {
          email: email,
        },
      });

      if (existingTenant) {
        throw new Error('Email already registered');
      }

      // Generate unique subdomain
      const baseSubdomain = StringUtil.slugify(name);
      let subdomain = baseSubdomain;
      let counter = 1;

      while (await masterPrisma.tenant.findUnique({ where: { subdomain } })) {
        subdomain = `${baseSubdomain}-${counter}`;
        counter++;
      }

      // TODO: Create tenant database
      // For now, using master database for all tenants
      const dbName = StringUtil.generateDatabaseName(subdomain);

      const hashedPassword = await PasswordUtil.hashPassword(password);

      const tenant = await masterPrisma.tenant.create({
        data: {
          subdomain,
          name,
          email,
          phone: '',
          timezone: 'Asia/Kolkata',
          currency: 'INR',
          currencySymbol: '₹',
          country: 'India',
          plan,
          dbName,
          dbUser: 'postgres',
          dbPassword: '',
          dbHost: config.tenant_db_host,
          dbPort: config.tenant_db_port,
          dateFormat: 'DD/MM/YYYY',
          timeFormat: '12',
          weekStartsOn: 'Monday',
          language: 'en',
          subscriptionStatus: 'trial',
          startDate: new Date(),
          trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          maxEmployees: plan === 'enterprise' ? 50 : plan === 'professional' ? 25 : 10,
        },
      });

      // Create admin user for tenant
      // TODO: This should be created in tenant database
      // For now using master database

      return {
        tenantId: tenant.id,
        subdomain: tenant.subdomain,
        name: tenant.name,
        email: tenant.email,
        plan: tenant.plan,
      };
    } catch (error) {
      console.error('Error registering tenant:', error);
      throw error;
    }
  }

  static async getTenantBySubdomain(subdomain: string) {
    try {
      const tenant = await masterPrisma.tenant.findUnique({
        where: { subdomain },
      });
      return tenant;
    } catch (error) {
      console.error('Error fetching tenant:', error);
      throw error;
    }
  }

  static async getTenantById(tenantId: string) {
    try {
      const tenant = await masterPrisma.tenant.findUnique({
        where: { id: tenantId },
      });
      return tenant;
    } catch (error) {
      console.error('Error fetching tenant:', error);
      throw error;
    }
  }

  static async updateTenantSettings(tenantId: string, settings: any) {
    try {
      const tenant = await masterPrisma.tenant.update({
        where: { id: tenantId },
        data: {
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          website: settings.website,
          timezone: settings.timezone,
          currency: settings.currency,
          currencySymbol: settings.currencySymbol,
          dateFormat: settings.dateFormat,
          timeFormat: settings.timeFormat,
          theme: settings.theme,
        },
      });

      return tenant;
    } catch (error) {
      console.error('Error updating tenant settings:', error);
      throw error;
    }
  }
}

export default TenantAuthService;
