import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { TenantContextService } from '../services/TenantService';
import TenantAuthService from '../services/AuthService';
import { TaskService } from '../services/TaskService';
import { ResponseUtil } from '../utils';

export class TaskController {
  static async createTask(req: Request, res: Response) {
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

      const task = await TaskService.createTask(
        tenantPrisma,
        authReq.user.userId,
        authReq.user.tenantId,
        {
          ...authReq.body,
          dueDate: authReq.body.dueDate ? new Date(authReq.body.dueDate) : undefined,
        }
      );
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(task, 'Task created successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async getTasks(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { userId, status } = authReq.query;

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

      const tasks = await TaskService.getTasks(
        tenantPrisma,
        authReq.user.tenantId,
        userId as string,
        status as string
      );
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(tasks, 'Tasks fetched successfully'));
    } catch (error: any) {
      return res.status(500).json(ResponseUtil.error(error.message, 500));
    }
  }

  static async updateTask(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { taskId } = authReq.params;

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

      const task = await TaskService.updateTask(tenantPrisma, taskId, {
        ...authReq.body,
        dueDate: authReq.body.dueDate ? new Date(authReq.body.dueDate) : undefined,
      });
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(task, 'Task updated successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async completeTask(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { taskId } = authReq.params;

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

      const task = await TaskService.completeTask(tenantPrisma, taskId);
      await tenantPrisma.$disconnect();

      return res.status(200).json(ResponseUtil.success(task, 'Task completed successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }

  static async addTaskComment(req: Request, res: Response) {
    try {
      const authReq = req as AuthRequest;
      if (!authReq.user) {
        return res.status(401).json(ResponseUtil.error('Not authenticated', 401));
      }

      const { taskId } = authReq.params;
      const { content } = authReq.body;

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

      const comment = await TaskService.addTaskComment(
        tenantPrisma,
        taskId,
        authReq.user.userId,
        authReq.user.tenantId,
        content
      );
      await tenantPrisma.$disconnect();

      return res.status(201).json(ResponseUtil.success(comment, 'Comment added successfully'));
    } catch (error: any) {
      return res.status(400).json(ResponseUtil.error(error.message, 400));
    }
  }
}
