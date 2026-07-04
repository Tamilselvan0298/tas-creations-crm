import { BaseRepository } from './db';
import type { CompanyProfile } from '../types';

const SEED_COMPANIES: CompanyProfile[] = [
  {
    id: 'comp-1',
    name: 'Acme Corp',
    phone: '+1 (555) 019-2834',
    email: 'info@acme.com',
    website: 'acme.com',
    socialLinks: { instagram: '@acme', facebook: 'acmeco', linkedin: 'company/acme' },
    category: 'Logistics',
    address: { street: '123 Industrial Way', city: 'Chicago', state: 'IL', country: 'USA', pincode: '60601' },
    coordinates: { lat: 41.8781, lng: -87.6298 },
    employeesCount: 250,
    annualRevenue: 15000000,
    description: 'Global logistics and distribution services.',
    createdAt: new Date(),
  },
  {
    id: 'comp-2',
    name: 'Quantum Tech',
    phone: '+1 (555) 012-9843',
    email: 'sales@quantumtech.io',
    website: 'quantumtech.io',
    category: 'Software',
    address: { street: '456 Innovation Dr', city: 'Toronto', state: 'ON', country: 'Canada', pincode: 'M5V 2T6' },
    coordinates: { lat: 43.6532, lng: -79.3832 },
    employeesCount: 45,
    annualRevenue: 3200000,
    description: 'AI-driven cloud infrastructure solutions.',
    createdAt: new Date(),
  },
  {
    id: 'comp-3',
    name: 'Spark Media',
    phone: '+1 (555) 017-3829',
    email: 'contact@sparkmedia.com',
    website: 'sparkmedia.com',
    category: 'Marketing',
    address: { street: '789 Creative Lane', city: 'New York', state: 'NY', country: 'USA', pincode: '10001' },
    coordinates: { lat: 40.7128, lng: -74.0060 },
    employeesCount: 15,
    annualRevenue: 850000,
    description: 'Digital brand marketing and SEO design strategy.',
    createdAt: new Date(),
  },
  {
    id: 'comp-4',
    name: 'Baker Bakery',
    phone: '+1 (555) 014-4821',
    email: 'hello@bakerbakery.co.uk',
    website: 'bakerbakery.co.uk',
    category: 'Food',
    address: { street: '12 Flour St', city: 'London', state: 'England', country: 'UK', pincode: 'EC1A 1BB' },
    coordinates: { lat: 51.5074, lng: -0.1278 },
    employeesCount: 8,
    annualRevenue: 280000,
    description: 'Artisan baking and local distribution supplies.',
    createdAt: new Date(),
  },
  {
    id: 'comp-5',
    name: 'Apex Logistics',
    phone: '+1 (555) 016-5743',
    email: 'admin@apexlogistics.com',
    website: 'apexlogistics.com',
    category: 'Logistics',
    address: { street: '77 Supply Chain Rd', city: 'Dallas', state: 'TX', country: 'USA', pincode: '75201' },
    coordinates: { lat: 32.7767, lng: -96.7970 },
    employeesCount: 120,
    annualRevenue: 7400000,
    description: 'Regional freight and inventory storage operations.',
    createdAt: new Date(),
  },
];

class CompanyRepository extends BaseRepository<CompanyProfile> {
  constructor() {
    super('companies');
    this.seedMockDataIfNeeded();
  }

  private seedMockDataIfNeeded() {
    const list = this.getMockData();
    if (list.length === 0) {
      this.setMockData(SEED_COMPANIES);
    }
  }
}

export const companyRepository = new CompanyRepository();
export default companyRepository;
