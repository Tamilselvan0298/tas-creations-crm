import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leadRepository } from '../../shared/services/leadRepository';
import type { Lead } from '../../shared/types';
import { CompanyOverviewTab } from './tabs/CompanyOverviewTab';
import { CompanyNotesTab } from './tabs/CompanyNotesTab';
import { CompanyTasksTab } from './tabs/CompanyTasksTab';
import { CompanyMeetingsTab } from './tabs/CompanyMeetingsTab';
import { CompanyTimelineTab } from './tabs/CompanyTimelineTab';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Star 
} from 'lucide-react';

export const LeadDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'activities' | 'tasks' | 'meetings'>('overview');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const unsubscribe = leadRepository.subscribeWithCompanies((leadsList) => {
      const found = leadsList.find(l => l.id === id);
      if (found) setLead(found);
      setLoading(false);
    });
    return unsubscribe;
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-2"></div>
        <span>Syncing prospect files...</span>
      </div>
    );
  }

  if (!lead || !lead.company) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p className="text-sm">Lead details not found.</p>
        <Link to="/leads" className="text-xs text-[#D4AF37] hover:underline mt-2 inline-block">Back to database</Link>
      </div>
    );
  }

  const c = lead.company;
  const tabsList: Array<{ id: typeof activeTab; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'notes', label: 'Notes' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'activities', label: 'Timeline Activities' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Return Navigation */}
      <Link to="/leads" className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer">
        <ArrowLeft size={13} className="mr-2" />
        <span>Return to Leads Database</span>
      </Link>

      {/* Profile Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 bg-[#0B1F3A] text-[#D4AF37] border border-[#D4AF37]/35 rounded-2xl flex items-center justify-center font-black text-2xl shadow">
            {c.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <span>{c.name}</span>
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-400 font-medium">
              <span className="flex items-center"><Briefcase size={13} className="mr-1 text-slate-300" />{c.category}</span>
              <span className="flex items-center"><MapPin size={13} className="mr-1 text-slate-300" />{c.address?.city || 'USA'}</span>
              <span className="flex items-center"><Star size={13} className="mr-1 text-[#D4AF37]" />4.5 rating</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-slate-300">
            {lead.status}
          </span>
        </div>
      </div>

      {/* Tabs Selector Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 space-x-6">
        {tabsList.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id ? 'border-[#D4AF37] text-slate-800 dark:text-white' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub Tab Viewports */}
      <div className="mt-6">
        {activeTab === 'overview' && <CompanyOverviewTab company={c} lead={lead} />}
        {activeTab === 'notes' && <CompanyNotesTab leadId={lead.id} />}
        {activeTab === 'tasks' && <CompanyTasksTab leadId={lead.id} />}
        {activeTab === 'meetings' && <CompanyMeetingsTab leadId={lead.id} />}
        {activeTab === 'activities' && <CompanyTimelineTab leadId={lead.id} />}
      </div>

    </div>
  );
};
export default LeadDetailView;
