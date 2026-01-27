import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { TenantContextService } from '../services/TenantService';
import TenantAuthService from '../services/AuthService';
import { AnnouncementService } from '../services/AnnouncementService';
import { ResponseUtil } from '../utils';

export class AnnouncementController {
  static async createAnnouncement(req: Request, res: Response) {
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

      const announcement = await AnnouncementService.createAnnouncement(
        tenantPrisma,
        authReq.user.userId,
        authReq.user.tenantId,
        {
          ...authReq.body,
          expiresAt: authReq.body.expiresAt ? new Date(authReq.body.expiresAt) : undefined,
        }
      );
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(announcement, 'Announcement created successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async getAnnouncements(req: Request, res: Response) {
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

      const announcements = await AnnouncementService.getAnnouncements(tenantPrisma, authReq.user.tenantId);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(announcements, 'Announcements fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }

  static async markAsViewed(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { announcementId } = authReq.params;

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

      const announcement = await AnnouncementService.markAnnouncementAsViewed(
        tenantPrisma,
        announcementId,
        authReq.user.userId
      );
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(announcement, 'Announcement marked as viewed'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }
}
