import React, { useState, useEffect } from 'react';
import { Button } from '../../shared/components/Button';
import { Globe, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuditSearchProps {
  searchUrl: string;
  setSearchUrl: (val: string) => void;
  onSearch: (url: string) => Promise<void>;
  crawling: boolean;
  error: string | null;
}

const crawlSteps = [
  'Verifying target domain DNS registers...',
  'Scraping DOM structure markup & stylesheet arrays...',
  'Detecting frameworks and active tag pixels...',
  'Calculating Lighthouse Core Web Vitals...',
  'Running Gemini AI outreach copywriter...'
];

export const AuditSearch: React.FC<AuditSearchProps> = ({
  searchUrl,
  setSearchUrl,
  onSearch,
  crawling,
  error,
}) => {
  const [crawlStep, setCrawlStep] = useState(0);

  useEffect(() => {
    if (!crawling) {
      setCrawlStep(0);
      return;
    }
    const interval = setInterval(() => {
      setCrawlStep(step => (step < crawlSteps.length - 1 ? step + 1 : step));
    }, 3000);
    return () => clearInterval(interval);
  }, [crawling]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchUrl.trim()) {
      onSearch(searchUrl);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Globe size={15} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Enter target website URL (e.g. acme.com)..."
            value={searchUrl}
            onChange={(e) => setSearchUrl(e.target.value)}
            disabled={crawling}
            className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-xl text-slate-700 dark:text-slate-200"
            required
          />
        </div>
        <Button type="submit" isLoading={crawling} className="flex items-center space-x-1">
          <Sparkles size={13} />
          <span>Launch Audit Scan</span>
        </Button>
      </form>

      {/* Crawling Progress Loader */}
      <AnimatePresence>
        {crawling && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-[#0B1F3A] text-white border border-[#D4AF37]/35 rounded-2xl shadow-lg relative overflow-hidden"
          >
            {/* Spinning decorative background */}
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-48 w-48 rounded-full bg-[#D4AF37]/5 blur-3xl" />
            
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent shrink-0" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">Outreach Crawler Active</p>
                <p className="text-xs text-slate-300 font-semibold mt-1 transition-all duration-300">
                  {crawlSteps[crawlStep]}
                </p>
              </div>
            </div>
            
            <div className="mt-4 w-full bg-slate-800/80 h-1 rounded-full overflow-hidden">
              <motion.div 
                className="bg-[#D4AF37] h-full"
                animate={{ width: `${((crawlStep + 1) / crawlSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-xs font-bold flex items-center">
          <ShieldAlert size={14} className="mr-2 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};
export default AuditSearch;
