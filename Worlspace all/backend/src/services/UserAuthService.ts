import { PrismaClient } from '@prisma/client';
import { PasswordUtil, StringUtil, JwtUtil } from '../utils';
import { EmailService } from './EmailService';

export class UserAuthService {
  static async login(prisma: PrismaClient, email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (user.status !== 'active') {
        throw new Error('User account is not active');
      }

      const isPasswordValid = await PasswordUtil.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      const token = JwtUtil.generateToken({
        userId: user.id,
        tenantId: user.tenantId,
        email: user.email,
        role: user.role as any,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  static async createUser(
    prisma: PrismaClient,
    tenantId: string,
    userData: {
      email: string;
      password?: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role?: 'admin' | 'employee';
      department?: string;
      title?: string;
      manager?: string;
      employmentType?: string;
      startDate?: Date;
    }
  ) {
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error('Email already exists');
      }

      const tempPassword = StringUtil.generateId().substring(0, 12);
      const hashedPassword = await PasswordUtil.hashPassword(userData.password || tempPassword);

      const user = await prisma.user.create({
        data: {
          tenantId,
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: `${userData.firstName} ${userData.lastName}`,
          phone: userData.phone,
          role: userData.role || 'employee',
          department: userData.department,
          title: userData.title,
          manager: userData.manager,
          employmentType: userData.employmentType,
          startDate: userData.startDate || new Date(),
          status: 'active',
        },
      });

      // Send welcome email
      try {
        // await EmailService.sendWelcomeEmail(
        //   userData.email,
        //   userData.firstName,
        //   'Your Company',
        //   userData.password || tempPassword
        // );
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't throw, user is already created
      }

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async updateUser(prisma: PrismaClient, userId: string, userData: any) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: userData,
      });

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async getUserById(prisma: PrismaClient, userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async getUsersByTenant(prisma: PrismaClient, tenantId: string) {
    try {
      const users = await prisma.user.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      });

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async deleteUser(prisma: PrismaClient, userId: string) {
    try {
      await prisma.user.delete({
        where: { id: userId },
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  static async changePassword(prisma: PrismaClient, userId: string, currentPassword: string, newPassword: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await PasswordUtil.comparePassword(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      const hashedPassword = await PasswordUtil.hashPassword(newPassword);
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          passwordChangedAt: new Date(),
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
}
