import { BaseRepository } from './db';
import type { Note } from '../types';

// Let's extend the Note type to support custom pin statuses
export interface CRMNote extends Note {
  pinned?: boolean;
}

class NoteRepository extends BaseRepository<CRMNote> {
  constructor() {
    super('notes');
    this.seedMockDataIfNeeded();
  }

  private seedMockDataIfNeeded() {
    const list = this.getMockData();
    if (list.length === 0) {
      const seed: CRMNote[] = [
        {
          id: 'note-1',
          leadId: 'lead-1',
          content: 'The client expressed major interest in our premium SEO packages. They want to focus on their local map indexing rankings in Illinois.',
          createdBy: 'Jordan (Sales)',
          pinned: true,
          attachments: [],
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        },
      ];
      this.setMockData(seed);
    }
  }

  async listForLead(leadId: string): Promise<CRMNote[]> {
    const list = await this.list();
    return list.filter(n => n.leadId === leadId);
  }

  subscribeForLead(leadId: string, callback: (notes: CRMNote[]) => void): () => void {
    return this.subscribe((items) => {
      const filtered = items.filter(n => n.leadId === leadId)
        .sort((a, b) => {
          // Pins at the top, then sorted chronologically desc
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          
          const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
          const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
          return timeB - timeA;
        });
      callback(filtered);
    });
  }

  async togglePin(id: string): Promise<void> {
    const note = await this.get(id);
    if (note) {
      await this.update(id, { pinned: !note.pinned });
    }
  }
}

export const noteRepository = new NoteRepository();
export default noteRepository;
