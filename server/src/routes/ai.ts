import { Router, Response } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middleware/auth';
import { aiService } from '../services/aiService';
import { admin, isFirebaseAdminInitialized } from '../config/firebaseAdmin';

const router = Router();

// POST /api/ai/chat
router.post('/chat', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Missing or invalid messages parameter.' });
    return;
  }

  try {
    const reply = await aiService.chatResponse(messages);
    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Chat generation failed.' });
  }
});

// POST /api/ai/score-lead
router.post('/score-lead', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { factors } = req.body;
  if (!factors) {
    res.status(400).json({ error: 'Missing factors parameter.' });
    return;
  }

  try {
    const report = await aiService.scoreLead(factors);
    
    // Log to Firestore if active
    if (isFirebaseAdminInitialized) {
      const db = admin.firestore();
      await db.collection('lead_scores').add({
        factors,
        report,
        createdAt: new Date().toISOString(),
      });
    }

    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Lead scoring failed.' });
  }
});

// POST /api/ai/competitor
router.post('/competitor', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { company, website } = req.body;
  if (!company) {
    res.status(400).json({ error: 'Missing company parameter.' });
    return;
  }

  try {
    const report = await aiService.analyzeCompetitors(company, website || '');
    
    if (isFirebaseAdminInitialized) {
      const db = admin.firestore();
      await db.collection('ai_reports').add({
        type: 'competitor',
        company,
        report,
        createdAt: new Date().toISOString(),
      });
    }

    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Competitor scan failed.' });
  }
});

// POST /api/ai/meeting
router.post('/meeting', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  const { transcript } = req.body;
  if (!transcript) {
    res.status(400).json({ error: 'Missing transcript parameter.' });
    return;
  }

  try {
    const report = await aiService.summarizeMeeting(transcript);
    
    if (isFirebaseAdminInitialized) {
      const db = admin.firestore();
      await db.collection('meeting_summaries').add({
        transcript,
        report,
        createdAt: new Date().toISOString(),
      });
    }

    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Meeting digestion failed.' });
  }
});

export default router;
