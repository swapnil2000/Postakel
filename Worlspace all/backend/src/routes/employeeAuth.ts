import { Router, Request, Response } from 'express';
import { EmployeeLoginService } from '../services/EmployeeLoginService';
import { Logger } from '../utils/Logger';

const router = Router();

/**
 * POST /api/auth/employee-login
 * Login an employee using Company ID, Email, and Password
 * 
 * Request body:
 * {
 *   companyId: string,
 *   email: string,
 *   password: string
 * }
 */
router.post('/employee-login', async (req: Request, res: Response) => {
  try {
    const { companyId, email, password } = req.body;

    // Validation
    if (!companyId || !email || !password) {
      Logger.warn(
        'AuthRoute',
        'employee-login',
        'Missing required fields'
      );
      return res.status(400).json({
        success: false,
        message: 'Company ID, Email, and Password are required',
      });
    }

    Logger.info(
      'AuthRoute',
      'employee-login',
      `Login request from ${email}`
    );

    const result = await EmployeeLoginService.loginEmployee({
      companyId,
      email,
      password,
    });

    Logger.success(
      'AuthRoute',
      'employee-login',
      `User ${email} logged in successfully`
    );

    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    Logger.error('AuthRoute', 'employee-login', message, error);

    return res.status(401).json({
      success: false,
      message,
    });
  }
});

/**
 * POST /api/auth/verify-token
 * Verify a JWT token
 * 
 * Request body:
 * {
 *   token: string
 * }
 */
router.post('/verify-token', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    const decoded = await EmployeeLoginService.verifyToken(token);

    return res.status(200).json({
      success: true,
      message: 'Token is valid',
      data: decoded,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Token verification failed';
    Logger.error('AuthRoute', 'verify-token', message, error);

    return res.status(401).json({
      success: false,
      message,
    });
  }
});

/**
 * GET /api/auth/company-info/:companyId
 * Get company information by Company ID
 */
router.get('/company-info/:companyId', async (req: Request, res: Response) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: 'Company ID is required',
      });
    }

    Logger.info('AuthRoute', 'company-info', `Fetching info for ${companyId}`);

    const company = await EmployeeLoginService.getCompanyInfo(companyId);

    return res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch company info';
    Logger.error('AuthRoute', 'company-info', message, error);

    return res.status(404).json({
      success: false,
      message,
    });
  }
});

export default router;
