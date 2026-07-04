import React, { useState } from 'react';
import type { Proposal } from '../../shared/services/salesRepository';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { FileCheck, Plus, Sparkles } from 'lucide-react';

interface ProposalsListProps {
  proposals: Proposal[];
  onCreateProposal: (proposal: Partial<Proposal>) => Promise<void>;
  onGenerateAi: (company: string, goal: string) => Promise<any>;
}

export const ProposalsList: React.FC<ProposalsListProps> = ({
  proposals,
  onCreateProposal,
  onGenerateAi,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  // Form states
  const [company, setCompany] = useState('');
  const [goal, setGoal] = useState('');
  const [scope, setScope] = useState('');
  const [timeline, setTimeline] = useState('');
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [terms, setTerms] = useState('');

  const triggerGeminiProposal = async () => {
    if (!company || !goal) return;
    setLoadingAi(true);
    try {
      const data = await onGenerateAi(company, goal);
      setScope(data.scope || '');
      setTimeline(data.timeline || '');
      setDeliverables(data.deliverables || []);
      setTerms(data.terms || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    await onCreateProposal({
      company,
      goal,
      scope,
      timeline,
      deliverables,
      terms,
    });
    setModalOpen(false);
    // Reset form
    setCompany(''); setGoal(''); setScope(''); setTimeline(''); setDeliverables([]); setTerms('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <FileCheck size={15} className="mr-2 text-[#D4AF37]" />
          Outreach Proposals ({proposals.length})
        </h3>
        <Button size="sm" onClick={() => setModalOpen(true)} className="flex items-center space-x-1.5">
          <Plus size={13} />
          <span>New Proposal</span>
        </Button>
      </div>

      {/* Proposals Grid Table */}
      <Card className="overflow-hidden p-0 border-slate-200/80 dark:border-slate-800/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                <th className="py-3 px-4">Client Company</th>
                <th className="py-3 px-4">Project Goal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Views</th>
                <th className="py-3 px-4 text-center">Downloads</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {proposals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No proposals drafted yet.</td>
                </tr>
              ) : (
                proposals.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-855/10 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">{prop.company}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">{prop.goal}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        prop.status === 'signed' ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600' : 'bg-blue-105 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">{prop.views}</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">{prop.downloads}</td>
                    <td className="py-3 px-4 text-right text-slate-400">{new Date(prop.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <Card className="w-full max-w-lg z-10 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Draft Sales Proposal</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Client Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required />
                <Input label="Project Objective Goal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Redesign Landing Page" required />
              </div>

              {/* AI generator triggers */}
              <div className="p-3 bg-[#D4AF37]/5 border border-dashed border-[#D4AF37]/30 rounded-xl flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-semibold block max-w-[65%]">
                  💡 Let Gemini AI automatically write the scope, timeline steps, and deliverables based on the goal.
                </span>
                <Button size="sm" type="button" onClick={triggerGeminiProposal} isLoading={loadingAi} className="flex items-center space-x-1">
                  <Sparkles size={11} />
                  <span>AI Outline</span>
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Project Scope</label>
                  <textarea value={scope} onChange={(e) => setScope(e.target.value)} className="text-xs p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg h-16" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Timeline Breakdown</label>
                  <textarea value={timeline} onChange={(e) => setTimeline(e.target.value)} className="text-xs p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg h-16" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Agreement Terms</label>
                  <textarea value={terms} onChange={(e) => setTerms(e.target.value)} className="text-xs p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg h-16" />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm">Save Proposal</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
export default ProposalsList;
