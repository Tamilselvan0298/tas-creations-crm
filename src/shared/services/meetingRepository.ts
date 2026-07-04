import { BaseRepository } from './db';

export interface Meeting {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  date: Date;
  duration: number; // in minutes
  reminderTime?: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  meetingNotes?: string;
}

class MeetingRepository extends BaseRepository<Meeting> {
  constructor() {
    super('meetings');
    this.seedMockDataIfNeeded();
  }

  private seedMockDataIfNeeded() {
    const list = this.getMockData();
    if (list.length === 0) {
      const now = new Date();
      const seed: Meeting[] = [
        {
          id: 'meet-1',
          leadId: 'lead-1',
          title: 'Initial Discovery Call',
          description: 'Sync to map operational logistics bottlenecks.',
          date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // in 2 days
          duration: 30,
          status: 'scheduled',
        },
      ];
      this.setMockData(seed);
    }
  }

  async listForLead(leadId: string): Promise<Meeting[]> {
    const list = await this.list();
    return list.filter(m => m.leadId === leadId);
  }

  subscribeForLead(leadId: string, callback: (meetings: Meeting[]) => void): () => void {
    return this.subscribe((items) => {
      const filtered = items.filter(m => m.leadId === leadId);
      callback(filtered);
    });
  }
}

export const meetingRepository = new MeetingRepository();
export default meetingRepository;
