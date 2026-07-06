import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { leadRepository } from '../../shared/services/leadRepository';
import { companyRepository } from '../../shared/services/companyRepository';
import { auditRepository } from '../../shared/services/auditRepository';
import type { Lead } from '../../shared/types';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { 
  ArrowLeft, 
  ExternalLink, 
  Activity, 
  FileText, 
  Sliders, 
  Phone, 
  Mail
} from 'lucide-react';

export const LeadDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState<string | null>(null);
  
  // Custom Fields Mock data
  const [showEmptyFields, setShowEmptyFields] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState<string[]>([
    'Acquired via CSV list target upload.',
    'Identified high potential for custom SEO rebuild contract.'
  ]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const unsubscribe = leadRepository.subscribeWithCompanies((leadsList) => {
      const found = leadsList.find(l => l.id === id);
      if (found) setLead(found);
      setLoading(false);
    });
    return unsubscribe;
  }, [id]);

  const handleEnrichJob = async (jobType: string) => {
    if (!lead || !lead.company || !lead.company.website) return;
    setEnriching(jobType);
    try {
      // Run the crawl backend API
      const report = await auditRepository.runCrawl(lead.company.website);
      
      // Map results back to company record fields
      await companyRepository.update(lead.company.id, {
        phone: report.business.phone || lead.company.phone,
        email: report.business.email || lead.company.email,
        socialLinks: {
          instagram: report.business.socials.instagram || lead.company.socialLinks?.instagram,
          facebook: report.business.socials.facebook || lead.company.socialLinks?.facebook,
          linkedin: report.business.socials.linkedin || lead.company.socialLinks?.linkedin,
          twitter: report.business.socials.twitter,
          youtube: report.business.socials.youtube,
        },
        techStack: report.techStack,
        seoScore: report.scores.seo,
        localSeoScore: report.localSeoScore,
        performanceScore: report.scores.performance,
        listingClaimed: report.listingClaimed,
        permanentlyClosed: report.permanentlyClosed,
        temporarilyClosed: report.temporarilyClosed,
        sitemapExists: report.sitemapExists,
        h1Count: report.h1Count,
        onPageBreakdown: report.onPageBreakdown,
        speedMetrics: {
          lcp: report.speed.lcp,
          cls: report.speed.cls,
          tbt: report.speed.tbt,
          inp: report.speed.inp || 0
        },
        issues: report.issues
      });

    } catch (e) {
      console.error('Enrichment job failed:', e);
    } finally {
      setEnriching(null);
    }
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    setNotes(prev => [...prev, noteText.trim()]);
    setNoteText('');
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-2"></div>
        <span>Syncing prospect files...</span>
      </div>
    );
  }

  if (!lead || !lead.company) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p className="text-sm">Lead details not found.</p>
        <Link to="/leads" className="text-xs text-[#D4AF37] hover:underline mt-2 inline-block">Back to database</Link>
      </div>
    );
  }

  const c = lead.company;
  const hasEnrichmentData = c.techStack && c.techStack.length > 0;
  
  // Custom properties variables
  const isLcpPoor = (c.speedMetrics?.lcp || 0) > 4.0;
  const enrichedCount = (c.techStack ? 1 : 0) + (c.seoScore ? 1 : 0) + (c.speedMetrics ? 1 : 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-xs text-slate-700 dark:text-slate-300 font-semibold">
      
      {/* Return Navigation Link */}
      <div className="flex justify-between items-center">
        <Link to="/leads" className="inline-flex items-center text-xs text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer">
          <ArrowLeft size={13} className="mr-2" />
          <span>Back</span>
        </Link>
      </div>

      {/* Profile Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-slate-900 pb-5">
        <div>
          <h1 className="text-xl font-black text-slate-850 dark:text-white uppercase tracking-wide">
            {c.name}
          </h1>
          {c.website ? (
            <a 
              href={c.website.startsWith('http') ? c.website : `https://${c.website}`} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#D4AF37] hover:underline flex items-center mt-1"
            >
              <span>{c.website}</span>
              <ExternalLink size={10} className="ml-1" />
            </a>
          ) : (
            <p className="text-slate-400 mt-1">Website not set</p>
          )}
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Button 
            variant="secondary"
            isLoading={enriching === 'all'} 
            onClick={() => handleEnrichJob('all')}
          >
            Scrape All (Warm)
          </Button>
          <button 
            onClick={() => handleEnrichJob('crawler')}
            className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shrink-0 cursor-pointer"
          >
            Enrichment log
          </button>
          <span className="px-2.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-400 border border-slate-200/50 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider">
            csv_upload
          </span>
        </div>
      </div>

      {/* Main Grid Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side (Col Span 2): Data Cards & SEO */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Main All Data Block */}
          <Card>
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-850 dark:text-white">All data</h3>
                <p className="text-[10px] text-slate-400 font-medium">19 of 45 fields populated · 7 matched</p>
              </div>
              <label className="flex items-center space-x-2 text-[10px] text-slate-400 font-bold select-none cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={showEmptyFields} 
                  onChange={(e) => setShowEmptyFields(e.target.checked)}
                  className="rounded border-slate-350 focus:ring-0 text-[#0B1F3A]" 
                />
                <span>Show empty fields</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              
              {/* Contact Info */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 pb-1">
                  Contact Info
                </p>
                <div>
                  <span className="text-slate-400 text-[10px] block">Website</span>
                  <span className="text-slate-700 dark:text-slate-200">{c.website || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Phone</span>
                  <span className="text-slate-700 dark:text-slate-200">{c.phone || '—'}</span>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 pb-1">
                  Location
                </p>
                <div>
                  <span className="text-slate-400 text-[10px] block">Address</span>
                  <span className="text-slate-700 dark:text-slate-200">{c.address?.street || '21771 E ORION WAY'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px] block">City</span>
                    <span className="text-slate-700 dark:text-slate-200">{c.address?.city || 'QUEEN CREEK'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">State</span>
                    <span className="text-slate-700 dark:text-slate-200">{c.address?.state || 'AZ'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ZIP</span>
                    <span className="text-slate-700 dark:text-slate-200">{c.address?.pincode || '85142'}</span>
                  </div>
                </div>
              </div>

              {/* Demographics & Description */}
              <div className="sm:col-span-2 space-y-2">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 pb-1">
                  Demographics
                </p>
                <div>
                  <span className="text-slate-400 text-[10px] block">Description</span>
                  <span className="text-slate-650 dark:text-slate-350 leading-relaxed block">
                    {c.description || 'Assisted Living Facilities for the Elderly'}
                  </span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 pb-1">
                  Social
                </p>
                <div>
                  <span className="text-slate-400 text-[10px] block">LinkedIn</span>
                  <span className="text-slate-700 dark:text-slate-200 truncate block max-w-xs">{c.socialLinks?.linkedin || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Instagram</span>
                  <span className="text-slate-700 dark:text-slate-200 truncate block max-w-xs">{c.socialLinks?.instagram || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Facebook</span>
                  <span className="text-slate-700 dark:text-slate-200 truncate block max-w-xs">{c.socialLinks?.facebook || '—'}</span>
                </div>
              </div>

              {/* Technical Scores */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 pb-1">
                  Technical
                </p>
                <div>
                  <span className="text-slate-400 text-[10px] block">Tech Stack</span>
                  <span className="text-slate-750 dark:text-slate-200 truncate block max-w-xs">{c.techStack?.join(', ') || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px] block">SEO</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">{c.seoScore || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Local SEO</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">{c.localSeoScore || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Perf</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">{c.performanceScore || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Status parameters */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 pb-1">
                  Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Listing Claimed</span>
                    <span className="text-slate-700 dark:text-slate-200">{c.listingClaimed !== undefined ? (c.listingClaimed ? 'Yes' : 'No') : '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Permanently Closed</span>
                    <span className="text-slate-700 dark:text-slate-200">{c.permanentlyClosed !== undefined ? (c.permanentlyClosed ? 'Yes' : 'No') : '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Temporarily Closed</span>
                    <span className="text-slate-700 dark:text-slate-200">{c.temporarilyClosed !== undefined ? (c.temporarilyClosed ? 'Yes' : 'No') : '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Outreach Status</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">not_contacted</span>
                  </div>
                </div>
              </div>

              {/* Source parameters */}
              <div className="space-y-2">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100 dark:border-slate-900 pb-1">
                  Source
                </p>
                <div>
                  <span className="text-slate-400 text-[10px] block">Source</span>
                  <span className="text-slate-700 dark:text-slate-205 font-bold uppercase">csv_upload</span>
                </div>
              </div>

            </div>
          </Card>

          {/* Custom Fields list (Eden adult facility sample) */}
          <Card title="Custom Fields">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-100 dark:border-slate-900">
                <span className="text-[9px] text-slate-400 block font-bold">Carrier Route</span>
                <span className="text-slate-750 dark:text-slate-200 font-extrabold">R062</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-100 dark:border-slate-900">
                <span className="text-[9px] text-slate-400 block font-bold">Contact Name</span>
                <span className="text-slate-750 dark:text-slate-200 font-extrabold">LOURDES KLEEN</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-100 dark:border-slate-900">
                <span className="text-[9px] text-slate-400 block font-bold">County</span>
                <span className="text-slate-750 dark:text-slate-200 font-extrabold">MARICOPA</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-100 dark:border-slate-900">
                <span className="text-[9px] text-slate-400 block font-bold">Employees</span>
                <span className="text-slate-750 dark:text-slate-200 font-extrabold">10 to 19</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-100 dark:border-slate-900">
                <span className="text-[9px] text-slate-400 block font-bold">NAICS Code</span>
                <span className="text-slate-750 dark:text-slate-200 font-extrabold">623312</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-100 dark:border-slate-900">
                <span className="text-[9px] text-slate-400 block font-bold">SIC Code</span>
                <span className="text-slate-750 dark:text-slate-200 font-extrabold">80591401</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-100 dark:border-slate-900">
                <span className="text-[9px] text-slate-400 block font-bold">Sales Volume</span>
                <span className="text-slate-750 dark:text-slate-200 font-extrabold">$500,000 to $1M</span>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded border border-slate-100 dark:border-slate-900">
                <span className="text-[9px] text-slate-400 block font-bold">Title</span>
                <span className="text-slate-750 dark:text-slate-200 font-extrabold">TREASURER</span>
              </div>
            </div>
          </Card>

          {/* Discovered contact list details (numbered) */}
          <Card title="Discovered Contact Information" subtitle="Discovered contact endpoints and socials parsed.">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Discovered Emails</p>
                {c.email ? (
                  <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-900 p-2.5 rounded border border-slate-100 dark:border-slate-900 font-medium">
                    <Mail size={12} className="text-[#D4AF37] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[8px] text-slate-400 font-bold">Email 1</p>
                      <span className="text-slate-700 dark:text-slate-200 font-semibold break-all block">
                        {c.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500">—</p>
                )}
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Discovered Phones</p>
                <div className="space-y-2">
                  {[
                    { num: c.phone || '4808196453', label: 'website_crawler · primary' },
                    { num: `+1-${c.phone || '4808196453'}`, label: 'website_crawler' },
                    { num: '520-648-4082', label: 'website_crawler' },
                    { num: '520-648-7870', label: 'website_crawler' }
                  ].map((item, idx) => (
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
            </div>
          </Card>

          {/* SEO & Performance card breakdown */}
          {hasEnrichmentData && (
            <Card>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-900 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-850 dark:text-white">SEO & Performance</h3>
                  <p className="text-[10px] text-slate-400 font-medium">On-page audit · 7/3/2026</p>
                </div>
                <div className="flex space-x-2 text-[10px] font-bold">
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded">
                    SEO {c.seoScore}
                  </span>
                  <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded">
                    Speed {c.performanceScore}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4 bg-slate-50/50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 text-center">
                <div>
                  <p className="text-[10px] text-slate-450 uppercase tracking-wider font-bold">On-page</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-0.5">
                    {c.onPageBreakdown?.onPage || '33'}/40
                  </p>
                </div>
                <div className="border-l border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Technical</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-0.5">
                    {c.onPageBreakdown?.technical || '35'}/35
                  </p>
                </div>
                <div className="border-l border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Social</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-0.5">
                    {c.onPageBreakdown?.social || '10'}/10
                  </p>
                </div>
                <div className="border-l border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-455 uppercase tracking-wider font-bold">Content</p>
                  <p className="text-base font-black text-slate-800 dark:text-white mt-0.5">
                    {c.onPageBreakdown?.content || '11'}/15
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700 dark:text-slate-350">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Title Element Tag</p>
                  <p className="text-slate-850 dark:text-slate-200 font-mono bg-slate-50 dark:bg-slate-900/60 p-2 rounded border border-slate-200/50 dark:border-slate-800">
                    "{c.name} - Senior Care Community in Arizona" <span className="text-[#D4AF37] font-bold">({(c.name.length + 30)})</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
                  <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                    <span className="text-[10px] text-slate-400 block mb-0.5">H1 Count</span>
                    <span className="text-slate-850 dark:text-white font-bold">{c.h1Count || 1}</span>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                    <span className="text-[10px] text-slate-400 block mb-0.5">HTTPS Encrypted</span>
                    <span className="text-emerald-500 font-bold">Yes</span>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Sitemap Detected</span>
                    <span className={c.sitemapExists !== false ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                      {c.sitemapExists !== false ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {/* PageSpeed scores mobile */}
                {c.speedMetrics && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-900">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">PageSpeed Insights Vitals</p>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850 text-center">
                        <span className="text-[9px] text-slate-450 block">LCP</span>
                        <span className={`text-xs font-black block mt-0.5 ${isLcpPoor ? 'text-rose-500' : 'text-emerald-500'}`}>{c.speedMetrics.lcp}s</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full border mt-1 inline-block ${isLcpPoor ? 'bg-rose-500/10 text-rose-500 border-rose-500/15' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15'}`}>
                          {isLcpPoor ? 'poor' : 'good'}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850 text-center">
                        <span className="text-[9px] text-slate-450 block">CLS</span>
                        <span className="text-xs font-black text-emerald-500 block mt-0.5">{c.speedMetrics.cls}</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 mt-1 inline-block">good</span>
                      </div>
                      <div className="bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850 text-center">
                        <span className="text-[9px] text-slate-450 block">INP</span>
                        <span className="text-xs font-black text-slate-400 block mt-0.5">{c.speedMetrics.inp}ms</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/15 mt-1 inline-block">unknown</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Activity Logs card */}
          <Card title="Activity">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-xs">
                <Activity size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-850 dark:text-white font-bold">Enrichment completed — pageSpeed insights</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">updated performanceScore, performanceAudit, websiteSpeedmetrics • 23 days ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs">
                <Activity size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-850 dark:text-white font-bold">Enrichment completed — website seo audit</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">updated seoScore, localSeoscore, sitemapExists • 23 days ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs">
                <Activity size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-850 dark:text-white font-bold">Enrichment completed — website crawler</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">updated email, emailDone, phoneNumbers, linkedin, instagram, facebook • 23 days ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-xs border-t border-slate-100 dark:border-slate-900 pt-3">
                <FileText size={14} className="text-slate-450 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-850 dark:text-white font-bold">Imported via CSV upload</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Added to target prospects database directory • 23 days ago</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Notes text area */}
          <Card title="Notes">
            <div className="space-y-4">
              {notes.length > 0 && (
                <div className="space-y-2">
                  {notes.map((n, idx) => (
                    <p key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-150/40 dark:border-slate-850 rounded-lg text-slate-600 dark:text-slate-400 text-xs">
                      {n}
                    </p>
                  ))}
                </div>
              )}
              <div className="space-y-2.5">
                <textarea 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Type a new workspace note for this lead profile..."
                  className="w-full min-h-[80px] p-3 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 focus:border-[#D4AF37] focus:ring-0 resize-none text-slate-800 dark:text-slate-100"
                />
                <div className="flex justify-end">
                  <Button onClick={handleSaveNote}>
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* Right Side (Col Span 1): Enrichment Actions Panel */}
        <div className="space-y-6">
          
          {/* Company Enrichment widget panel */}
          <Card title="Company Enrichment" subtitle="Runs Crawler, website SEO Audit, PageSpeed, BuiltWith, Places, Hunter.io.">
            <div className="space-y-4 pt-2">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg font-bold flex items-center justify-between text-[11px]">
                <span>Enrichment status</span>
                <span className="bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[9px]">
                  {enrichedCount > 0 ? `${enrichedCount} done` : '2 done'} · 6/3/2026
                </span>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={() => handleEnrichJob('crawler')}
                  isLoading={enriching === 'crawler'}
                  className="w-full justify-center"
                >
                  Scrape Website & Social
                </Button>
                <p className="text-[10px] text-slate-400 text-center font-medium mt-0.5">
                  Runs: crawler + tech audit + PageSpeed + contact detection
                </p>

                <button 
                  onClick={() => handleEnrichJob('seo')}
                  disabled={!!enriching}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/80 rounded-lg font-bold text-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  {enriching === 'seo' ? 'Enriching...' : 'SEO & PageSpeed Audit'}
                </button>

                <button 
                  onClick={() => handleEnrichJob('dataforseo')}
                  disabled={!!enriching}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/80 rounded-lg font-bold text-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  SEO Intelligence (DataForSEO)
                </button>

                <button 
                  onClick={() => handleEnrichJob('profile')}
                  disabled={!!enriching}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/80 rounded-lg font-bold text-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  Company Profile (APIs)
                </button>

                <button 
                  onClick={() => handleEnrichJob('full')}
                  disabled={!!enriching}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800/80 rounded-lg font-bold text-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                >
                  Full Profile + SEO (APIs)
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-900/60 flex justify-between text-[10px] font-bold text-[#D4AF37]">
                <button onClick={() => handleEnrichJob('crawler')} className="hover:underline flex items-center shrink-0 cursor-pointer">
                  <Activity size={10} className="mr-1" /> Enrichment log
                </button>
                <Link to="/extension-hub" className="hover:underline flex items-center shrink-0">
                  <Sliders size={10} className="mr-1" /> Open in Extension Hub
                </Link>
              </div>
            </div>
          </Card>

          {/* Manage Custom Fields Info widget */}
          <Card title="Custom fields" subtitle="Properties of this organization profile.">
            <div className="space-y-3.5 pt-2">
              <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100 dark:border-slate-900/65">
                <span className="text-slate-400 font-bold">Carrier Route</span>
                <span className="text-slate-750 dark:text-slate-100 font-extrabold">R062</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100 dark:border-slate-900/65">
                <span className="text-slate-400 font-bold">Contact Name</span>
                <span className="text-slate-750 dark:text-slate-100 font-extrabold text-right">LOURDES KLEEN</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100 dark:border-slate-900/65">
                <span className="text-slate-400 font-bold">County</span>
                <span className="text-slate-750 dark:text-slate-100 font-extrabold">MARICOPA</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100 dark:border-slate-900/65">
                <span className="text-slate-400 font-bold">Employees</span>
                <span className="text-slate-750 dark:text-slate-100 font-extrabold">10 to 19</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-1.5 border-b border-slate-100 dark:border-slate-900/65">
                <span className="text-slate-400 font-bold">NAICS Code</span>
                <span className="text-slate-750 dark:text-slate-100 font-extrabold">623312</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Sales Volume</span>
                <span className="text-slate-750 dark:text-slate-100 font-extrabold">$500,000 to $1M</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-900/60 flex justify-end">
                <button className="px-3 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-lg border border-slate-200/50 dark:border-slate-800/80 transition-colors shrink-0 cursor-pointer">
                  Manage
                </button>
              </div>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};
export default LeadDetailView;
