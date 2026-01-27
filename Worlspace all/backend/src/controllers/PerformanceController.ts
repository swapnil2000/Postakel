import { Response } from 'express';
import { AuthRequest } from '../types';
import { TenantContextService } from '../services/TenantService';
import TenantAuthService from '../services/AuthService';
import { PerformanceService } from '../services/PerformanceService';
import { ResponseUtil } from '../utils';

export class PerformanceController {
  static async createReview(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { userId } = req.params;

      const tenant = await TenantAuthService.getTenantById(req.user.tenantId);
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

      const review = await PerformanceService.createReview(
        tenantPrisma,
        userId,
        req.user.tenantId,
        {
          ...req.body,
          reviewerId: req.user.userId,
        }
      );
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(review, 'Review created successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async getReviews(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { userId } = req.params;

      const tenant = await TenantAuthService.getTenantById(req.user.tenantId);
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

      const reviews = await PerformanceService.getReviews(tenantPrisma, userId, req.user.tenantId);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(reviews, 'Reviews fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }

  static async createGoal(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const tenant = await TenantAuthService.getTenantById(req.user.tenantId);
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

      const goal = await PerformanceService.createGoal(
        tenantPrisma,
        req.user.userId,
        req.user.tenantId,
        {
          ...req.body,
          startDate: new Date(req.body.startDate),
          endDate: new Date(req.body.endDate),
        }
      );
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(goal, 'Goal created successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async getGoals(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { status } = req.query;

      const tenant = await TenantAuthService.getTenantById(req.user.tenantId);
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

      const goals = await PerformanceService.getGoals(
        tenantPrisma,
        req.user.userId,
        req.user.tenantId,
        status as string
      );
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(goals, 'Goals fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }
}
