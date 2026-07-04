import { BaseRepository } from './db';
import type { Notification } from '../types';
import { orderBy, QueryConstraint } from 'firebase/firestore';

class NotificationRepository extends BaseRepository<Notification> {
  constructor() {
    super('notifications');
    this.seedMockDataIfNeeded();
  }

  private seedMockDataIfNeeded() {
    const list = this.getMockData();
    if (list.length === 0) {
      const now = new Date();
      const seed: Notification[] = [
        {
          id: 'notif-1',
          recipientId: 'all',
          title: 'Lead Assigned',
          message: 'New Interested Lead "Apex Logistics" assigned to you.',
          read: false,
          type: 'lead_assigned',
          createdAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 mins ago
        },
        {
          id: 'notif-2',
          recipientId: 'all',
          title: 'Task Reminder',
          message: 'Meeting with Sarah Connor starts in 15 minutes.',
          read: false,
          type: 'meeting_scheduled',
          createdAt: new Date(now.getTime() - 30 * 60 * 1000),
        },
        {
          id: 'notif-3',
          recipientId: 'all',
          title: 'System Alert',
          message: 'Website Audit report successfully exported for designco.com.',
          read: true,
          type: 'system',
          createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
        },
      ];
      this.setMockData(seed);
    }
  }

  subscribeForUser(userId: string, callback: (notifs: Notification[]) => void): () => void {
    const constraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc')
    ];
    return this.subscribe((items) => {
      // Filter user notifications and sort desc
      const filtered = items.filter(n => n.recipientId === userId || n.recipientId === 'all')
        .sort((a, b) => {
          const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
          const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
          return timeB - timeA;
        });
      callback(filtered);
    }, constraints);
  }

  async markAsRead(id: string): Promise<void> {
    await this.update(id, { read: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    const list = this.getMockData();
    const updated = list.map(item => {
      if (item.recipientId === userId || item.recipientId === 'all') {
        return { ...item, read: true };
      }
      return item;
    });
    this.setMockData(updated);
  }
}

export const notificationRepository = new NotificationRepository();
export default notificationRepository;
