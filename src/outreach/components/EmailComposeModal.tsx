import React, { useState } from 'react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import type { OutreachTemplate } from '../../shared/services/outreachRepository';
import { X, Send, Sparkles } from 'lucide-react';

interface EmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: OutreachTemplate[];
  onGenerateAi: (type: 'email', ctx: { company: string; category: string; website: string }) => Promise<string>;
}

export const EmailComposeModal: React.FC<EmailComposeModalProps> = ({
  isOpen,
  onClose,
  templates,
  onGenerateAi,
}) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Variables insertion state
  const [leadCompany, setLeadCompany] = useState('Acme Corp');
  const [leadCategory, setLeadCategory] = useState('Logistics');
  const [leadWebsite, setLeadWebsite] = useState('acme.com');

  const insertVariable = (variable: string) => {
    setBody(prev => prev + ` {{${variable}}}`);
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const temp = templates.find(t => t.id === e.target.value);
    if (temp) {
      setSubject(temp.subject || '');
      setBody(temp.body);
    }
  };

  const triggerGeminiCopy = async () => {
    setLoading(true);
    try {
      const response = await onGenerateAi('email', {
        company: leadCompany,
        category: leadCategory,
        website: leadWebsite,
      });
      
      // Parse out subject if present
      if (response.includes('Subject:')) {
        const lines = response.split('\n');
        const subjLine = lines.find(l => l.startsWith('Subject:'));
        if (subjLine) {
          setSubject(subjLine.replace('Subject:', '').trim());
          setBody(lines.filter(l => !l.startsWith('Subject:')).join('\n').trim());
        } else {
          setBody(response);
        }
      } else {
        setBody(response);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <Card className="w-full max-w-lg z-10 shadow-2xl overflow-hidden p-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl flex flex-col max-h-[90vh]">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Send size={15} className="mr-2 text-[#D4AF37]" />
            <span>Compose Outreach Email</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Input parameters scroll block */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Preset templates selector */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Load Template</label>
            <select
              onChange={handleTemplateSelect}
              className="text-xs py-1.5 px-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-200 cursor-pointer"
              defaultValue=""
            >
              <option value="" disabled>Select a Preset Template</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Recipient Email" value={to} onChange={(e) => setTo(e.target.value)} placeholder="lead@company.com" required />
            <Input label="Email Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Re: Question" required />
          </div>

          {/* AI Context Panel */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl space-y-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center">
              <Sparkles size={11} className="mr-1 text-[#D4AF37]" />
              Gemini AI Copywriter Context
            </span>
            <div className="grid grid-cols-3 gap-2">
              <input type="text" value={leadCompany} onChange={(e) => setLeadCompany(e.target.value)} placeholder="Company" className="text-[10px] p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded" />
              <input type="text" value={leadCategory} onChange={(e) => setLeadCategory(e.target.value)} placeholder="Category" className="text-[10px] p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded" />
              <input type="text" value={leadWebsite} onChange={(e) => setLeadWebsite(e.target.value)} placeholder="Website" className="text-[10px] p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded" />
            </div>
            <Button size="sm" type="button" onClick={triggerGeminiCopy} isLoading={loading} className="w-full flex items-center justify-center space-x-1">
              <Sparkles size={12} />
              <span>Autofill with Gemini AI Copy</span>
            </Button>
          </div>

          {/* Text body area */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Body</label>
              <div className="flex items-center space-x-1">
                <button type="button" onClick={() => insertVariable('company')} className="text-[9px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded cursor-pointer">+ Company</button>
                <button type="button" onClick={() => insertVariable('website')} className="text-[9px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 font-bold px-1.5 py-0.5 rounded cursor-pointer">+ Website</button>
              </div>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email body copy here. Insert variables using buttons..."
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-xl h-44"
              required
            />
          </div>

        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button type="button" size="sm" className="flex items-center space-x-1.5">
            <Send size={12} />
            <span>Send Email</span>
          </Button>
        </div>

      </Card>
    </div>
  );
};
export default EmailComposeModal;
