import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { UserPayload } from '../types';

export class PasswordUtil {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export class JwtUtil {
  static generateToken(payload: UserPayload): string {
    const secret = config.jwt_secret;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign(payload, secret, {
      expiresIn: config.jwt_expiration || '7d',
    } as jwt.SignOptions);
  }

  static verifyToken(token: string): UserPayload | null {
    try {
      const secret = config.jwt_secret;
      if (!secret) {
        throw new Error('JWT_SECRET is not configured');
      }
      return jwt.verify(token, secret) as UserPayload;
    } catch {
      return null;
    }
  }
}

export class StringUtil {
  static generateId(): string {
    return uuidv4();
  }

  static slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static generateSubdomain(): string {
    return `${this.slugify(new Date().getTime().toString())}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static generateDatabaseName(subdomain: string): string {
    return `postakel_${this.slugify(subdomain)}`.substring(0, 63);
  }
}

export class DateUtil {
  static getCurrentDate(): Date {
    return new Date();
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static calculateDaysDifference(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static getQuarter(date: Date): string {
    const month = date.getMonth() + 1;
    if (month <= 3) return 'Q1';
    if (month <= 6) return 'Q2';
    if (month <= 9) return 'Q3';
    return 'Q4';
  }
}

export class ValidationUtil {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export class ErrorUtil {
  static createError(statusCode: number, message: string): Error & { statusCode?: number } {
    const error = new Error(message);
    (error as any).statusCode = statusCode;
    return error;
  }
}

export class ResponseUtil {
  static success(data?: any, message: string = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, statusCode: number = 400) {
    return {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated(data: any[], total: number, page: number, limit: number) {
    return {
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export class FileUtil {
  static getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
  }

  static isAllowedFileType(filename: string, allowedTypes: string[]): boolean {
    const ext = this.getFileExtension(filename);
    return allowedTypes.includes(ext);
  }

  static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    const ext = this.getFileExtension(originalName);
    return `${timestamp}-${random}.${ext}`;
  }
}
