import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { TenantContextService } from '../services/TenantService';
import TenantAuthService from '../services/AuthService';
import { AssetService } from '../services/AssetService';
import { ResponseUtil } from '../utils';

export class AssetController {
  static async createAsset(req: Request, res: Response) {
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

      const asset = await AssetService.createAsset(
        tenantPrisma,
        authReq.user.tenantId,
        {
          ...authReq.body,
          purchaseDate: new Date(authReq.body.purchaseDate),
          warrantyExpiry: authReq.body.warrantyExpiry ? new Date(authReq.body.warrantyExpiry) : undefined,
        }
      );
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(asset, 'Asset created successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async getAssets(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { category } = authReq.query;

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

      const assets = await AssetService.getAssets(tenantPrisma, authReq.user.tenantId, category as string);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(assets, 'Assets fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }

  static async assignAsset(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { assetId } = authReq.params;
      const { userId, notes } = authReq.body;

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

      const assignment = await AssetService.assignAsset(tenantPrisma, assetId, userId, authReq.user.tenantId, notes);
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(assignment, 'Asset assigned successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async returnAsset(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { assignmentId } = authReq.params;
      const { condition } = authReq.body;

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

      const assignment = await AssetService.returnAsset(tenantPrisma, assignmentId, condition);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(assignment, 'Asset returned successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }
}
