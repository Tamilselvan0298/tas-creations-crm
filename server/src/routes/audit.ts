import { Router, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';
import { auditService } from '../services/auditService';
import { admin, isFirebaseAdminInitialized } from '../config/firebaseAdmin';

const router = Router();
let mockDbAudits: any[] = [];

// POST /api/audit/run - Triggers a website audit crawl
router.post('/run', authenticateJWT, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { url } = req.body;
  if (!url) {
    res.status(400).json({ error: 'Missing website URL parameter.' });
    return;
  }

  try {
    const result = await auditService.analyzeWebsite(url);
    const id = 'audit-' + Date.now();
    const dbEntry = { id, ...result, createdAt: new Date().toISOString() };

    if (!isFirebaseAdminInitialized) {
      mockDbAudits.push(dbEntry);
    } else {
      const db = admin.firestore();
      
      // Save in Firestore website_audits
      await db.collection('website_audits').doc(id).set(dbEntry);
      
      // Save corresponding sub-records in seo_reports
      await db.collection('seo_reports').doc(`seo-${id}`).set({
        id: `seo-${id}`,
        auditId: id,
        ...result.seo,
        createdAt: new Date().toISOString()
      });

      // Save performance records
      await db.collection('performance_reports').doc(`perf-${id}`).set({
        id: `perf-${id}`,
        auditId: id,
        ...result.speed,
        scores: result.scores,
        createdAt: new Date().toISOString()
      });
    }

    res.json(dbEntry);
  } catch (err: any) {
    console.error('Audit handler failed:', err);
    res.status(500).json({ error: err.message || 'Audit compilation failed.' });
  }
});

// GET /api/audit/list - Returns completed audits list
router.get('/list', authenticateJWT, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!isFirebaseAdminInitialized) {
      res.json(mockDbAudits);
      return;
    }

    const db = admin.firestore();
    const snap = await db.collection('website_audits').get();
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list audit reports.' });
  }
});

export default router;
