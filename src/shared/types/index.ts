export type UserRole = 'admin' | 'manager' | 'sales' | 'viewer';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface CompanyProfile {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  category?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  ownerId?: string; // Ref: UserProfile
  employeesCount?: number;
  annualRevenue?: number;
  description?: string;
  createdAt: any;
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'meeting'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'archived';

export interface Lead {
  id: string;
  companyId: string; // Ref: CompanyProfile
  status: LeadStatus;
  assignedTo: string; // Ref: UserProfile
  tags: string[];
  customFields?: Record<string, any>;
  createdAt: any;
  updatedAt: any;
  company?: CompanyProfile; // Populated client-side
  assignedUser?: UserProfile; // Populated client-side
}

export interface Activity {
  id: string;
  leadId: string;
  type: 'email' | 'whatsapp' | 'call' | 'meeting' | 'note' | 'proposal' | 'system' | 'status' | 'seo';
  title: string;
  description: string;
  performedBy: string; // Ref: UserProfile
  timestamp: any;
}

export interface Task {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'completed';
  assignedTo: string; // Ref: UserProfile
  deadline: any;
  reminderTime?: any;
  completedAt?: any;
}

export interface Note {
  id: string;
  leadId: string;
  content: string;
  createdBy: string; // Ref: UserProfile
  attachments: string[]; // URLs
  createdAt: any;
}

export interface SeoReport {
  id: string;
  websiteUrl: string;
  seoScore: number;
  technicalScore: number;
  performanceScore: number;
  accessibilityScore: number;
  contentScore: number;
  keywordSuggestions: string[];
  missingMeta: string[];
  missingImages: string[];
  brokenLinks: string[];
  recommendations: string[];
  generatedBy: string;
  createdAt: any;
}

export interface WebsiteAudit {
  id: string;
  websiteUrl: string;
  cms: string;
  hosting: string;
  sslEnabled: boolean;
  http2Enabled: boolean;
  performance: {
    speedIndex: number;
    responseTime: number;
    loadTime: number;
  };
  seoDetails: {
    metaTags: Record<string, string>;
    openGraph: Record<string, string>;
    twitterCards: Record<string, string>;
    h1s: string[];
    h2s: string[];
    schema: string[];
    canonical: string;
    sitemapUrl?: string;
    robotsTxt?: string;
    favicon?: string;
  };
  security: {
    headers: Record<string, string>;
    vulnerabilities: string[];
  };
  technologies: string[];
  createdAt: any;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  templateId: string;
  stats: {
    sent: number;
    opened: number;
    replied: number;
    bounced: number;
  };
  scheduledAt?: any;
  createdAt: any;
}

export interface EmailLog {
  id: string;
  leadId: string;
  campaignId?: string;
  subject: string;
  body: string;
  status: 'draft' | 'queued' | 'sent' | 'bounced';
  tracking?: {
    opened: boolean;
    openedAt?: any;
    replied: boolean;
  };
  createdAt: any;
}

export interface WhatsAppLog {
  id: string;
  leadId: string;
  message: string;
  direction: 'inbound' | 'outbound';
  status: 'queued' | 'sent' | 'delivered' | 'read';
  createdAt: any;
}

export interface Notification {
  id: string;
  recipientId: string; // Ref: UserProfile or 'all'
  title: string;
  message: string;
  read: boolean;
  type: 'lead_assigned' | 'task_reminder' | 'meeting_scheduled' | 'proposal_signed' | 'system';
  createdAt: any;
}

export interface Quotation {
  id: string;
  leadId: string;
  quoteNumber: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    taxRate: number; // e.g. 18 for 18% GST
    taxAmount: number;
  }>;
  subtotal: number;
  discount: number;
  taxTotal: number;
  grandTotal: number;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  createdAt: any;
}

export interface Proposal {
  id: string;
  leadId: string;
  title: string;
  coverPage: {
    logo?: string;
    title: string;
    subtitle?: string;
    preparedFor: string;
    preparedBy: string;
    date: any;
  };
  services: Array<{
    title: string;
    description: string;
  }>;
  pricing: Array<{
    phase: string;
    amount: number;
  }>;
  terms: string;
  signature?: {
    signedBy: string;
    ipAddress: string;
    signedAt: any;
    image: string; // Base64 or URL
  };
  status: 'draft' | 'sent' | 'signed' | 'expired';
  createdAt: any;
}

export interface Invoice {
  id: string;
  leadId: string;
  invoiceNumber: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    gstRate: number;
    gstAmount: number;
  }>;
  subtotal: number;
  discount: number;
  gstTotal: number;
  grandTotal: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: any;
  createdAt: any;
}

export interface SystemSettings {
  id: string;
  profile?: {
    fullName: string;
    phone?: string;
    avatar?: string;
  };
  company?: {
    name: string;
    logo?: string;
    gstNumber?: string;
    address?: string;
  };
  smtp?: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
  };
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  geminiApiKey?: string;
  theme: 'dark' | 'light' | 'system';
}
