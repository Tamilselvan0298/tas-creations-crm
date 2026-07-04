import { useState, useEffect, useMemo } from 'react';
import { leadRepository } from '../../shared/services/leadRepository';
import { companyRepository } from '../../shared/services/companyRepository';
import { googleMapsImportService } from '../../shared/services/googleMapsImportService';
import type { Lead, LeadStatus } from '../../shared/types';

export interface LeadFilterState {
  search: string;
  country: string;
  category: string;
  hasWebsite: boolean | null; // null = all, true = has website, false = no website
  hasEmail: boolean | null;
  status: LeadStatus | 'all';
}

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Sorting States
  const [filters, setFilters] = useState<LeadFilterState>({
    search: '',
    country: '',
    category: '',
    hasWebsite: null,
    hasEmail: null,
    status: 'all',
  });
  const [sortCol, setSortCol] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    const unsubscribe = leadRepository.subscribeWithCompanies((data) => {
      setLeads(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (visibleIds: string[]) => {
    if (selectedIds.length === visibleIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleIds);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const c = lead.company;
      if (!c) return false;

      // Status Filter
      if (filters.status !== 'all' && lead.status !== filters.status) return false;

      // Search matching Name, Website, Email
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesWeb = c.website?.toLowerCase().includes(query) || false;
        const matchesEmail = c.email?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesWeb && !matchesEmail) return false;
      }

      // Country Filter
      if (filters.country && c.address?.country?.toLowerCase() !== filters.country.toLowerCase()) return false;

      // Category Filter
      if (filters.category && c.category?.toLowerCase() !== filters.category.toLowerCase()) return false;

      // Has Website Filter
      if (filters.hasWebsite !== null) {
        const hasWeb = !!c.website;
        if (filters.hasWebsite !== hasWeb) return false;
      }

      // Has Email Filter
      if (filters.hasEmail !== null) {
        const hasMail = !!c.email;
        if (filters.hasEmail !== hasMail) return false;
      }

      return true;
    }).sort((a, b) => {
      const cA = a.company;
      const cB = b.company;
      let valA: any = a[sortCol as keyof Lead] || (cA as any)?.[sortCol] || '';
      let valB: any = b[sortCol as keyof Lead] || (cB as any)?.[sortCol] || '';

      if (sortCol === 'createdAt' || sortCol === 'updatedAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [leads, filters, sortCol, sortOrder]);

  const paginatedLeads = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, page]);

  const totalPages = Math.ceil(filteredLeads.length / pageSize);

  const importFromMaps = async (inputStr: string) => {
    const parsed = googleMapsImportService.parseImport(inputStr);
    
    // Create Company Profile first
    const newComp = await companyRepository.create({
      name: parsed.name,
      phone: parsed.phone,
      website: parsed.website,
      category: parsed.category,
      address: { street: parsed.address, country: 'USA' },
      createdAt: new Date(),
    });

    // Create Lead entry
    await leadRepository.create({
      companyId: newComp.id,
      status: 'new',
      assignedTo: 'mock-admin',
      tags: ['Hot'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const handleBulkUpdateStatus = async (status: LeadStatus) => {
    await leadRepository.bulkUpdateStatus(selectedIds, status);
    setSelectedIds([]);
  };

  const handleBulkDelete = async () => {
    await leadRepository.bulkDelete(selectedIds);
    setSelectedIds([]);
  };

  return {
    leads: paginatedLeads,
    totalCount: filteredLeads.length,
    selectedIds,
    loading,
    filters,
    setFilters,
    sortCol,
    setSortCol,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    totalPages,
    handleToggleSelect,
    handleSelectAll: () => handleSelectAll(paginatedLeads.map(l => l.id)),
    importFromMaps,
    bulkUpdateStatus: handleBulkUpdateStatus,
    bulkDelete: handleBulkDelete,
    exportCSV: () => leadRepository.exportToCSV(filteredLeads),
    importCSV: (csvText: string) => leadRepository.importFromCSV(csvText),
  };
};
export default useLeads;
