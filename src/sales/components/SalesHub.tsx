import React, { useState } from 'react';
import { useSales } from '../hooks/useSales';
import { ProposalsList } from './ProposalsList';
import { QuotationsList } from './QuotationsList';
import { InvoicesList } from './InvoicesList';
import { ClientPortalView } from './ClientPortalView';
import { FileCheck, FileSpreadsheet, Receipt, ShieldCheck, DollarSign } from 'lucide-react';

export const SalesHub: React.FC = () => {
  const {
    proposals,
    quotes,
    invoices,
    loading,
    createProposal,
    signProposal,
    createQuote,
    createInvoice,
    payInvoice,
    generateAiProposal,
  } = useSales();

  const [activeTab, setActiveTab] = useState<'proposals' | 'quotes' | 'invoices' | 'portal'>('proposals');

  const tabs: Array<{ id: typeof activeTab; label: string; icon: any }> = [
    { id: 'proposals', label: 'Proposals drafted', icon: FileCheck },
    { id: 'quotes', label: 'Quotations calculator', icon: FileSpreadsheet },
    { id: 'invoices', label: 'Invoices list', icon: Receipt },
    { id: 'portal', label: 'Client Portal Preview', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
          <DollarSign size={20} className="mr-2.5 text-[#D4AF37]" />
          <span>Sales & Deals Command Center</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Draft AI proposals, generate itemized tax quotients, collect digital sign contracts, and review client portal pipelines.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 space-x-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'border-b-[#D4AF37] text-slate-800 dark:text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading spinners */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-2"></div>
          <span>Syncing sales ledger records...</span>
        </div>
      ) : (
        <div className="mt-6">
          {activeTab === 'proposals' && (
            <ProposalsList proposals={proposals} onCreateProposal={createProposal} onGenerateAi={generateAiProposal} />
          )}
          {activeTab === 'quotes' && (
            <QuotationsList quotes={quotes} onCreateQuote={createQuote} />
          )}
          {activeTab === 'invoices' && (
            <InvoicesList invoices={invoices} onCreateInvoice={createInvoice} onUpdateInvoiceStatus={payInvoice} />
          )}
          {activeTab === 'portal' && (
            <ClientPortalView proposals={proposals} invoices={invoices} onSignProposal={signProposal} onPayInvoice={payInvoice} />
          )}
        </div>
      )}

    </div>
  );
};
export default SalesHub;
