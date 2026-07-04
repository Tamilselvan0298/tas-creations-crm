import { auth, isMockFirebase } from '../lib/firebase';
import { API_BASE_URL } from '../config';

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'cancelled';
  channel: 'email' | 'whatsapp' | 'sms';
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  revenue: number;
  createdAt: string;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  channel: 'email' | 'whatsapp' | 'sms';
  subject?: string;
  body: string;
}

class OutreachRepository {
  private async getAuthToken(): Promise<string> {
    if (isMockFirebase) {
      const mockRole = localStorage.getItem('tas-user-role') || 'admin';
      return `mock-${mockRole}`;
    }
    return (await auth.currentUser?.getIdToken()) || '';
  }

  async listCampaigns(): Promise<Campaign[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/outreach/campaigns`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to load campaigns.');
    return await response.json() as Campaign[];
  }

  async createCampaign(name: string, channel: string): Promise<Campaign> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/outreach/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, channel }),
    });
    if (!response.ok) throw new Error('Failed to create campaign.');
    return await response.json() as Campaign;
  }

  async listTemplates(): Promise<OutreachTemplate[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/outreach/templates`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to load templates.');
    return await response.json() as OutreachTemplate[];
  }

  async getAiCopy(
    type: 'email' | 'whatsapp' | 'call',
    context: { company: string; website?: string; category?: string }
  ): Promise<string> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/outreach/generate-copy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type, ...context }),
    });
    if (!response.ok) throw new Error('Failed to generate AI outreach copy.');
    const data = await response.json();
    return data.copy as string;
  }
}

export const outreachRepository = new OutreachRepository();
export default outreachRepository;
