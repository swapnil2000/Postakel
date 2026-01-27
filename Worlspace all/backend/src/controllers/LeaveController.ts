import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { TenantContextService } from '../services/TenantService';
import TenantAuthService from '../services/AuthService';
import { LeaveService } from '../services/LeaveService';
import { ResponseUtil } from '../utils';

export class LeaveController {
  static async createLeaveRequest(req: Request, res: Response) {
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

      const leaveRequest = await LeaveService.createLeaveRequest(
        tenantPrisma,
        authReq.user.userId,
        authReq.user.tenantId,
        {
          leaveTypeId: authReq.body.leaveTypeId,
          startDate: new Date(authReq.body.startDate),
          endDate: new Date(authReq.body.endDate),
          reason: authReq.body.reason,
        }
      );
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(leaveRequest, 'Leave request created successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async approveLeaveRequest(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { leaveRequestId } = authReq.params;

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

      const leaveRequest = await LeaveService.approveLeaveRequest(tenantPrisma, leaveRequestId, authReq.user.userId);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(leaveRequest, 'Leave request approved successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async rejectLeaveRequest(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { leaveRequestId } = authReq.params;
      const { rejectionReason } = authReq.body;

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

      const leaveRequest = await LeaveService.rejectLeaveRequest(tenantPrisma, leaveRequestId, rejectionReason);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(leaveRequest, 'Leave request rejected successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async getLeaveRequests(req: Request, res: Response) {
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

      const leaves = await LeaveService.getLeaveRequests(tenantPrisma, authReq.user.tenantId, userId as string);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(leaves, 'Leave requests fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }

  static async createLeaveType(req: Request, res: Response) {
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

      const leaveType = await LeaveService.createLeaveType(tenantPrisma, authReq.user.tenantId, authReq.body);
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(leaveType, 'Leave type created successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }
}
