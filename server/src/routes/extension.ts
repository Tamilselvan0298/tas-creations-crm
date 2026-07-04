import { Router, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';
import { admin, isFirebaseAdminInitialized } from '../config/firebaseAdmin';

const router = Router();

// In-memory mock database fallback
let extensionSyncLeads: any[] = [
  {
    id: 'ext-lead-1',
    company: 'Spark Cafe',
    owner: 'Unassigned',
    phone: '+1 (555) 0192',
    email: 'hello@sparkcafe.com',
    website: 'sparkcafe.com',
    address: '1042 Broadway, New York, NY',
    category: 'Coffee Shop',
    rating: 4.5,
    reviews: 142,
    createdAt: new Date().toISOString(),
  }
];

// GET /api/extension/leads - Retrieve leads captured via extension
router.get('/leads', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isFirebaseAdminInitialized) {
      res.json(extensionSyncLeads);
      return;
    }
    const db = admin.firestore();
    const snap = await db.collection('browser_extension').get();
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(list.length ? list : extensionSyncLeads);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list extension leads.' });
  }
});

// POST /api/extension/sync - Sync scraped lead payload from browser extension
router.post('/sync', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body;
  if (!payload || !payload.company) {
    res.status(400).json({ error: 'Missing lead company details.' });
    return;
  }

  const id = 'ext-lead-' + Date.now();
  const entry = {
    id,
    owner: 'Unassigned',
    createdAt: new Date().toISOString(),
    ...payload,
  };

  try {
    if (!isFirebaseAdminInitialized) {
      extensionSyncLeads.push(entry);
    } else {
      const db = admin.firestore();
      
      // Save in browser_extension log collection
      await db.collection('browser_extension').doc(id).set(entry);
      
      // Also insert in main leads collection to automatically show in Leads database table!
      const leadId = 'lead-' + Date.now();
      await db.collection('leads').doc(leadId).set({
        id: leadId,
        company: entry.company,
        owner: 'Unassigned',
        phone: entry.phone || 'N/A',
        email: entry.email || 'N/A',
        website: entry.website || 'N/A',
        address: entry.address || 'N/A',
        rating: entry.rating || 0,
        reviews: entry.reviews || 0,
        createdAt: entry.createdAt,
      });
    }

    res.json({ success: true, lead: entry });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to sync extension lead.' });
  }
});

export default router;
