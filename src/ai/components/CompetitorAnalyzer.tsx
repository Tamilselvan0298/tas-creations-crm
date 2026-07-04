import React, { useState } from 'react';
import type { CompetitorReport } from '../../shared/services/aiRepository';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { ShieldAlert, Compass, Sparkles, Check, AlertTriangle } from 'lucide-react';

interface CompetitorAnalyzerProps {
  report: CompetitorReport | null;
  loading: boolean;
  onScan: (company: string, website?: string) => Promise<void>;
}

export const CompetitorAnalyzer: React.FC<CompetitorAnalyzerProps> = ({
  report,
  loading,
  onScan,
}) => {
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    onScan(company, website);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Search inputs */}
      <Card title="Competitor Analysis Scan" subtitle="Input details to locate competitors.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Target Business Name" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Spark Cafe" required />
          <Input label="Business Website URL" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="e.g. sparkcafe.com" />
          <Button type="submit" size="sm" className="w-full flex items-center justify-center space-x-1.5" isLoading={loading}>
            <Compass size={12} />
            <span>Scan Competitors</span>
          </Button>
        </form>
      </Card>

      {/* Reports viewports */}
      <div className="md:col-span-2 space-y-6">
        {report ? (
          <Card title="Competitive SEO & Technology Analysis" subtitle="AI-generated competitor outline report.">
            <div className="space-y-4 mt-4">
              
              {/* Competitors Tags */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider block">Primary Competitors</span>
                <div className="flex gap-2">
                  {report.competitors.map((name, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-200/50 dark:border-slate-800">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strengths & Weaknesses grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 bg-emerald-50/10 border border-emerald-500/10 p-3 rounded-xl">
                  <span className="text-[9px] text-emerald-600 font-black uppercase tracking-wider block flex items-center">
                    <Check size={10} className="mr-1" />
                    Competitor Strengths
                  </span>
                  <ul className="list-disc pl-4 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                    {report.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                  </ul>
                </div>
                <div className="space-y-2 bg-rose-50/10 border border-rose-500/10 p-3 rounded-xl">
                  <span className="text-[9px] text-rose-600 font-black uppercase tracking-wider block flex items-center">
                    <AlertTriangle size={10} className="mr-1" />
                    Competitor Weaknesses
                  </span>
                  <ul className="list-disc pl-4 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                    {report.weaknesses.map((wk, idx) => <li key={idx}>{wk}</li>)}
                  </ul>
                </div>
              </div>

              {/* Recommendation pitches */}
              <div className="p-3.5 bg-slate-150/40 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-850 space-y-1.5">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block flex items-center">
                  <Sparkles size={11} className="mr-1" />
                  AI Suggested Strategy Pitch
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {report.suggestion}
                </p>
              </div>

            </div>
          </Card>
        ) : (
          <Card className="h-full flex flex-col items-center justify-center text-center p-12">
            <ShieldAlert size={32} className="text-slate-300 dark:text-slate-700 mb-2" />
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">Input search parameters and click "Scan Competitors" to view analysis metrics.</span>
          </Card>
        )}
      </div>

    </div>
  );
};
export default CompetitorAnalyzer;
