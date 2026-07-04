import { Router, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';
import { outreachService } from '../services/outreachService';
import { admin, isFirebaseAdminInitialized } from '../config/firebaseAdmin';

const router = Router();

// In-memory mock database fallbacks
let mockCampaigns = [
  {
    id: 'camp-1',
    name: 'SEO Audit Cold Outreach Q3',
    status: 'active',
    channel: 'email',
    sent: 120,
    opened: 84,
    clicked: 32,
    replied: 14,
    bounced: 2,
    revenue: 4500,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'camp-2',
    name: 'Speed Rebuild WhatsApp Promo',
    status: 'paused',
    channel: 'whatsapp',
    sent: 45,
    opened: 42,
    clicked: 18,
    replied: 8,
    bounced: 0,
    revenue: 1200,
    createdAt: new Date().toISOString(),
  }
];

const mockTemplates = [
  { id: 'temp-1', name: 'Website Speed Offer', channel: 'email', subject: 'Speed optimizations for {{company}}', body: 'Hi {{owner}}, We checked your mobile speeds...' },
  { id: 'temp-2', name: 'SEO Audit Report', channel: 'email', subject: 'SEO diagnostic for {{company}}', body: 'Hi {{owner}}, Your meta description tags are...' },
  { id: 'temp-3', name: 'Invoice Payment Reminder', channel: 'email', subject: 'Payment reminder: {{company}}', body: 'Hi {{owner}}, Just checking on invoice...' },
];

// POST /api/outreach/generate-copy
router.post('/generate-copy', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { type, company, website, category } = req.body;
  if (!type || !company) {
    res.status(400).json({ error: 'Missing type or company parameters.' });
    return;
  }

  try {
    const copy = await outreachService.generateCopy(type, { company, website, category });
    res.json({ copy });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Copy generation failed.' });
  }
});

// GET /api/outreach/campaigns
router.get('/campaigns', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isFirebaseAdminInitialized) {
      res.json(mockCampaigns);
      return;
    }
    const db = admin.firestore();
    const snap = await db.collection('campaigns').get();
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(list.length ? list : mockCampaigns);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list campaigns.' });
  }
});

// POST /api/outreach/campaigns
router.post('/campaigns', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { name, channel } = req.body;
  if (!name || !channel) {
    res.status(400).json({ error: 'Missing name or channel params.' });
    return;
  }

  const id = 'camp-' + Date.now();
  const newCamp = {
    id,
    name,
    channel,
    status: 'active',
    sent: 0,
    opened: 0,
    clicked: 0,
    replied: 0,
    bounced: 0,
    revenue: 0,
    createdAt: new Date().toISOString(),
  };

  try {
    if (!isFirebaseAdminInitialized) {
      mockCampaigns.push(newCamp);
    } else {
      const db = admin.firestore();
      await db.collection('campaigns').doc(id).set(newCamp);
    }
    res.json(newCamp);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create campaign.' });
  }
});

// GET /api/outreach/templates
router.get('/templates', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isFirebaseAdminInitialized) {
      res.json(mockTemplates);
      return;
    }
    const db = admin.firestore();
    const snap = await db.collection('email_templates').get();
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(list.length ? list : mockTemplates);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list templates.' });
  }
});

export default router;
