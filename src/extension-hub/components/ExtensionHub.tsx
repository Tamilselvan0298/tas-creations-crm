import React, { useState, useEffect } from 'react';
import { ExtensionSimulator } from './ExtensionSimulator';
import { Card } from '../../shared/components/Card';
import { Puzzle } from 'lucide-react';
import { auth, isMockFirebase } from '../../shared/lib/firebase';

interface ScrapedLead {
  id: string;
  company: string;
  website: string;
  phone: string;
  address: string;
  category: string;
  rating: number;
  createdAt: string;
}

export const ExtensionHub: React.FC = () => {
  const [leads, setLeads] = useState<ScrapedLead[]>([]);
  const [, setLoading] = useState(false);

  const getAuthToken = async (): Promise<string> => {
    if (isMockFirebase) {
      const mockRole = localStorage.getItem('tas-user-role') || 'admin';
      return `mock-${mockRole}`;
    }
    return (await auth.currentUser?.getIdToken()) || '';
  };

  const loadScrapedLeads = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const res = await fetch('http://localhost:5000/api/extension/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.warn('Failed to load scraped leads lists:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScrapedLeads();
  }, []);

  const handleSyncLead = async (payload: any) => {
    try {
      const token = await getAuthToken();
      const res = await fetch('http://localhost:5000/api/extension/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await loadScrapedLeads();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
          <Puzzle size={20} className="mr-2.5 text-[#D4AF37]" />
          <span>Browser Extension Intelligence Command</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Install the Google Maps extractor plugin or simulate lead scans directly inside the workspace portal.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Setup Instructions */}
        <div className="md:col-span-2 space-y-6">
          <Card title="Chrome Extension Installation Guide" subtitle="Load Manifest V3 plugin manually in your browser.">
            <div className="space-y-4 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                <div>
                  <p className="text-slate-800 dark:text-white font-bold">Open Chrome Extension Manager</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Type <code className="bg-slate-50 dark:bg-slate-900 px-1 py-0.5 rounded">chrome://extensions/</code> in a new address tab.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                <div>
                  <p className="text-slate-800 dark:text-white font-bold">Enable Developer Mode</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Toggle the "Developer Mode" switch located in the upper-right corner.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="h-5 w-5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                <div>
                  <p className="text-slate-800 dark:text-white font-bold">Load Unpacked Extension</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Click the "Load Unpacked" button in the upper-left, and select this folder directory:</p>
                  <code className="bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded block mt-1.5 break-all text-[#D4AF37] border border-slate-200/50 dark:border-slate-800 font-mono text-[9px]">c:/xampp/htdocs/Lead-management-system/extension</code>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Simulator Widget */}
        <ExtensionSimulator onSyncLead={handleSyncLead} />

      </div>

      {/* Scraped Leads Table */}
      <Card title="Extension Imported Leads" subtitle="Prospects synced directly from browser scrapes.">
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Website URL</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Rating</th>
                <th className="py-3 px-4 text-right">Date Scraped</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No leads captured via extensions yet.</td>
                </tr>
              ) : (
                leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-205">{l.company}</td>
                    <td className="py-3 px-4 text-slate-500">{l.website || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-500">{l.phone || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-550 truncate max-w-[150px]">{l.address || 'N/A'}</td>
                    <td className="py-3 px-4 text-slate-500">{l.category || 'N/A'}</td>
                    <td className="py-3 px-4 text-center font-bold text-[#D4AF37]">{l.rating ? `${l.rating} ★` : 'N/A'}</td>
                    <td className="py-3 px-4 text-right text-slate-405">{new Date(l.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
};
export default ExtensionHub;
