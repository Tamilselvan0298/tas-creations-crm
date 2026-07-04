import React, { useState } from 'react';
import type { AuditReport } from '../../shared/services/auditRepository';
import { Card } from '../../shared/components/Card';
import { Copy, Check, Sparkles, AlertCircle, Award } from 'lucide-react';

interface AuditAiAnalysisProps {
  report: AuditReport;
}

export const AuditAiAnalysis: React.FC<AuditAiAnalysisProps> = ({ report }) => {
  const ai = report.aiAnalysis;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ai.salesPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Strengths & Weaknesses */}
      <div className="md:col-span-2 space-y-6">
        <Card title="Business Audit Assessment" subtitle={ai.summary}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            
            {/* Strengths List */}
            <div className="p-4 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900 rounded-xl">
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block flex items-center">
                <Award size={12} className="mr-1" />
                Audit Strengths
              </span>
              <ul className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 space-y-1.5 list-disc pl-4 font-semibold">
                {ai.strengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses List */}
            <div className="p-4 bg-red-50/20 dark:bg-red-950/10 border border-red-100 dark:border-red-900 rounded-xl">
              <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider block flex items-center">
                <AlertCircle size={12} className="mr-1" />
                Opportunities & Issues
              </span>
              <ul className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 space-y-1.5 list-disc pl-4 font-semibold">
                {ai.weaknesses.map((weak, idx) => (
                  <li key={idx}>{weak}</li>
                ))}
              </ul>
            </div>

          </div>
        </Card>

        {/* Copy-paste Sales Letter */}
        <Card title="Tailored Sales Pitch Outreach Script">
          <div className="relative mt-2">
            <textarea
              readOnly
              value={ai.salesPitch}
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl h-28 font-semibold text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-0 leading-relaxed"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 top-3 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-all cursor-pointer shadow-sm"
              title="Copy outreach text"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            </button>
          </div>
        </Card>
      </div>

      {/* Website Rebuild budget estimate */}
      <Card title="Estimated Website Value" subtitle="Estimated budget ranges calculated by Gemini AI.">
        <div className="p-4 border-2 border-dashed border-[#D4AF37]/50 rounded-2xl flex flex-col items-center justify-center text-center bg-[#D4AF37]/5 my-3">
          <Sparkles size={22} className="text-[#D4AF37] mb-2 animate-bounce" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rebuild Valuation</span>
          <p className="text-2xl font-black text-slate-700 dark:text-slate-100 mt-1">{ai.budgetEstimate}</p>
        </div>
        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed font-semibold">
          💡 Rebuild ranges are based on tech stack profiles, layout pages, and on-page speed improvements. Use this valuation to pitch website redesign services.
        </p>
      </Card>

    </div>
  );
};
export default AuditAiAnalysis;
