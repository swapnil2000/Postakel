import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { TenantContextService } from '../services/TenantService';
import TenantAuthService from '../services/AuthService';
import { TimeEntryService } from '../services/TimeEntryService';
import { ResponseUtil } from '../utils';

export class TimeTrackingController {
  static async clockIn(req: Request, res: Response) {
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

      const timeEntry = await TimeEntryService.clockIn(tenantPrisma, authReq.user.userId, authReq.user.tenantId, authReq.body);
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(timeEntry, 'Clocked in successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async clockOut(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { timeEntryId } = authReq.params;

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

      const timeEntry = await TimeEntryService.clockOut(tenantPrisma, timeEntryId);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(timeEntry, 'Clocked out successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async startBreak(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { timeEntryId } = authReq.params;

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

      const breakRecord = await TimeEntryService.startBreak(tenantPrisma, timeEntryId, authReq.body);
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(breakRecord, 'Break started successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async endBreak(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { breakId } = authReq.params;

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

      const breakRecord = await TimeEntryService.endBreak(tenantPrisma, breakId);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(breakRecord, 'Break ended successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async getTimeEntries(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { userId } = authReq.query;

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

      const entries = await TimeEntryService.getTimeEntries(
        tenantPrisma,
        authReq.user.tenantId,
        userId as string
      );
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(entries, 'Time entries fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }

  static async getTodayHours(req: Request, res: Response) {
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

      const hours = await TimeEntryService.getTodayHours(tenantPrisma, authReq.user.userId, authReq.user.tenantId);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success({ hours }, 'Today hours fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }
}
