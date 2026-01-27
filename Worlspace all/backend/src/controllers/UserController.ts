import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { TenantContextService } from '../services/TenantService';
import TenantAuthService from '../services/AuthService';
import { UserAuthService } from '../services/UserAuthService';
import { ResponseUtil } from '../utils';

export class UserController {
  static async createUser(req: Request, res: Response) {
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

      const user = await UserAuthService.createUser(tenantPrisma, authReq.user.tenantId, authReq.body);
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(user, 'User created successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const tenant = await TenantAuthService.getTenantById(authReq.user!.tenantId);
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

      const users = await UserAuthService.getUsersByTenant(tenantPrisma, authReq.user!.tenantId);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(users, 'Users fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { userId } = authReq.params;

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

      const user = await UserAuthService.updateUser(tenantPrisma, userId, authReq.body);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(user, 'User updated successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { userId } = authReq.params;

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

      await UserAuthService.deleteUser(tenantPrisma, userId);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success({}, 'User deleted successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { userId } = authReq.params;

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

      const user = await UserAuthService.getUserById(tenantPrisma, userId);
      await tenantPrisma.$disconnect();

      if (!user) {
        return res.status(404).json(ResponseUtil.error('User not found', 404));
      }

      return res.status(200).json(ResponseUtil.success(user, 'User fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }
}
