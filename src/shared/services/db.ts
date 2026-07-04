import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  onSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db, isMockFirebase } from '../lib/firebase';

export class BaseRepository<T extends { id: string }> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected getMockData(): T[] {
    const data = localStorage.getItem(`tas_mock_${this.collectionName}`);
    return data ? JSON.parse(data) : [];
  }

  protected setMockData(data: T[]) {
    localStorage.setItem(`tas_mock_${this.collectionName}`, JSON.stringify(data));
  }

  async get(id: string): Promise<T | null> {
    if (!isMockFirebase && db) {
      const snap = await getDoc(doc(db, this.collectionName, id));
      return snap.exists() ? ({ id: snap.id, ...snap.data() } as T) : null;
    } else {
      return this.getMockData().find(item => item.id === id) || null;
    }
  }

  async list(constraints: QueryConstraint[] = []): Promise<T[]> {
    if (!isMockFirebase && db) {
      const q = query(collection(db, this.collectionName), ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as T));
    } else {
      // Basic mock listing
      return this.getMockData();
    }
  }

  async create(data: Omit<T, 'id'> & { id?: string }): Promise<T> {
    const id = data.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem = { ...data, id } as T;

    if (!isMockFirebase && db) {
      await setDoc(doc(db, this.collectionName, id), data);
      return newItem;
    } else {
      const list = this.getMockData();
      list.push(newItem);
      this.setMockData(list);
      return newItem;
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    if (!isMockFirebase && db) {
      await updateDoc(doc(db, this.collectionName, id), data as any);
    } else {
      const list = this.getMockData();
      const idx = list.findIndex(item => item.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        this.setMockData(list);
      }
    }
  }

  async delete(id: string): Promise<void> {
    if (!isMockFirebase && db) {
      await deleteDoc(doc(db, this.collectionName, id));
    } else {
      const list = this.getMockData();
      const filtered = list.filter(item => item.id !== id);
      this.setMockData(filtered);
    }
  }

  subscribe(callback: (items: T[]) => void, constraints: QueryConstraint[] = []): () => void {
    if (!isMockFirebase && db) {
      const q = query(collection(db, this.collectionName), ...constraints);
      return onSnapshot(q, (snap) => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as T));
        callback(items);
      });
    } else {
      // Simulate real-time mock data updates
      callback(this.getMockData());
      
      const interval = setInterval(() => {
        callback(this.getMockData());
      }, 2000);

      return () => clearInterval(interval);
    }
  }
}
export default BaseRepository;
