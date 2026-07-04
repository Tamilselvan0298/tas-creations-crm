import { BaseRepository } from './db';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, isMockFirebase } from '../lib/firebase';

export interface DashboardStats {
  id: string;
  totalLeads: number;
  newLeads: number;
  interested: number;
  meetingsToday: number;
  proposalSent: number;
  wonDeals: number;
  lostDeals: number;
  revenue: number;
  tasks: number;
  websiteAudits: number;
  seoReports: number;
  
  // Chart Arrays
  monthlyLeads: Array<{ month: string; count: number }>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  leadStatus: Array<{ status: string; count: number }>;
  leadSources: Array<{ name: string; value: number; color: string }>;
  funnel: Array<{ stage: string; count: number }>;
  weeklyActivity: Array<{ day: string; emails: number; whatsapp: number; audits: number }>;
}

const DEFAULT_SUMMARY: DashboardStats = {
  id: 'summary',
  totalLeads: 1248,
  newLeads: 24,
  interested: 182,
  meetingsToday: 12,
  proposalSent: 45,
  wonDeals: 88,
  lostDeals: 14,
  revenue: 84250,
  tasks: 4,
  websiteAudits: 156,
  seoReports: 98,
  
  monthlyLeads: [
    { month: 'Jan', count: 180 },
    { month: 'Feb', count: 210 },
    { month: 'Mar', count: 240 },
    { month: 'Apr', count: 290 },
    { month: 'May', count: 320 },
    { month: 'Jun', count: 380 },
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 49000 },
    { month: 'Mar', revenue: 58000 },
    { month: 'Apr', revenue: 64000 },
    { month: 'May', revenue: 76000 },
    { month: 'Jun', revenue: 84250 },
  ],
  leadStatus: [
    { status: 'New', count: 380 },
    { status: 'Contacted', count: 290 },
    { status: 'Interested', count: 182 },
    { status: 'Meeting', count: 88 },
    { status: 'Proposal', count: 45 },
    { status: 'Won', count: 18 },
  ],
  leadSources: [
    { name: 'SEO Audits', value: 40, color: '#0B1F3A' },
    { name: 'WhatsApp Campaigns', value: 25, color: '#D4AF37' },
    { name: 'Cold Emails', value: 20, color: '#3B82F6' },
    { name: 'Manual Entry', value: 15, color: '#10B981' },
  ],
  funnel: [
    { stage: 'New', count: 380 },
    { stage: 'Contacted', count: 290 },
    { stage: 'Interested', count: 182 },
    { stage: 'Meeting Scheduled', count: 88 },
    { stage: 'Proposal Sent', count: 45 },
    { stage: 'Negotiation', count: 24 },
    { stage: 'Won', count: 18 },
  ],
  weeklyActivity: [
    { day: 'Mon', emails: 24, whatsapp: 18, audits: 4 },
    { day: 'Tue', emails: 30, whatsapp: 22, audits: 6 },
    { day: 'Wed', emails: 45, whatsapp: 28, audits: 8 },
    { day: 'Thu', emails: 38, whatsapp: 25, audits: 5 },
    { day: 'Fri', emails: 40, whatsapp: 30, audits: 7 },
    { day: 'Sat', emails: 15, whatsapp: 10, audits: 2 },
    { day: 'Sun', emails: 5, whatsapp: 4, audits: 0 },
  ],
};

class DashboardRepository extends BaseRepository<DashboardStats> {
  constructor() {
    super('dashboard');
    this.seedMockDataIfNeeded();
  }

  private seedMockDataIfNeeded() {
    const list = this.getMockData();
    if (list.length === 0) {
      this.setMockData([DEFAULT_SUMMARY]);
    }
  }

  subscribeToSummary(callback: (stats: DashboardStats) => void): () => void {
    if (!isMockFirebase && db) {
      const docRef = doc(db, 'dashboard', 'summary');
      return onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          callback({ id: snap.id, ...snap.data() } as DashboardStats);
        } else {
          // Create default summary if it doesn't exist
          setDoc(docRef, DEFAULT_SUMMARY);
          callback(DEFAULT_SUMMARY);
        }
      });
    } else {
      callback(this.getMockSummary());
      
      const interval = setInterval(() => {
        callback(this.getMockSummary());
      }, 3000);

      return () => clearInterval(interval);
    }
  }

  private getMockSummary(): DashboardStats {
    const list = this.getMockData();
    return list.find(d => d.id === 'summary') || DEFAULT_SUMMARY;
  }

  async updateSummary(data: Partial<DashboardStats>): Promise<void> {
    await this.update('summary', data);
  }
}

export const dashboardRepository = new DashboardRepository();
export default dashboardRepository;
