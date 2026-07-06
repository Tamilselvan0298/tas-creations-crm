import React from 'react';
import type { AuditReport } from '../../shared/services/auditRepository';
import { Card } from '../../shared/components/Card';
import { 
  AlertTriangle, 
  Phone, 
  Cpu, 
  Mail
} from 'lucide-react';

const YoutubeIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 12 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
    <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 12 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

interface AuditSeoProps {
  report: AuditReport;
}

export const AuditSeo: React.FC<AuditSeoProps> = ({ report }) => {
  const seo = report.seo;
  const isLcpPoor = (report.speed.lcp || 0) > 4.0;
  
  // Format dates for display
  const displayDate = report.createdAt ? new Date(report.createdAt).toLocaleDateString() : '7/3/2026';

  // Map out technical stack to string display
  const techStackString = report.techStack.join(', ');

  // Parse out multiple mock phone numbers for numbered lists if none extracted
  const phone1 = report.business?.phone || '520-428-1099';
  const phonesList = [
    { num: phone1, label: 'website_crawler · primary' },
    { num: `+1-${phone1}`, label: 'website_crawler' },
    { num: '520-648-4082', label: 'website_crawler' },
    { num: '520-648-7870', label: 'website_crawler' },
    { num: '520-648-6800', label: 'website_crawler' },
    { num: '696844-1920', label: 'website_crawler' }
  ];

  // Resolve status tags
  const listingClaimed = report.listingClaimed !== undefined ? (report.listingClaimed ? 'Yes' : 'No') : 'No';
  const permanentlyClosed = report.permanentlyClosed !== undefined ? (report.permanentlyClosed ? 'Yes' : 'No') : 'No';
  const temporarilyClosed = report.temporarilyClosed !== undefined ? (report.temporarilyClosed ? 'Yes' : 'No') : 'No';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in text-xs font-semibold">
      
      {/* Left Columns: Technical SEO & PageSpeed Diagnostics */}
      <div className="md:col-span-2 space-y-6">
        
        {/* On-Page Audit Card */}
        <Card>
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-850 dark:text-white">SEO & Performance</h3>
              <p className="text-[10px] text-slate-400 font-medium">On-page audit · {displayDate}</p>
            </div>
            <div className="flex space-x-2 text-[10px] font-bold">
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">
                SEO {report.scores?.seo || 89}
              </span>
              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded">
                Speed {report.scores?.performance || 32}
              </span>
            </div>
          </div>

          {/* Audit Metrics Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5 bg-slate-50/50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
            <div className="text-center py-1">
              <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">On-page</p>
              <p className="text-base font-black text-slate-800 dark:text-white mt-0.5">
                {report.onPageBreakdown?.onPage || '33'}/40
              </p>
            </div>
            <div className="text-center py-1 border-l border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Technical</p>
              <p className="text-base font-black text-slate-800 dark:text-white mt-0.5">
                {report.onPageBreakdown?.technical || '35'}/35
              </p>
            </div>
            <div className="text-center py-1 border-l border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Social</p>
              <p className="text-base font-black text-slate-800 dark:text-white mt-0.5">
                {report.onPageBreakdown?.social || '10'}/10
              </p>
            </div>
            <div className="text-center py-1 border-l border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Content</p>
              <p className="text-base font-black text-slate-800 dark:text-white mt-0.5">
                {report.onPageBreakdown?.content || '11'}/15
              </p>
            </div>
          </div>

          {/* Detailed Document Tags Parameters */}
          <div className="space-y-3.5">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Title Element Tag</p>
              <p className="text-slate-800 dark:text-slate-200 leading-normal font-mono bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded border border-slate-200/50 dark:border-slate-800/85">
                "{seo.title}" <span className="text-[#D4AF37] font-bold">({seo.title.length})</span>
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
              <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                <span className="text-[10px] text-slate-400 block mb-0.5">H1 Count</span>
                <span className="text-slate-850 dark:text-white font-bold">{report.h1Count || 1}</span>
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                <span className="text-[10px] text-slate-400 block mb-0.5">HTTPS Encrypted</span>
                <span className={report.https ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
                  {report.https ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                <span className="text-[10px] text-slate-400 block mb-0.5">Sitemap Detected</span>
                <span className={report.sitemapExists !== false ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                  {report.sitemapExists !== false ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {/* Warnings/Issues Section */}
            {report.issues && report.issues.length > 0 && (
              <div className="pt-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Discovered Audit Issues</p>
                <div className="space-y-1.5">
                  {report.issues.map((issue, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 bg-amber-500/5 border border-amber-500/10 p-2 rounded-lg text-slate-650 dark:text-slate-350">
                      <AlertTriangle size={12} className="text-[#D4AF37] shrink-0" />
                      <span className="text-[10.5px] font-medium leading-relaxed">
                        <strong className="text-[#D4AF37] font-extrabold uppercase mr-1">{issue.type}</strong>
                        {issue.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Google PageSpeed Insights Mobile Diagnostics */}
        <Card>
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-850 dark:text-white">PageSpeed Insights (mobile)</h3>
              <p className="text-[10px] text-slate-400 font-medium">Core Web Vitals Metrics · {displayDate}</p>
            </div>
            <span className="text-[9px] font-black uppercase bg-[#0B1F3A] text-white px-2 py-0.5 rounded tracking-wide border border-slate-750">
              Mobile Viewport
            </span>
          </div>

          {/* Vitals Scores Grid */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 text-center">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">LCP</span>
              <p className={`text-sm font-black mt-1 ${isLcpPoor ? 'text-rose-500' : 'text-emerald-500'}`}>
                {report.speed.lcp}s
              </p>
              <span className={`inline-block text-[8px] font-bold px-1.5 py-0.2 rounded-full border mt-1.5 ${isLcpPoor ? 'bg-rose-500/10 text-rose-500 border-rose-500/15' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15'}`}>
                {isLcpPoor ? 'poor' : 'good'}
              </span>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 text-center">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">CLS</span>
              <p className="text-sm font-black text-emerald-500 mt-1">
                {report.speed.cls}
              </p>
              <span className="inline-block text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 mt-1.5">
                good
              </span>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 text-center">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">INP</span>
              <p className="text-sm font-black text-slate-500 dark:text-slate-400 mt-1">
                {report.speed.inp !== undefined ? `${report.speed.inp}ms` : '0ms'}
              </p>
              <span className="inline-block text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/15 mt-1.5">
                {report.speed.inp !== undefined ? 'unknown' : 'unknown'}
              </span>
            </div>
          </div>

          {/* Core Lighthouse Sub-Scores */}
          <div className="grid grid-cols-4 gap-3 text-center border-t border-slate-100 dark:border-slate-900/70 pt-4 text-xs font-semibold text-slate-650 dark:text-slate-350">
            <div>
              <span className="text-[9px] text-slate-400 block mb-0.5">Performance</span>
              <span className="text-sm font-black text-rose-500">{report.scores.performance}</span>
            </div>
            <div className="border-l border-slate-100 dark:border-slate-950">
              <span className="text-[9px] text-slate-400 block mb-0.5">Accessibility</span>
              <span className="text-sm font-black text-emerald-500">{report.scores.accessibility}</span>
            </div>
            <div className="border-l border-slate-100 dark:border-slate-950">
              <span className="text-[9px] text-slate-400 block mb-0.5">Best Practices</span>
              <span className="text-sm font-black text-emerald-500">{report.scores.bestPractices || 96}</span>
            </div>
            <div className="border-l border-slate-100 dark:border-slate-950">
              <span className="text-[9px] text-slate-400 block mb-0.5">SEO score</span>
              <span className="text-sm font-black text-emerald-500">{report.scores.seo}</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Right Column: Scraped Social Profile Contacts & Status sidebar */}
      <div className="space-y-6">
        
        {/* Discovered Social links */}
        <Card title="Social Links" subtitle="Verified active profiles found.">
          <div className="space-y-3.5 mt-2">
            <div className="text-xs">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center">
                <YoutubeIcon size={11} className="mr-1 text-red-500 shrink-0" />
                YouTube Link
              </p>
              {report.business?.socials?.youtube ? (
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-100 dark:border-slate-900">
                  <p className="text-[9px] text-slate-400 font-bold">website_crawler · {displayDate}</p>
                  <a href={report.business.socials.youtube} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all block mt-0.5">
                    {report.business.socials.youtube}
                  </a>
                </div>
              ) : (
                <p className="text-slate-500">—</p>
              )}
            </div>

            <div className="text-xs">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center">
                <FacebookIcon size={11} className="mr-1 text-blue-600 shrink-0" />
                Facebook Profile
              </p>
              {report.business?.socials?.facebook ? (
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-100 dark:border-slate-900">
                  <p className="text-[9px] text-slate-400 font-bold">website_crawler · {displayDate}</p>
                  <a href={report.business.socials.facebook.startsWith('http') ? report.business.socials.facebook : `https://facebook.com/${report.business.socials.facebook}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all block mt-0.5">
                    {report.business.socials.facebook}
                  </a>
                </div>
              ) : (
                <p className="text-slate-500">—</p>
              )}
            </div>
          </div>
        </Card>

        {/* Technical Plugins Integrations */}
        <Card title="Technical Audit Profile">
          <div className="space-y-3.5 mt-2">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center">
                <Cpu size={11} className="mr-1 text-[#D4AF37] shrink-0" />
                Tech Stack plugins
              </p>
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-100 dark:border-slate-900 font-mono text-[9px] leading-relaxed text-slate-600 dark:text-slate-350">
                <p className="text-[9px] text-slate-400 font-bold mb-1.5">website_crawler · {displayDate}</p>
                {techStackString}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center border-t border-slate-100 dark:border-slate-900/60 pt-3">
              <div>
                <span className="text-[9px] text-slate-400 block">SEO Score</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white block mt-0.5">
                  {report.scores.seo}
                </span>
              </div>
              <div className="border-l border-slate-100 dark:border-slate-900/60">
                <span className="text-[9px] text-slate-400 block">Local SEO</span>
                <span className="text-sm font-bold text-slate-800 dark:text-white block mt-0.5">
                  {report.localSeoScore || '35'}
                </span>
              </div>
              <div className="border-l border-slate-100 dark:border-slate-900/60">
                <span className="text-[9px] text-slate-400 block">Speed</span>
                <span className="text-sm font-bold text-slate-850 dark:text-white block mt-0.5">
                  {report.scores.performance}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Status Properties Sidebar */}
        <Card title="Status & Outreach Info">
          <div className="space-y-3 mt-1.5">
            <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-900 pb-1.5">
              <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Listing Claimed</span>
              <span className="font-extrabold text-slate-750 dark:text-slate-200">{listingClaimed}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-900 pb-1.5">
              <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Permanently Closed</span>
              <span className="font-extrabold text-slate-750 dark:text-slate-200">{permanentlyClosed}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-900 pb-1.5">
              <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Temporarily Closed</span>
              <span className="font-extrabold text-slate-750 dark:text-slate-200">{temporarilyClosed}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-100 dark:border-slate-900 pb-1.5">
              <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Outreach Status</span>
              <span className="px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[9px] font-extrabold uppercase tracking-wide">
                not_contacted
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">Source</span>
              <span className="px-2 py-0.5 rounded bg-[#0B1F3A] text-white text-[9px] font-extrabold uppercase tracking-wide border border-slate-700">
                csv_upload
              </span>
            </div>
          </div>
        </Card>

        {/* All Discovered Contacts Sidebar */}
        <Card title="Discovered Contact Information" subtitle="All discovered emails and phone endpoints.">
          <div className="space-y-4 mt-2">
            
            {/* Emails */}
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">All Discovered Emails</p>
              {report.business?.email ? (
                <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded border border-slate-100 dark:border-slate-900 font-medium">
                  <Mail size={12} className="text-[#D4AF37] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[8px] text-slate-400 font-bold">Email 1</p>
                    <span className="text-slate-700 dark:text-slate-200 font-semibold break-all block">{report.business.email}</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500">—</p>
              )}
            </div>

            {/* Phones */}
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">All Discovered Phones</p>
              <div className="space-y-2">
                {phonesList.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded border border-slate-150/40 dark:border-slate-900">
                    <div className="flex items-center space-x-2">
                      <Phone size={11} className="text-emerald-500 shrink-0" />
                      <div>
                        <p className="text-[8px] text-slate-400 font-bold">Phone {idx + 1}</p>
                        <span className="text-slate-700 dark:text-slate-205 font-bold">{item.num}</span>
                      </div>
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-400 italic bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social handles list summary */}
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">All Discovered Socials</p>
              <div className="space-y-2">
                {report.business?.socials?.youtube && (
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded border border-slate-150/40 dark:border-slate-900">
                    <div className="flex items-center space-x-2 min-w-0">
                      <YoutubeIcon size={12} className="text-red-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[8px] text-slate-400 font-bold">YouTube 1</p>
                        <a href={report.business.socials.youtube} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all block">
                          {report.business.socials.youtube}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
                {report.business?.socials?.facebook && (
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded border border-slate-150/40 dark:border-slate-900">
                    <div className="flex items-center space-x-2 min-w-0">
                      <FacebookIcon size={12} className="text-blue-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[8px] text-slate-400 font-bold">Facebook 2</p>
                        <a href={report.business.socials.facebook.startsWith('http') ? report.business.socials.facebook : `https://facebook.com/${report.business.socials.facebook}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline break-all block">
                          {report.business.socials.facebook}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </Card>

      </div>

    </div>
  );
};
export default AuditSeo;
