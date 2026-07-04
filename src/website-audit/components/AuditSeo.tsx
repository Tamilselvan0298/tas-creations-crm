import React from 'react';
import type { AuditReport } from '../../shared/services/auditRepository';
import { Card } from '../../shared/components/Card';
import { CheckCircle, AlertTriangle } from 'lucide-react';

interface AuditSeoProps {
  report: AuditReport;
}

export const AuditSeo: React.FC<AuditSeoProps> = ({ report }) => {
  const seo = report.seo;

  const getLengthStatus = (length: number, min: number, max: number) => {
    if (length === 0) return <span className="text-red-500 font-bold flex items-center"><AlertTriangle size={11} className="mr-1" /> Missing</span>;
    if (length < min || length > max) return <span className="text-amber-500 font-semibold flex items-center"><AlertTriangle size={11} className="mr-1" /> Suboptimal ({length} chars)</span>;
    return <span className="text-emerald-500 font-semibold flex items-center"><CheckCircle size={11} className="mr-1" /> Optimal ({length} chars)</span>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Meta Headers & SEO Rules Checklist */}
      <div className="md:col-span-2 space-y-6">
        <Card title="On-Page Metadata Rules">
          <div className="space-y-4 mt-2">
            
            {/* Meta Title Row */}
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">Meta Title Tag</span>
                {getLengthStatus(seo.title.length, 30, 60)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800">
                {seo.title}
              </p>
            </div>

            {/* Meta Description Row */}
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200">Meta Description</span>
                {getLengthStatus(seo.description.length, 120, 160)}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800">
                {seo.description}
              </p>
            </div>

            {/* Alt tags issue */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200">Images Alt Attributes</span>
              {seo.missingAlts > 0 ? (
                <span className="text-amber-500 font-semibold flex items-center">
                  <AlertTriangle size={11} className="mr-1" />
                  {seo.missingAlts} Images missing alt tags
                </span>
              ) : (
                <span className="text-emerald-500 font-semibold flex items-center">
                  <CheckCircle size={11} className="mr-1" />
                  All images contain alt tags
                </span>
              )}
            </div>

          </div>
        </Card>

        {/* Heading Hierarchy Card */}
        <Card title="Heading Elements Tags (H1 & H2)">
          <div className="space-y-4 mt-2">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">H1 Headings ({seo.h1.length})</p>
              {seo.h1.map((val, idx) => (
                <p key={idx} className="text-xs font-semibold text-slate-700 dark:text-slate-200 pl-3 border-l-2 border-[#D4AF37] mb-1">
                  {val}
                </p>
              ))}
            </div>
            {seo.h2 && seo.h2.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">H2 Headings ({seo.h2.length})</p>
                <div className="space-y-1.5">
                  {seo.h2.slice(0, 4).map((val, idx) => (
                    <p key={idx} className="text-xs text-slate-500 dark:text-slate-400 pl-3 border-l-2 border-slate-200 dark:border-slate-800">
                      {val}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Discovered Contacts sidebar */}
      <Card title="Discovered Contact Information" subtitle="Discovered contact endpoints and socials parsed.">
        <div className="space-y-4">
          <div className="text-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 mt-1">{report.business?.email || '—'}</p>
          </div>
          <div className="text-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone Line</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 mt-1">{report.business?.phone || '—'}</p>
          </div>
          <div className="text-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Instagram Handle</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 mt-1">{report.business?.socials?.instagram || '—'}</p>
          </div>
          <div className="text-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Facebook Page</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 mt-1">{report.business?.socials?.facebook || '—'}</p>
          </div>
          <div className="text-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LinkedIn Profile</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 mt-1">{report.business?.socials?.linkedin || '—'}</p>
          </div>
          <div className="text-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Twitter / X</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 mt-1">{report.business?.socials?.twitter || '—'}</p>
          </div>
          <div className="text-xs">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">YouTube Channel</p>
            <p className="font-semibold text-slate-700 dark:text-slate-200 mt-1">{report.business?.socials?.youtube || '—'}</p>
          </div>
        </div>
      </Card>

    </div>
  );
};
export default AuditSeo;
