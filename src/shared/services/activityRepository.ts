import { BaseRepository } from './db';
import type { Activity } from '../types';
import { limit, orderBy, QueryConstraint } from 'firebase/firestore';

class ActivityRepository extends BaseRepository<Activity> {
  constructor() {
    super('activities');
    this.seedMockDataIfNeeded();
  }

  private seedMockDataIfNeeded() {
    const list = this.getMockData();
    if (list.length === 0) {
      const now = new Date();
      const seed: Activity[] = [
        {
          id: 'act-1',
          leadId: 'lead-1',
          type: 'status',
          title: 'Lead "Acme Corp" status updated',
          description: 'Moved status to Interested',
          performedBy: 'Jordan (Sales)',
          timestamp: new Date(now.getTime() - 10 * 60 * 1000), // 10 mins ago
        },
        {
          id: 'act-2',
          leadId: 'lead-2',
          type: 'seo',
          title: 'SEO Audit generated',
          description: 'Generated report for quantumtech.io (Score: 84/100)',
          performedBy: 'System',
          timestamp: new Date(now.getTime() - 45 * 60 * 1000), // 45 mins ago
        },
        {
          id: 'act-3',
          leadId: 'lead-3',
          type: 'proposal',
          title: 'Proposal #294 signed by client',
          description: 'Client signed: Apex Logistics (value $12,500)',
          performedBy: 'Alex (Admin)',
          timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          id: 'act-4',
          leadId: 'lead-4',
          type: 'whatsapp',
          title: 'WhatsApp message sent',
          description: 'Template message "Followup_1" sent successfully',
          performedBy: 'Sarah (Manager)',
          timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
        },
      ];
      this.setMockData(seed);
    }
  }

  subscribeRecent(callback: (items: Activity[]) => void): () => void {
    const constraints: QueryConstraint[] = [
      orderBy('timestamp', 'desc'),
      limit(5)
    ];
    return this.subscribe((items) => {
      // In mock mode, BaseRepository.subscribe doesn't support constraints easily, so we sort & limit here.
      const sorted = [...items].sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
        const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
        return timeB - timeA;
      }).slice(0, 5);
      callback(sorted);
    }, constraints);
  }

  async log(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
    return this.create({
      ...activity,
      timestamp: new Date(),
    });
  }
}

export const activityRepository = new ActivityRepository();
export default activityRepository;
