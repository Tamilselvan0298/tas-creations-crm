import React from 'react';
import type { AuditReport } from '../../shared/services/auditRepository';
import { Card } from '../../shared/components/Card';
import { ShieldCheck, ShieldAlert, Cpu, Server, Clock } from 'lucide-react';

interface AuditOverviewProps {
  report: AuditReport;
}

export const AuditOverview: React.FC<AuditOverviewProps> = ({ report }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500';
    if (score >= 50) return 'text-amber-500 border-amber-500';
    return 'text-red-500 border-red-500';
  };

  const scoreBlocks = [
    { label: 'Performance', score: report.scores.performance },
    { label: 'SEO Audit', score: report.scores.seo },
    { label: 'Accessibility', score: report.scores.accessibility },
    { label: 'Security', score: report.scores.security },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Visual Dials Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {scoreBlocks.map((block) => (
          <Card key={block.label} className="flex flex-col items-center p-6 text-center">
            <div className={`h-20 w-20 rounded-full border-4 flex items-center justify-center font-black text-xl mb-3 ${getScoreColor(block.score)}`}>
              {block.score}%
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {block.label}
            </span>
          </Card>
        ))}
      </div>

      {/* Crawl Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Server & Connection" className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center space-x-3">
              <Clock size={16} className="text-[#D4AF37] shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Response Time</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{report.responseTime} ms</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center space-x-3">
              <Server size={16} className="text-[#D4AF37] shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hosting</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{report.hosting || '—'}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center space-x-3">
              {report.https ? (
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              ) : (
                <ShieldAlert size={16} className="text-amber-500 shrink-0" />
              )}
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SSL Security</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{report.https ? 'Secure (HTTPS)' : 'Insecure (HTTP)'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tech Stack Classifier */}
        <Card title="Detected Technologies" subtitle="Identified active stacks and code trackers.">
          <div className="flex flex-wrap gap-2 mt-2">
            {report.techStack.length === 0 ? (
              <span className="text-xs text-slate-400">None detected.</span>
            ) : (
              report.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5"
                >
                  <Cpu size={10} className="text-[#D4AF37]" />
                  <span>{tech}</span>
                </span>
              ))
            )}
          </div>
        </Card>
      </div>

    </div>
  );
};
export default AuditOverview;
