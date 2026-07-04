import { auth, isMockFirebase } from '../lib/firebase';
import { BaseRepository } from './db';
import { API_BASE_URL } from '../config';

export interface AuditReport {
  id: string;
  url: string;
  status: 'online' | 'offline';
  httpStatus: number;
  https: boolean;
  responseTime: number;
  hosting: string;
  techStack: string[];
  scores: {
    performance: number;
    seo: number;
    accessibility: number;
    security: number;
  };
  seo: {
    title: string;
    description: string;
    h1: string[];
    h2: string[];
    missingAlts: number;
  };
  speed: {
    lcp: number;
    cls: number;
    tbt: number;
    pageSizeKb: number;
  };
  business: {
    phone?: string;
    email?: string;
    socials: { instagram?: string; facebook?: string; linkedin?: string };
  };
  aiAnalysis: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    salesPitch: string;
    budgetEstimate: string;
  };
  createdAt: string;
}

class AuditRepository extends BaseRepository<any> {
  constructor() {
    super('website_audits');
  }

  private async getAuthToken(): Promise<string> {
    if (isMockFirebase) {
      // Mock validation mode matches roles
      const mockRole = localStorage.getItem('tas-user-role') || 'admin';
      return `mock-${mockRole}`;
    }
    return (await auth.currentUser?.getIdToken()) || '';
  }

  async runCrawl(url: string): Promise<AuditReport> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/audit/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Failed to crawl website.');
    }

    const data = await response.json();
    return data as AuditReport;
  }

  async fetchAudits(): Promise<AuditReport[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/audit/list`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch audits.');
    }

    return await response.json() as AuditReport[];
  }
}

export const auditRepository = new AuditRepository();
export default auditRepository;
