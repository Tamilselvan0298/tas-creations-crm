import { auth, isMockFirebase } from '../lib/firebase';
import { API_BASE_URL } from '../config';

export interface AiChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface LeadScoreReport {
  score: number;
  opportunity: 'High' | 'Medium' | 'Low';
  reasoning: string;
}

export interface CompetitorReport {
  competitors: string[];
  strengths: string[];
  weaknesses: string[];
  suggestion: string;
}

export interface MeetingSummaryReport {
  summary: string;
  actionItems: string[];
  followUps: string[];
}

class AiRepository {
  private async getAuthToken(): Promise<string> {
    if (isMockFirebase) {
      const mockRole = localStorage.getItem('tas-user-role') || 'admin';
      return `mock-${mockRole}`;
    }
    return (await auth.currentUser?.getIdToken()) || '';
  }

  async sendChatMessage(messages: AiChatMessage[]): Promise<string> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ messages }),
    });
    if (!response.ok) throw new Error('Failed to send AI chat message.');
    const data = await response.json();
    return data.reply as string;
  }

  async scoreLead(factors: {
    hasWebsite: boolean;
    reviewsCount: number;
    googleRating: number;
    hasMetaPixel: boolean;
    hasGtm: boolean;
    pageSpeed: number;
    ssl: boolean;
  }): Promise<LeadScoreReport> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/ai/score-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ factors }),
    });
    if (!response.ok) throw new Error('Failed to score prospect lead.');
    return await response.json() as LeadScoreReport;
  }

  async scanCompetitors(company: string, website?: string): Promise<CompetitorReport> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/ai/competitor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ company, website }),
    });
    if (!response.ok) throw new Error('Failed to scan competitors.');
    return await response.json() as CompetitorReport;
  }

  async digestMeetingTranscript(transcript: string): Promise<MeetingSummaryReport> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/ai/meeting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ transcript }),
    });
    if (!response.ok) throw new Error('Failed to summarize meeting.');
    return await response.json() as MeetingSummaryReport;
  }
}

export const aiRepository = new AiRepository();
export default aiRepository;
