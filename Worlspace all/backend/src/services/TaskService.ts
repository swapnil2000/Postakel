import { PrismaClient } from '@prisma/client';

export class TaskService {
  static async createTask(prisma: PrismaClient, userId: string, tenantId: string, data: {
    title: string;
    description?: string;
    assignedToId?: string;
    dueDate?: Date;
    priority?: string;
    project?: string;
    tags?: string[];
  }) {
    try {
      const task = await prisma.task.create({
        data: {
          tenantId,
          createdById: userId,
          title: data.title,
          description: data.description,
          assignedToId: data.assignedToId,
          dueDate: data.dueDate,
          priority: data.priority || 'medium',
          project: data.project,
          tags: data.tags || [],
        },
      });

      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async updateTask(prisma: PrismaClient, taskId: string, data: any) {
    try {
      const task = await prisma.task.update({
        where: { id: taskId },
        data,
      });

      return task;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async getTasks(prisma: PrismaClient, tenantId: string, userId?: string, status?: string) {
    try {
      const where: any = { tenantId };
      if (userId) {
        where.OR = [
          { createdById: userId },
          { assignedToId: userId },
        ];
      }
      if (status) where.status = status;

      const tasks = await prisma.task.findMany({
        where,
        include: { createdBy: true, assignedTo: true, checklist: true, comments: true },
        orderBy: { dueDate: 'asc' },
      });

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  static async completeTask(prisma: PrismaClient, taskId: string) {
    try {
      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          status: 'done',
          completedAt: new Date(),
        },
      });

      return task;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  static async addTaskComment(prisma: PrismaClient, taskId: string, userId: string, tenantId: string, content: string) {
    try {
      const comment = await prisma.taskComment.create({
        data: {
          taskId,
          userId,
          tenantId,
          content,
        },
      });

      return comment;
    } catch (error) {
      console.error('Error adding task comment:', error);
      throw error;
    }
  }

  static async addTaskChecklistItem(prisma: PrismaClient, taskId: string, tenantId: string, title: string) {
    try {
      const item = await prisma.taskChecklist.create({
        data: {
          taskId,
          tenantId,
          title,
        },
      });

      return item;
    } catch (error) {
      console.error('Error adding checklist item:', error);
      throw error;
    }
  }

  static async completeChecklistItem(prisma: PrismaClient, checklistItemId: string) {
    try {
      const item = await prisma.taskChecklist.update({
        where: { id: checklistItemId },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });

      return item;
    } catch (error) {
      console.error('Error completing checklist item:', error);
      throw error;
    }
  }
}
