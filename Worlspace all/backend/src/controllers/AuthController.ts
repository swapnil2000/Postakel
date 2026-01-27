import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { TenantContextService } from '../services/TenantService';
import { UserAuthService } from '../services/UserAuthService';
import { ResponseUtil } from '../utils';
import TenantAuthService from '../services/AuthService';

export class AuthController {
  static async registerTenant(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const { name, email, password, plan, industry, companySize } = authReq.body;

      const result = await TenantAuthService.registerTenant({
        name,
        email,
        password,
        plan,
        industry,
        companySize,
      });

      return res.status(201).json(ResponseUtil.success(result, 'Tenant registered successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      const { subdomain, email, password } = authReq.body;

      // Get tenant
      const tenant = await TenantAuthService.getTenantBySubdomain(subdomain);
      if (!tenant) {
        return res.status(404).json(ResponseUtil.error('Tenant not found', 404));
      }

      // Get tenant-specific prisma
      const tenantPrisma = TenantContextService.getTenantPrisma(
        tenant.dbHost,
        tenant.dbPort,
        tenant.dbName,
        tenant.dbUser,
        tenant.dbPassword
      );

      // Login user
      const result = await UserAuthService.login(tenantPrisma, email, password);

      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(result, 'Login successful'));
    } catch (error: any) {
      return res.status(401).json(ResponseUtil.error(error.message, 401));
    }
  }

  static async getCurrentUser(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const tenant = await TenantAuthService.getTenantById(authReq.user.tenantId);
      if (!tenant) {
        return res.status(404).json(ResponseUtil.error('Tenant not found', 404));
      }

      const tenantPrisma = TenantContextService.getTenantPrisma(
        tenant.dbHost,
        tenant.dbPort,
        tenant.dbName,
        tenant.dbUser,
        tenant.dbPassword
      );

      const user = await UserAuthService.getUserById(tenantPrisma, authReq.user.userId);
      await tenantPrisma.$disconnect();

      if (!user) {
        return res.status(404).json(ResponseUtil.error('User not found', 404));
      }

      return res.status(200).json(ResponseUtil.success(user, 'User fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { currentPassword, newPassword } = authReq.body;

      const tenant = await TenantAuthService.getTenantById(authReq.user.tenantId);
      if (!tenant) {
        return res.status(404).json(ResponseUtil.error('Tenant not found', 404));
      }

      const tenantPrisma = TenantContextService.getTenantPrisma(
        tenant.dbHost,
        tenant.dbPort,
        tenant.dbName,
        tenant.dbUser,
        tenant.dbPassword
      );

      await UserAuthService.changePassword(tenantPrisma, authReq.user.userId, currentPassword, newPassword);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success({}, 'Password changed successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }
}
