import "express";
import { User } from '../index';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      vendorId?: string;
    }
  }
}
