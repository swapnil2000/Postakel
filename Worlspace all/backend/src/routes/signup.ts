import { Router, Request, Response } from 'express';
import { SignupWebhookService } from '../services/SignupWebhookService';

const router = Router();

/**
 * Webhook endpoint to process company signup from admin-backend
 * Called after email verification in admin-backend
 */
router.post('/webhook/process-signup', async (req: Request, res: Response) => {
  try {
    console.log('[INFO] POST /webhook/process-signup - Processing signup webhook');
    console.log('[INFO] POST /webhook/process-signup - Webhook payload:', JSON.stringify(req.body));

    const payload = req.body;

    // Validate required fields
    if (!payload.signupId || !payload.companyName || !payload.email || !payload.plan || !payload.password) {
      console.log('[WARN] POST /webhook/process-signup - Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('[INFO] POST /webhook/process-signup - All required fields present. Processing for:', payload.email);

    const result = await SignupWebhookService.processCompanySignup(payload);

    console.log('[SUCCESS] POST /webhook/process-signup - Webhook processed successfully for:', payload.email);
    console.log('[INFO] POST /webhook/process-signup - Result:', JSON.stringify(result));
    res.status(200).json(result);
  } catch (error: any) {
    console.error('[ERROR] POST /webhook/process-signup - Webhook processing failed:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Health check for webhook
 */
router.get('/webhook/health', (req: Request, res: Response) => {
  console.log('[DEBUG] GET /webhook/health - Health check');
  res.status(200).json({ status: 'ok', service: 'signup-webhook' });
});

export default router;
