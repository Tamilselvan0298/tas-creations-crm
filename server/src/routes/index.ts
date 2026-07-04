import { Router, Response } from 'express';
import { authenticateJWT, authorizeRoles, AuthenticatedRequest } from '../middleware/auth';
import { isFirebaseAdminInitialized, initError, parsedKeyStats } from '../config/firebaseAdmin';

const router = Router();
// Public health check route
router.get('/health', (_, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TAS Outreach CRM API',
    firebaseAdminInitialized: isFirebaseAdminInitialized,
    firebaseError: initError,
    parsedKeyStats: parsedKeyStats,
    hasServiceAccountKey: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    serviceAccountKeyLength: process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? process.env.FIREBASE_SERVICE_ACCOUNT_JSON.length : 0,
    serviceAccountKeyPrefix: process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? process.env.FIREBASE_SERVICE_ACCOUNT_JSON.substring(0, 30) : 'none',
  });
});

// Secure profile route (any authenticated user)
router.get('/profile', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    message: 'Access granted to secure profile.',
    user: req.user,
  });
});

// Admin-only test route (demonstrating role authorization)
router.get(
  '/admin-only',
  authenticateJWT,
  authorizeRoles(['admin']),
  (req: AuthenticatedRequest, res: Response) => {
    res.json({
      message: 'Welcome Administrator. Access granted.',
      user: req.user,
    });
  }
);

import auditRouter from './audit';
import outreachRouter from './outreach';
import salesRouter from './sales';
import aiRouter from './ai';
import extensionRouter from './extension';

router.use('/audit', auditRouter);
router.use('/outreach', outreachRouter);
router.use('/sales', salesRouter);
router.use('/ai', aiRouter);
router.use('/extension', extensionRouter);

export default router;
