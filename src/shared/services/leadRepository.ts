import { BaseRepository } from './db';
import type { Lead, LeadStatus } from '../types';
import { companyRepository } from './companyRepository';
import { orderBy } from 'firebase/firestore';

const SEED_LEADS: Lead[] = [
  { id: 'lead-1', companyId: 'comp-1', status: 'new', assignedTo: 'mock-admin', tags: ['Hot', 'Potential'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'lead-2', companyId: 'comp-2', status: 'interested', assignedTo: 'mock-sales', tags: ['VIP'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'lead-3', companyId: 'comp-3', status: 'meeting', assignedTo: 'mock-manager', tags: ['Warm'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'lead-4', companyId: 'comp-4', status: 'contacted', assignedTo: 'mock-sales', tags: ['Cold'], createdAt: new Date(), updatedAt: new Date() },
  { id: 'lead-5', companyId: 'comp-5', status: 'proposal_sent', assignedTo: 'mock-admin', tags: ['Priority'], createdAt: new Date(), updatedAt: new Date() },
];

class LeadRepository extends BaseRepository<Lead> {
  constructor() {
    super('leads');
    this.seedMockDataIfNeeded();
  }

  private seedMockDataIfNeeded() {
    const list = this.getMockData();
    if (list.length === 0) {
      this.setMockData(SEED_LEADS);
    }
  }

  // Subscribe to leads and populate company details in real-time
  subscribeWithCompanies(callback: (leads: Lead[]) => void): () => void {
    return this.subscribe(async (rawLeads) => {
      const companies = await companyRepository.list();
      const populated = rawLeads.map(lead => ({
        ...lead,
        company: companies.find(c => c.id === lead.companyId)
      }));
      callback(populated);
    }, [orderBy('createdAt', 'desc')]);
  }

  async bulkUpdateStatus(ids: string[], status: LeadStatus): Promise<void> {
    for (const id of ids) {
      await this.update(id, { status, updatedAt: new Date() });
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id);
    }
  }

  exportToCSV(leads: Lead[]): string {
    const headers = ['Company Name', 'Phone', 'Email', 'Website', 'Category', 'Country', 'City', 'Status', 'Tags'];
    const rows = leads.map(l => {
      const c = l.company;
      return [
        c?.name || '',
        c?.phone || '',
        c?.email || '',
        c?.website || '',
        c?.category || '',
        c?.address?.country || '',
        c?.address?.city || '',
        l.status,
        l.tags.join('; ')
      ].map(val => `"${val.replace(/"/g, '""')}"`);
    });
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  async importFromCSV(csvText: string): Promise<number> {
    const lines = csvText.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length <= 1) return 0; // Only headers

    let importCount = 0;
    // Simple CSV parser split on commas outside quotes
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
      if (parts.length < 4) continue;

      const [name, phone, email, website, category, country, city, statusVal] = parts;
      
      // Create Company first
      const newCompany = await companyRepository.create({
        name,
        phone: phone || undefined,
        email: email || undefined,
        website: website || undefined,
        category: category || undefined,
        address: { country: country || undefined, city: city || undefined },
        createdAt: new Date()
      });

      // Create Lead referencing company
      const status = (statusVal?.toLowerCase() || 'new') as LeadStatus;
      await this.create({
        companyId: newCompany.id,
        status: ['new', 'contacted', 'interested', 'meeting', 'proposal_sent', 'negotiation', 'won', 'lost', 'archived'].includes(status) 
          ? status 
          : 'new',
        assignedTo: 'mock-admin',
        tags: ['Potential'],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      importCount++;
    }
    return importCount;
  }
}

export const leadRepository = new LeadRepository();
export default leadRepository;
