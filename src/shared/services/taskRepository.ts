import { BaseRepository } from './db';
import type { Task } from '../types';

class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super('tasks');
    this.seedMockDataIfNeeded();
  }

  private seedMockDataIfNeeded() {
    const list = this.getMockData();
    if (list.length === 0) {
      const now = new Date();
      const seed: Task[] = [
        {
          id: 'task-1',
          leadId: 'lead-1',
          title: 'Follow up with Apex Logistics on Quotation #1042',
          priority: 'high',
          status: 'todo',
          assignedTo: 'mock-admin',
          deadline: new Date(now.getTime() + 4 * 60 * 60 * 1000), // in 4 hours
        },
        {
          id: 'task-2',
          leadId: 'lead-1',
          title: 'Review automated SEO Audit results for designco.com',
          priority: 'medium',
          status: 'todo',
          assignedTo: 'mock-admin',
          deadline: new Date(now.getTime() + 7 * 60 * 60 * 1000), // in 7 hours
        },
      ];
      this.setMockData(seed);
    }
  }

  async listForLead(leadId: string): Promise<Task[]> {
    const list = await this.list();
    return list.filter(t => t.leadId === leadId);
  }

  subscribeForLead(leadId: string, callback: (tasks: Task[]) => void): () => void {
    return this.subscribe((items) => {
      const filtered = items.filter(t => t.leadId === leadId);
      callback(filtered);
    });
  }

  async completeTask(id: string): Promise<void> {
    await this.update(id, {
      status: 'completed',
      completedAt: new Date()
    });
  }
}

export const taskRepository = new TaskRepository();
export default taskRepository;
