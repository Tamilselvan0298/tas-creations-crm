import React, { useState } from 'react';
import type { LeadScoreReport } from '../../shared/services/aiRepository';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Sparkles, Activity, ShieldAlert } from 'lucide-react';

interface LeadScorerProps {
  report: LeadScoreReport | null;
  loading: boolean;
  onScoreLead: (factors: any) => Promise<void>;
}

export const LeadScorer: React.FC<LeadScorerProps> = ({
  report,
  loading,
  onScoreLead,
}) => {
  const [hasWebsite, setHasWebsite] = useState(true);
  const [reviewsCount, setReviewsCount] = useState(15);
  const [googleRating, setGoogleRating] = useState(4.2);
  const [hasMetaPixel, setHasMetaPixel] = useState(false);
  const [hasGtm, setHasGtm] = useState(false);
  const [pageSpeed, setPageSpeed] = useState(45);
  const [ssl, setSsl] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScoreLead({
      hasWebsite,
      reviewsCount,
      googleRating,
      hasMetaPixel,
      hasGtm,
      pageSpeed,
      ssl,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Parameter Inputs Column */}
      <Card title="Lead Audit Criteria factors" subtitle="Select values to run calculations.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-650 dark:text-slate-200 font-semibold">Has Primary Website</span>
            <input type="checkbox" checked={hasWebsite} onChange={(e) => setHasWebsite(e.target.checked)} className="cursor-pointer h-4 w-4" />
          </div>
          
          <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-650 dark:text-slate-200 font-semibold">Meta Pixel Tracking</span>
            <input type="checkbox" checked={hasMetaPixel} onChange={(e) => setHasMetaPixel(e.target.checked)} className="cursor-pointer h-4 w-4" />
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-650 dark:text-slate-200 font-semibold">Google Tag Manager</span>
            <input type="checkbox" checked={hasGtm} onChange={(e) => setHasGtm(e.target.checked)} className="cursor-pointer h-4 w-4" />
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-650 dark:text-slate-200 font-semibold">SSL HTTPS Configured</span>
            <input type="checkbox" checked={ssl} onChange={(e) => setSsl(e.target.checked)} className="cursor-pointer h-4 w-4" />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Google Maps Reviews count</label>
            <input type="number" value={reviewsCount} onChange={(e) => setReviewsCount(parseInt(e.target.value, 10))} className="text-xs p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none" min={0} />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Google maps rating ({googleRating} ★)</label>
            <input type="range" value={googleRating} onChange={(e) => setGoogleRating(parseFloat(e.target.value))} className="cursor-pointer" min={0} max={5} step={0.1} />
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Lighthouse Speed Score ({pageSpeed}/100)</label>
            <input type="range" value={pageSpeed} onChange={(e) => setPageSpeed(parseInt(e.target.value, 10))} className="cursor-pointer" min={1} max={100} />
          </div>

          <Button type="submit" size="sm" className="w-full flex items-center justify-center space-x-1.5" isLoading={loading}>
            <Sparkles size={12} />
            <span>Generate Opportunity Score</span>
          </Button>
        </form>
      </Card>

      {/* Outputs Dashboard Column */}
      <div className="md:col-span-2 space-y-6">
        {report ? (
          <Card title="Sales Opportunity Audit result" subtitle="AI opportunities categorization ledger.">
            
            {/* Visual Dial block */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6 mt-4">
              <div className="h-28 w-28 rounded-full border-4 border-[#D4AF37] flex flex-col items-center justify-center relative shrink-0 shadow-lg shadow-[#D4AF37]/5 bg-[#0B1F3A] text-white">
                <span className="text-3xl font-black">{report.score}</span>
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#D4AF37] mt-0.5">SCORE</span>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Classification:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    report.opportunity === 'High'
                      ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600'
                      : report.opportunity === 'Medium'
                      ? 'bg-amber-100 dark:bg-amber-950/20 text-amber-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {report.opportunity} Opportunity
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-sm">
                  {report.reasoning}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex items-center space-x-3 mt-6">
              <Activity size={18} className="text-[#D4AF37] shrink-0" />
              <p className="text-[10px] text-slate-400 font-semibold leading-snug">
                This score computes lead optimization potentials. Prospects missing primary tracking scripts (GA4/Meta) or loading speed values &lt;50 are high conversion targets.
              </p>
            </div>

          </Card>
        ) : (
          <Card className="h-full flex flex-col items-center justify-center text-center p-12">
            <ShieldAlert size={32} className="text-slate-300 dark:text-slate-700 mb-2" />
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">Select parameters and click "Generate Opportunity Score" to view report metrics.</span>
          </Card>
        )}
      </div>

    </div>
  );
};
export default LeadScorer;
