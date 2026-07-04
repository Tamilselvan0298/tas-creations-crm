import React, { useState } from 'react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';

interface ExtensionSimulatorProps {
  onSyncLead: (payload: any) => Promise<void>;
}

export const ExtensionSimulator: React.FC<ExtensionSimulatorProps> = ({
  onSyncLead,
}) => {
  const [activeTab, setActiveTab] = useState<'maps' | 'website'>('maps');
  const [scraped, setScraped] = useState(false);
  const [synced, setSynced] = useState(false);
  const [loading, setLoading] = useState(false);

  const mapsPayload = {
    company: 'Spark Cafe & Bakery',
    website: 'sparkbakery.com',
    phone: '+1 (555) 9021',
    address: '402 Broadway, New York, NY',
    category: 'Restaurant / Coffee',
    rating: 4.8,
    reviews: 218,
  };

  const webPayload = {
    company: 'Spark Cafe Homepage',
    website: 'sparkbakery.com',
    phone: 'N/A',
    address: 'N/A',
    category: 'N/A',
    rating: 0,
    reviews: 0,
    techStack: ['WordPress', 'Google Analytics', 'Google Tag Manager', 'Meta Pixel']
  };

  const handleScrape = () => {
    setLoading(true);
    setTimeout(() => {
      setScraped(true);
      setSynced(false);
      setLoading(false);
    }, 800);
  };

  const handleSync = async () => {
    setLoading(true);
    const payload = activeTab === 'maps' ? mapsPayload : webPayload;
    await onSyncLead(payload);
    setLoading(false);
    setSynced(true);
  };

  return (
    <Card title="Chrome Extension Live Sandbox Simulator" subtitle="Interact with extension scraper popups without sideloading.">
      
      {/* Tab selectors */}
      <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-850 gap-2 mb-6 text-xs font-bold text-slate-500">
        <button
          onClick={() => { setActiveTab('maps'); setScraped(false); }}
          className={`flex-1 py-1.5 rounded-lg cursor-pointer ${activeTab === 'maps' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm' : ''}`}
        >
          Active Tab: Google Maps Scrape
        </button>
        <button
          onClick={() => { setActiveTab('website'); setScraped(false); }}
          className={`flex-1 py-1.5 rounded-lg cursor-pointer ${activeTab === 'website' ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm' : ''}`}
        >
          Active Tab: Corporate Wappalyzer Scan
        </button>
      </div>

      {/* Visual chrome popup box shell */}
      <div className="max-w-[280px] mx-auto bg-[#040d1a] border border-slate-800 rounded-2xl p-4 shadow-2xl text-slate-100 flex flex-col font-sans mb-2">
        
        {/* Mock top bar */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-2.5 mb-4 text-[10px] uppercase tracking-wider font-extrabold text-[#D4AF37]">
          <span>TAS CRM Intel</span>
          <span className="text-slate-500">v1.0.0</span>
        </div>

        {/* Content container */}
        <div className="bg-[#0b1524] border border-slate-800 rounded-xl p-3 mb-4 space-y-2.5 min-h-[140px] flex flex-col justify-center">
          {!scraped ? (
            <p className="text-[10px] text-slate-450 leading-relaxed text-center">
              Active Browser Tab URL:<br />
              <span className="text-[#D4AF37] font-semibold break-all text-[9px] block mt-1">
                {activeTab === 'maps' ? 'https://google.com/maps/place/Spark+Cafe' : 'https://sparkbakery.com'}
              </span>
              <span className="block mt-3 text-slate-500 font-bold uppercase tracking-wider text-[8px]">Ready to extract</span>
            </p>
          ) : (
            <div className="text-[11px] space-y-2">
              <div className="flex justify-between"><span className="text-slate-400 font-bold">Company:</span> <span className="font-semibold text-white">{activeTab === 'maps' ? mapsPayload.company : webPayload.company}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold">Website:</span> <span className="font-semibold text-slate-300">{activeTab === 'maps' ? mapsPayload.website : webPayload.website}</span></div>
              <div className="flex justify-between"><span className="text-slate-400 font-bold">Phone:</span> <span className="font-semibold text-slate-300">{activeTab === 'maps' ? mapsPayload.phone : webPayload.phone}</span></div>
              {activeTab === 'maps' ? (
                <>
                  <div className="flex justify-between"><span className="text-slate-400 font-bold">Address:</span> <span className="font-semibold text-slate-300 truncate max-w-[120px]">{mapsPayload.address}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400 font-bold">Rating:</span> <span className="font-bold text-[#D4AF37]">{mapsPayload.rating} ★ ({mapsPayload.reviews} reviews)</span></div>
                </>
              ) : (
                <div className="flex justify-between"><span className="text-slate-400 font-bold">CMS Stack:</span> <span className="font-bold text-[#D4AF37]">{webPayload.techStack.slice(0,2).join(', ')}</span></div>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleScrape}
            isLoading={loading}
            className="w-full text-center bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#040d1a] border-none text-[10px] font-black uppercase tracking-wider py-2"
          >
            Extract Page Elements
          </Button>

          {scraped && (
            <Button
              onClick={handleSync}
              isLoading={loading}
              variant="outline"
              className="w-full text-center border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37]/5 text-[10px] font-black uppercase tracking-wider py-2"
            >
              Save to CRM Database
            </Button>
          )}

          {synced && (
            <div className="text-[10px] text-emerald-500 font-extrabold text-center tracking-wider uppercase animate-pulse mt-1">
              ✓ Sync Complete!
            </div>
          )}
        </div>

      </div>

    </Card>
  );
};
export default ExtensionSimulator;
