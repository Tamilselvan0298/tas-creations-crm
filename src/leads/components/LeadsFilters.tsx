import React from 'react';
import type { LeadFilterState } from '../hooks/useLeads';
import type { LeadStatus } from '../../shared/types';
import { Filter } from 'lucide-react';

interface LeadsFiltersProps {
  filters: LeadFilterState;
  setFilters: React.Dispatch<React.SetStateAction<LeadFilterState>>;
}

export const LeadsFilters: React.FC<LeadsFiltersProps> = ({ filters, setFilters }) => {
  const categories = ['Logistics', 'Software', 'Marketing', 'Food', 'Healthcare'];
  const countries = ['USA', 'Canada', 'UK', 'Australia'];
  
  const statuses: Array<{ id: LeadStatus | 'all'; label: string }> = [
    { id: 'all', label: 'All Statuses' },
    { id: 'new', label: 'New' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'interested', label: 'Interested' },
    { id: 'meeting', label: 'Meeting Scheduled' },
    { id: 'proposal_sent', label: 'Proposal Sent' },
    { id: 'negotiation', label: 'Negotiation' },
    { id: 'won', label: 'Won' },
    { id: 'lost', label: 'Lost' },
    { id: 'archived', label: 'Archived' },
  ];

  const updateFilter = <K extends keyof LeadFilterState>(key: K, value: LeadFilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-xl p-4 space-y-6 shadow-sm sticky top-20 self-start">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center">
          <Filter size={13} className="mr-2 text-[#D4AF37]" />
          Advanced Filters
        </span>
        <button 
          onClick={() => setFilters({ search: '', country: '', category: '', hasWebsite: null, hasEmail: null, status: 'all' })}
          className="text-[10px] text-slate-400 hover:text-[#D4AF37] font-semibold transition-colors cursor-pointer"
        >
          Clear All
        </button>
      </div>

      {/* Status Select */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Status</label>
        <select
          value={filters.status}
          onChange={(e) => updateFilter('status', e.target.value as LeadStatus | 'all')}
          className="w-full text-xs py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          {statuses.map(st => (
            <option key={st.id} value={st.id}>{st.label}</option>
          ))}
        </select>
      </div>

      {/* Target Category */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Business Category</label>
        <select
          value={filters.category}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="w-full text-xs py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Target Country */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Country</label>
        <select
          value={filters.country}
          onChange={(e) => updateFilter('country', e.target.value)}
          className="w-full text-xs py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          <option value="">All Countries</option>
          {countries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Contact Presences */}
      <div className="space-y-3 pt-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Content Presences</label>
        
        {/* Has Website */}
        <label className="flex items-center text-xs text-slate-600 dark:text-slate-400 font-medium select-none cursor-pointer">
          <input 
            type="checkbox"
            checked={filters.hasWebsite === true}
            onChange={(e) => updateFilter('hasWebsite', e.target.checked ? true : null)}
            className="mr-2 h-3.5 w-3.5 rounded border-slate-300 text-[#0B1F3A] focus:ring-[#D4AF37]"
          />
          Has Active Website
        </label>

        {/* Has Email */}
        <label className="flex items-center text-xs text-slate-600 dark:text-slate-400 font-medium select-none cursor-pointer">
          <input 
            type="checkbox"
            checked={filters.hasEmail === true}
            onChange={(e) => updateFilter('hasEmail', e.target.checked ? true : null)}
            className="mr-2 h-3.5 w-3.5 rounded border-slate-300 text-[#0B1F3A] focus:ring-[#D4AF37]"
          />
          Has Contact Email
        </label>
      </div>

    </div>
  );
};
export default LeadsFilters;
