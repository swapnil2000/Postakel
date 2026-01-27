import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Logger } from '../utils/Logger';
import { config } from '../config';
import { masterPrisma } from '../utils/masterPrisma';

export interface EmployeeLoginData {
  companyId: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    companyId: string;
    tenantId: string;
  };
  token?: string;
}

export class EmployeeLoginService {
  /**
   * Login an employee using company ID, email, and password
   * This ensures the employee belongs to the company
   */
  static async loginEmployee(data: EmployeeLoginData): Promise<LoginResponse> {
    try {
      const { companyId, email, password } = data;

      Logger.info(
        'EmployeeLoginService',
        'loginEmployee',
        `Login attempt for ${email} with Company ID: ${companyId}`
      );

      // Step 1: Verify company exists and is active
      // Note: masterPrisma connects to admin-backend database and has companySignup model
      const company = await (masterPrisma as any).companySignup.findUnique({
        where: { companyId },
      });

      if (!company) {
        Logger.warn(
          'EmployeeLoginService',
          'loginEmployee',
          `Invalid Company ID: ${companyId}`
        );
        throw new Error('Invalid Company ID. Please check and try again.');
      }

      if (company.status !== 'active') {
        Logger.warn(
          'EmployeeLoginService',
          'loginEmployee',
          `Company not active: ${companyId}, status: ${company.status}`
        );
        throw new Error(
          `Company account is ${company.status}. Please contact support.`
        );
      }

      // Step 2: Verify email belongs to the company
      if (company.email !== email) {
        Logger.warn(
          'EmployeeLoginService',
          'loginEmployee',
          `Email mismatch for Company ID ${companyId}: provided ${email}, expected ${company.email}`
        );
        throw new Error(
          'Email does not match this company. Please verify your credentials.'
        );
      }

      // Step 3: Verify password
      const passwordMatch = await bcrypt.compare(password, company.password);

      if (!passwordMatch) {
        Logger.warn(
          'EmployeeLoginService',
          'loginEmployee',
          `Invalid password for ${email}`
        );
        throw new Error('Invalid credentials. Please check your password.');
      }

      // Step 4: Generate JWT token
      // Validate JWT secret exists
      if (!config.jwt_secret) {
        Logger.error(
          'EmployeeLoginService',
          'loginEmployee',
          'JWT_SECRET not configured'
        );
        throw new Error('Server configuration error. Please contact support.');
      }

      const token = jwt.sign(
        {
          companyId: company.companyId,
          email: company.email,
          role: 'admin',
          tenantId: company.tenantId,
        } as any,
        config.jwt_secret as any,
        {
          expiresIn: config.jwt_expiration || '7d',
        } as any
      );

      Logger.success(
        'EmployeeLoginService',
        'loginEmployee',
        `Login successful for ${email}`
      );

      return {
        success: true,
        message: 'Login successful',
        user: {
          id: company.id,
          email: company.email,
          name: company.adminName || 'Admin',
          role: 'admin',
          companyId: company.companyId,
          tenantId: company.tenantId || '',
        },
        token,
      };
    } catch (error) {
      Logger.error(
        'EmployeeLoginService',
        'loginEmployee',
        'Login failed',
        error
      );
      throw error;
    }
  }

  /**
   * Verify a JWT token
   */
  static async verifyToken(token: string): Promise<any> {
    try {
      if (!config.jwt_secret) {
        throw new Error('JWT_SECRET not configured');
      }
      const decoded = jwt.verify(token, config.jwt_secret as any);
      return decoded;
    } catch (error) {
      Logger.error(
        'EmployeeLoginService',
        'verifyToken',
        'Token verification failed',
        error
      );
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get company info by ID
   */
  static async getCompanyInfo(companyId: string): Promise<any> {
    try {
      Logger.info(
        'EmployeeLoginService',
        'getCompanyInfo',
        `Fetching info for Company ID: ${companyId}`
      );

      const company = await (masterPrisma as any).companySignup.findUnique({
        where: { companyId },
        select: {
          id: true,
          companyId: true,
          companyName: true,
          email: true,
          plan: true,
          status: true,
          createdAt: true,
          industry: true,
          companySize: true,
        },
      });

      if (!company) {
        throw new Error('Company not found');
      }

      return company;
    } catch (error) {
      Logger.error(
        'EmployeeLoginService',
        'getCompanyInfo',
        'Failed to fetch company info',
        error
      );
      throw error;
    }
  }
}

export default EmployeeLoginService;
