import React, { useState } from 'react';
import { Button } from '../../shared/components/Button';
import { Globe, FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportMaps: (input: string) => Promise<void>;
  onImportCSV: (csvText: string) => Promise<number>;
}

export const LeadImportModal: React.FC<LeadImportModalProps> = ({
  isOpen,
  onClose,
  onImportMaps,
  onImportCSV
}) => {
  const [activeTab, setActiveTab] = useState<'maps' | 'csv'>('maps');
  const [mapsInput, setMapsInput] = useState('');
  const [csvInput, setCsvInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleMapsImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapsInput.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await onImportMaps(mapsInput);
      setSuccess('Business successfully imported as a new lead.');
      setMapsInput('');
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to parse inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleCSVImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const count = await onImportCSV(csvInput);
      setSuccess(`Import complete. Successfully created ${count} leads.`);
      setCsvInput('');
      setTimeout(onClose, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to parse CSV sheet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden z-10"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <span>Import Prospect Leads</span>
              </h3>
              <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            {/* Tabs Selector */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 px-6 pt-2">
              <button
                onClick={() => { setActiveTab('maps'); setError(null); setSuccess(null); }}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'maps' ? 'border-[#D4AF37] text-slate-800 dark:text-white' : 'border-transparent text-slate-400'
                }`}
              >
                <Globe size={13} />
                <span>Google Maps Parser</span>
              </button>
              <button
                onClick={() => { setActiveTab('csv'); setError(null); setSuccess(null); }}
                className={`pb-2 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                  activeTab === 'csv' ? 'border-[#D4AF37] text-slate-800 dark:text-white' : 'border-transparent text-slate-400'
                }`}
              >
                <FileSpreadsheet size={13} />
                <span>CSV Sheet Uploader</span>
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-850 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg mb-4 flex items-center">
                  <AlertCircle size={14} className="mr-2" />
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-850 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg mb-4">
                  {success}
                </div>
              )}

              {activeTab === 'maps' ? (
                <form onSubmit={handleMapsImport} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Google Maps Details</label>
                    <textarea
                      value={mapsInput}
                      onChange={(e) => setMapsInput(e.target.value)}
                      placeholder="Paste google maps URL (e.g. https://www.google.com/maps/place/...) OR copy-paste sidebar info block..."
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-xl h-32"
                      required
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" isLoading={loading}>
                      Parse & Import Lead
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleCSVImport} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CSV Columns Content</label>
                    <textarea
                      value={csvInput}
                      onChange={(e) => setCsvInput(e.target.value)}
                      placeholder='Company Name, Phone, Email, Website, Category, Country, City, Status&#10;"Apex Logistics","+1 555-016","info@apex.com","apex.com","Logistics","USA","Dallas","interested"'
                      className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-xl h-32 font-mono"
                      required
                    />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button type="submit" variant="secondary" isLoading={loading}>
                      Import CSV Rows
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default LeadImportModal;
