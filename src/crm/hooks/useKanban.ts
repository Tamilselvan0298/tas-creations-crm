import { useState, useEffect } from 'react';
import { leadRepository } from '../../shared/services/leadRepository';
import type { Lead, LeadStatus } from '../../shared/types';

export const useKanban = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = leadRepository.subscribeWithCompanies((data) => {
      setLeads(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Columns definition list
  const columns: Array<{ id: LeadStatus; title: string; color: string }> = [
    { id: 'new', title: 'New Leads', color: 'border-t-blue-500 bg-blue-50/10' },
    { id: 'contacted', title: 'Contacted', color: 'border-t-slate-500 bg-slate-50/10' },
    { id: 'interested', title: 'Interested', color: 'border-t-rose-500 bg-rose-50/10' },
    { id: 'meeting', title: 'Meeting Scheduled', color: 'border-t-amber-500 bg-amber-50/10' },
    { id: 'proposal_sent', title: 'Proposal Sent', color: 'border-t-indigo-500 bg-indigo-50/10' },
    { id: 'negotiation', title: 'Negotiation', color: 'border-t-purple-500 bg-purple-50/10' },
    { id: 'won', title: 'Won Deals', color: 'border-t-emerald-500 bg-emerald-50/10' },
    { id: 'lost', title: 'Lost', color: 'border-t-red-500 bg-red-50/10' },
  ];

  // Group leads by status
  const boardData = columns.reduce((acc, col) => {
    acc[col.id] = leads.filter(l => l.status === col.id);
    return acc;
  }, {} as Record<LeadStatus, Lead[]>);

  // Updates card status on drag complete
  const moveLead = async (leadId: string, targetStatus: LeadStatus) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status === targetStatus) return;

    // Optimistic UI state updates
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: targetStatus, updatedAt: new Date() } : l));

    try {
      await leadRepository.update(leadId, {
        status: targetStatus,
        updatedAt: new Date()
      });
    } catch (e) {
      console.error('Failed to move Kanban lead:', e);
      // Revert if Firestore fails
      const revertData = await leadRepository.list();
      setLeads(revertData);
    }
  };

  return {
    columns,
    boardData,
    loading,
    moveLead,
  };
};
export default useKanban;
