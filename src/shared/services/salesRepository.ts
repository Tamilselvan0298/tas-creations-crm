import { auth, isMockFirebase } from '../lib/firebase';
import { API_BASE_URL } from '../config';

export interface Proposal {
  id: string;
  company: string;
  goal: string;
  scope: string;
  timeline: string;
  deliverables: string[];
  terms: string;
  status: 'sent' | 'signed' | 'declined';
  views: number;
  downloads: number;
  signature?: string;
  createdAt: string;
}

export interface QuoteItem {
  name: string;
  price: number;
}

export interface Quote {
  id: string;
  company: string;
  items: QuoteItem[];
  discount: number;
  gstPercent: number;
  total: number;
  status: 'sent' | 'approved' | 'declined';
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  company: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentLink: string;
  qrCode: string;
  createdAt: string;
}

class SalesRepository {
  private async getAuthToken(): Promise<string> {
    if (isMockFirebase) {
      const mockRole = localStorage.getItem('tas-user-role') || 'admin';
      return `mock-${mockRole}`;
    }
    return (await auth.currentUser?.getIdToken()) || '';
  }

  async listProposals(): Promise<Proposal[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/sales/proposals`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to load proposals.');
    return await response.json();
  }

  async createProposal(proposal: Partial<Proposal>): Promise<Proposal> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/sales/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(proposal),
    });
    if (!response.ok) throw new Error('Failed to create proposal.');
    return await response.json();
  }

  async signProposal(id: string, signature: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/sales/proposals/${id}/sign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signature }),
    });
    if (!response.ok) throw new Error('Failed to sign proposal.');
  }

  async listQuotes(): Promise<Quote[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/sales/quotes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to load quotes.');
    return await response.json();
  }

  async createQuote(quote: Partial<Quote>): Promise<Quote> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/sales/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(quote),
    });
    if (!response.ok) throw new Error('Failed to create quotation.');
    return await response.json();
  }

  async listInvoices(): Promise<Invoice[]> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/sales/invoices`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to load invoices.');
    return await response.json();
  }

  async createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/sales/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) throw new Error('Failed to create invoice.');
    return await response.json();
  }

  async generateAiProposal(company: string, goal: string): Promise<any> {
    const token = await this.getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/sales/generate-proposal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ company, goal }),
    });
    if (!response.ok) throw new Error('Failed to generate AI proposal items.');
    return await response.json();
  }
}

export const salesRepository = new SalesRepository();
export default salesRepository;
