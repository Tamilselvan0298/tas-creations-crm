import React, { useState } from 'react';
import type { Proposal, Invoice } from '../../shared/services/salesRepository';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { ShieldCheck, PlayCircle } from 'lucide-react';

interface ClientPortalViewProps {
  proposals: Proposal[];
  invoices: Invoice[];
  onSignProposal: (id: string, signature: string) => Promise<void>;
  onPayInvoice: (id: string, status: 'paid') => Promise<void>;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  proposals,
  invoices,
  onSignProposal,
  onPayInvoice,
}) => {
  const [activeStep, setActiveStep] = useState(2); // Default to Development step
  const [sigText, setSigText] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = ['Planning', 'Design', 'Development', 'Testing', 'Review', 'Completed'];

  const pendingProposal = proposals.find(p => p.status === 'sent');
  const outstandingInvoices = invoices.filter(i => i.status !== 'paid');

  const handleSign = async (id: string) => {
    if (!sigText.trim()) return;
    setLoading(true);
    await onSignProposal(id, sigText);
    setSigText('');
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Project Milestones Progress tracker */}
      <div className="md:col-span-2 space-y-6">
        <Card title="Active Project Delivery Status" subtitle="Client portal milestone updates tracker.">
          
          {/* Timeline steps grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
            {steps.map((st, idx) => (
              <button
                key={st}
                onClick={() => setActiveStep(idx)}
                className={`p-2.5 rounded-xl border text-center text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                  idx <= activeStep
                    ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-[#D4AF37]'
                    : 'border-slate-100 dark:border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-[10px] mb-1">Step {idx + 1}</div>
                <span className="truncate block">{st}</span>
              </button>
            ))}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex items-center space-x-3 mt-6">
            <PlayCircle size={18} className="text-[#D4AF37] shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Current Active Status: <span className="font-bold text-slate-700 dark:text-white uppercase tracking-wider text-[11px]">{steps[activeStep]}</span>. The design team has locked homepage wires, and CMS framework configuration is active.
            </p>
          </div>

        </Card>

        {/* E-Signature contract card */}
        {pendingProposal ? (
          <Card title="Review Proposal & Contract Agreement" subtitle={`Goal: ${pendingProposal.goal}`}>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl text-xs text-slate-500 dark:text-slate-400 space-y-3">
              <p className="font-semibold"><span className="font-bold text-slate-700 dark:text-white">Project Scope:</span> {pendingProposal.scope}</p>
              <p className="font-semibold"><span className="font-bold text-slate-700 dark:text-white">Timeline:</span> {pendingProposal.timeline}</p>
              <p className="font-semibold"><span className="font-bold text-slate-700 dark:text-white">Payment Terms:</span> {pendingProposal.terms}</p>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="text"
                value={sigText}
                onChange={(e) => setSigText(e.target.value)}
                placeholder="Type your full name to sign digitally..."
                className="flex-1 text-xs py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-200"
              />
              <Button onClick={() => handleSign(pendingProposal.id)} isLoading={loading}>
                Sign Contract
              </Button>
            </div>
          </Card>
        ) : (
          <Card title="E-Signature Contracts">
            <div className="p-6 border border-dashed border-emerald-200 dark:border-emerald-900/50 rounded-2xl flex flex-col items-center justify-center text-center bg-emerald-50/10 my-3 text-xs">
              <ShieldCheck size={24} className="text-emerald-500 mb-2" />
              <span className="font-bold text-emerald-600">All contracts signed securely.</span>
            </div>
          </Card>
        )}
      </div>

      {/* Outstanding invoices side sidebar */}
      <Card title="Pending Client Invoices" subtitle="Collect payment directly or simulate checkout.">
        <div className="space-y-3">
          {outstandingInvoices.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No pending invoices outstanding.
            </div>
          ) : (
            outstandingInvoices.map((inv) => (
              <div key={inv.id} className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-xl flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold block">{inv.invoiceNumber}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mt-1">${inv.amount.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => onPayInvoice(inv.id, 'paid')}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shadow-sm shrink-0"
                >
                  Pay Invoice
                </button>
              </div>
            ))
          )}
        </div>
      </Card>

    </div>
  );
};
export default ClientPortalView;
