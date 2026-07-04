import { Router, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';
import { salesService } from '../services/salesService';
import { admin, isFirebaseAdminInitialized } from '../config/firebaseAdmin';

const router = Router();

// In-memory mock database fallbacks
let mockProposals = [
  {
    id: 'prop-1',
    company: 'Acme Corp',
    goal: 'Redesign and Local maps index speed optimizations',
    scope: 'Complete landing page revamp.',
    timeline: '4 Weeks.',
    deliverables: ['Responsive layout design', 'Core Web Vitals optimizations'],
    terms: '50% advance, 50% completion.',
    status: 'sent',
    views: 4,
    downloads: 1,
    signature: '',
    createdAt: new Date().toISOString(),
  }
];

let mockQuotes = [
  {
    id: 'quote-1',
    company: 'Acme Corp',
    items: [
      { name: 'Website Design & Development', price: 1500 },
      { name: 'Technical SEO Optimization', price: 800 },
      { name: 'Cloud Hosting setup (1 Year)', price: 300 }
    ],
    discount: 100,
    gstPercent: 18,
    total: 2950,
    status: 'sent',
    createdAt: new Date().toISOString(),
  }
];

let mockInvoices = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-1042',
    company: 'Acme Corp',
    amount: 2950,
    dueDate: '2026-08-15',
    status: 'pending',
    paymentLink: 'https://stripe.com/pay/tas_mock',
    qrCode: 'upi://pay?pa=tas@okaxis&pn=TASCreations&am=2950&cu=USD',
    createdAt: new Date().toISOString(),
  }
];

// POST /api/sales/generate-proposal
router.post('/generate-proposal', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { company, goal } = req.body;
  if (!company || !goal) {
    res.status(400).json({ error: 'Missing company or goal parameters.' });
    return;
  }

  try {
    const copy = await salesService.generateProposalCopy(company, goal);
    res.json(copy);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Proposal copy generation failed.' });
  }
});

// GET /api/sales/proposals
router.get('/proposals', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isFirebaseAdminInitialized) {
      res.json(mockProposals);
      return;
    }
    const db = admin.firestore();
    const snap = await db.collection('proposals').get();
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(list.length ? list : mockProposals);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list proposals.' });
  }
});

// POST /api/sales/proposals - Saves new proposal
router.post('/proposals', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const proposal = req.body;
  const id = proposal.id || 'prop-' + Date.now();
  const entry = { id, views: 0, downloads: 0, status: 'sent', signature: '', createdAt: new Date().toISOString(), ...proposal };

  try {
    if (!isFirebaseAdminInitialized) {
      mockProposals.push(entry);
    } else {
      const db = admin.firestore();
      await db.collection('proposals').doc(id).set(entry);
    }
    res.json(entry);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save proposal.' });
  }
});

// PUT /api/sales/proposals/:id/sign - Signs proposal in Client Portal
router.put('/proposals/:id/sign', async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { signature } = req.body;

  try {
    if (!isFirebaseAdminInitialized) {
      mockProposals = mockProposals.map(p => p.id === id ? { ...p, status: 'signed', signature } : p);
      res.json({ success: true });
    } else {
      const db = admin.firestore();
      await db.collection('proposals').doc(id).update({ status: 'signed', signature });
      res.json({ success: true });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to sign contract.' });
  }
});

// GET /api/sales/quotes
router.get('/quotes', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isFirebaseAdminInitialized) {
      res.json(mockQuotes);
      return;
    }
    const db = admin.firestore();
    const snap = await db.collection('quotations').get();
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(list.length ? list : mockQuotes);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list quotes.' });
  }
});

// POST /api/sales/quotes
router.post('/quotes', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const quote = req.body;
  const id = 'quote-' + Date.now();
  const entry = { id, status: 'sent', createdAt: new Date().toISOString(), ...quote };

  try {
    if (!isFirebaseAdminInitialized) {
      mockQuotes.push(entry);
    } else {
      const db = admin.firestore();
      await db.collection('quotations').doc(id).set(entry);
    }
    res.json(entry);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save quote.' });
  }
});

// GET /api/sales/invoices
router.get('/invoices', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!isFirebaseAdminInitialized) {
      res.json(mockInvoices);
      return;
    }
    const db = admin.firestore();
    const snap = await db.collection('invoices').get();
    const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(list.length ? list : mockInvoices);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to list invoices.' });
  }
});

// POST /api/sales/invoices
router.post('/invoices', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const invoice = req.body;
  const id = 'inv-' + Date.now();
  const invoiceNumber = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
  const entry = {
    id,
    invoiceNumber,
    status: 'pending',
    paymentLink: 'https://stripe.com/pay/tas_mock',
    qrCode: `upi://pay?pa=tas@okaxis&pn=TASCreations&am=${invoice.amount}&cu=USD`,
    createdAt: new Date().toISOString(),
    ...invoice
  };

  try {
    if (!isFirebaseAdminInitialized) {
      mockInvoices.push(entry);
    } else {
      const db = admin.firestore();
      await db.collection('invoices').doc(id).set(entry);
    }
    res.json(entry);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create invoice.' });
  }
});

export default router;
