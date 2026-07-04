import React, { useState } from 'react';
import { useAudit } from '../hooks/useAudit';
import { AuditSearch } from './AuditSearch';
import { AuditOverview } from './AuditOverview';
import { AuditSeo } from './AuditSeo';
import { AuditSpeed } from './AuditSpeed';
import { AuditAiAnalysis } from './AuditAiAnalysis';
import { Card } from '../../shared/components/Card';
import { Globe, Download, Printer, Search } from 'lucide-react';

export const AuditDashboard: React.FC = () => {
  const {
    audits,
    activeReport,
    loading,
    crawling,
    error,
    searchUrl,
    setSearchUrl,
    triggerAudit,
    selectReport,
  } = useAudit();

  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'speed' | 'ai'>('overview');

  const handleDownloadJson = () => {
    if (!activeReport) return;
    const blob = new Blob([JSON.stringify(activeReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_report_${activeReport.id}.json`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs: Array<{ id: typeof activeTab; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'seo', label: 'SEO Audit' },
    { id: 'speed', label: 'Speed Performance' },
    { id: 'ai', label: 'Gemini AI Pitch' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 print:block">
      
      {/* Sidebar - Audit History List */}
      <div className="w-full lg:w-64 shrink-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm h-fit print:hidden">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Search size={13} className="mr-2 text-[#D4AF37]" />
          Scan History ({audits.length})
        </span>

        {loading ? (
          <p className="text-[11px] text-slate-400 text-center py-4">Syncing audit reports...</p>
        ) : audits.length === 0 ? (
          <p className="text-[11px] text-slate-400 text-center py-4">No past website audits found.</p>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {audits.map((item) => (
              <button
                key={item.id}
                onClick={() => selectReport(item.id)}
                className={`w-full text-left text-xs p-2.5 rounded-xl border transition-all cursor-pointer block ${
                  activeReport?.id === item.id
                    ? 'border-[#D4AF37] bg-[#D4AF37]/5 font-bold text-slate-800 dark:text-white'
                    : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 text-slate-500'
                }`}
              >
                <span className="truncate block font-semibold">{new URL(item.url).hostname}</span>
                <span className="text-[9px] text-slate-400 block mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Analysis Container */}
      <div className="flex-1 space-y-6 print:space-y-4">
        
        {/* Search Audit Trigger */}
        <div className="print:hidden">
          <AuditSearch
            searchUrl={searchUrl}
            setSearchUrl={setSearchUrl}
            onSearch={triggerAudit}
            crawling={crawling}
            error={error}
          />
        </div>

        {activeReport ? (
          <div className="space-y-6 print:space-y-4">
            
            {/* Header info card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 bg-[#0B1F3A] border border-[#D4AF37]/35 rounded-xl flex items-center justify-center text-[#D4AF37] shrink-0">
                  <Globe size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-slate-800 dark:text-slate-100">
                    {new URL(activeReport.url).hostname}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">
                    Scanned: {new Date(activeReport.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Action export links */}
              <div className="flex items-center space-x-2 shrink-0 print:hidden">
                <button
                  onClick={handleDownloadJson}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-500 transition-all cursor-pointer"
                >
                  <Download size={12} />
                  <span>Download JSON</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 border border-transparent rounded-lg text-[10px] font-bold text-[#D4AF37] transition-all cursor-pointer"
                >
                  <Printer size={12} />
                  <span>Print PDF</span>
                </button>
              </div>
            </div>

            {/* Sub Tabs Selection */}
            <div className="flex border-b border-slate-200 dark:border-slate-800/80 space-x-6 print:hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-b-[#D4AF37] text-slate-800 dark:text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Active Audit Report Content Tab */}
            <div className="print:block">
              {activeTab === 'overview' && <AuditOverview report={activeReport} />}
              {activeTab === 'seo' && <AuditSeo report={activeReport} />}
              {activeTab === 'speed' && <AuditSpeed report={activeReport} />}
              {activeTab === 'ai' && <AuditAiAnalysis report={activeReport} />}
            </div>

          </div>
        ) : (
          !crawling && (
            <Card className="p-12 text-center text-slate-400 text-xs">
              <span>Enter a domain address above to generate website intelligence details.</span>
            </Card>
          )
        )}
      </div>

    </div>
  );
};
export default AuditDashboard;
