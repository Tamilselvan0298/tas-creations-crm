import React from 'react';
import type { AuditReport } from '../../shared/services/auditRepository';
import { Card } from '../../shared/components/Card';
import { Zap } from 'lucide-react';

interface AuditSpeedProps {
  report: AuditReport;
}

export const AuditSpeed: React.FC<AuditSpeedProps> = ({ report }) => {
  const speed = report.speed;

  const getVitalsColor = (val: number, good: number, bad: number) => {
    if (val <= good) return 'text-emerald-500 font-extrabold';
    if (val <= bad) return 'text-amber-500 font-bold';
    return 'text-red-500 font-bold';
  };

  const getVitalsBadge = (val: number, good: number, bad: number) => {
    if (val <= good) return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border-emerald-100 dark:border-emerald-900';
    if (val <= bad) return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border-amber-100 dark:border-amber-900';
    return 'bg-red-50 dark:bg-red-950/20 text-red-600 border-red-100 dark:border-red-900';
  };

  // Mock Resource Sizes Distribution in %
  const jsPercent = 45;
  const cssPercent = 15;
  const imgPercent = 30;
  const otherPercent = 10;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Lighthouse Core Web Vitals Panel */}
      <div className="md:col-span-2 space-y-6">
        <Card title="Core Web Vitals Metrics">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            
            {/* LCP Gauge */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Largest Contentful Paint</span>
              <p className={`text-2xl font-black mt-2 ${getVitalsColor(speed.lcp, 2.5, 4.0)}`}>
                {speed.lcp} s
              </p>
              <span className={`text-[8px] font-extrabold uppercase border px-1.5 py-0.5 rounded mt-2.5 inline-block ${getVitalsBadge(speed.lcp, 2.5, 4.0)}`}>
                {speed.lcp <= 2.5 ? 'Good' : speed.lcp <= 4.0 ? 'Needs Improve' : 'Poor'}
              </span>
            </div>

            {/* CLS Gauge */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cumulative Layout Shift</span>
              <p className={`text-2xl font-black mt-2 ${getVitalsColor(speed.cls, 0.1, 0.25)}`}>
                {speed.cls}
              </p>
              <span className={`text-[8px] font-extrabold uppercase border px-1.5 py-0.5 rounded mt-2.5 inline-block ${getVitalsBadge(speed.cls, 0.1, 0.25)}`}>
                {speed.cls <= 0.1 ? 'Good' : speed.cls <= 0.25 ? 'Needs Improve' : 'Poor'}
              </span>
            </div>

            {/* TBT Gauge */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Blocking Time</span>
              <p className={`text-2xl font-black mt-2 ${getVitalsColor(speed.tbt, 200, 600)}`}>
                {speed.tbt} ms
              </p>
              <span className={`text-[8px] font-extrabold uppercase border px-1.5 py-0.5 rounded mt-2.5 inline-block ${getVitalsBadge(speed.tbt, 200, 600)}`}>
                {speed.tbt <= 200 ? 'Good' : speed.tbt <= 600 ? 'Needs Improve' : 'Poor'}
              </span>
            </div>

          </div>
        </Card>

        {/* Payload resource bar */}
        <Card title="Page Resource Distribution Breakdown" subtitle="Visual breakdown of total network payload.">
          <div className="space-y-4 mt-3">
            {/* Visual Bar Segment */}
            <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
              <div style={{ width: `${jsPercent}%` }} className="bg-[#D4AF37]" title="JavaScript" />
              <div style={{ width: `${cssPercent}%` }} className="bg-indigo-500" title="CSS" />
              <div style={{ width: `${imgPercent}%` }} className="bg-emerald-500" title="Images" />
              <div style={{ width: `${otherPercent}%` }} className="bg-slate-400" title="HTML & Other" />
            </div>

            {/* Legend row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
              <div className="flex items-center"><span className="h-2 w-2 rounded-full bg-[#D4AF37] mr-1.5" />JavaScript ({jsPercent}%)</div>
              <div className="flex items-center"><span className="h-2 w-2 rounded-full bg-indigo-500 mr-1.5" />CSS Stylesheets ({cssPercent}%)</div>
              <div className="flex items-center"><span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5" />Images ({imgPercent}%)</div>
              <div className="flex items-center"><span className="h-2 w-2 rounded-full bg-slate-400 mr-1.5" />HTML & Other ({otherPercent}%)</div>
            </div>
          </div>
        </Card>
      </div>

      {/* HTML size panel */}
      <Card title="Transfer Payload Size">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center space-x-3 mt-2">
          <Zap size={16} className="text-[#D4AF37] shrink-0 animate-pulse" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Homepage Size</span>
            <p className="text-xl font-black text-slate-700 dark:text-slate-200 mt-0.5">
              {speed.pageSizeKb} KB
            </p>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-4 leading-relaxed font-semibold">
          💡 Ideal payload is &lt;1.5MB. Compressing assets using Gzip/Brotli could cut this size by up to 60%.
        </p>
      </Card>

    </div>
  );
};
export default AuditSpeed;
