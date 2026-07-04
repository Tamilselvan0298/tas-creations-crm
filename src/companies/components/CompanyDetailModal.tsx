import React from 'react';
import type { CompanyProfile } from '../../shared/types';
import { Card } from '../../shared/components/Card';
import { X, Globe, Mail, Phone, MapPin, Building, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompanyDetailModalProps {
  company: CompanyProfile;
  onClose: () => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  company,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleAuditRedirect = () => {
    navigate('/website-audit');
  };

  const handleOutreachRedirect = () => {
    navigate('/email');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <Card className="w-full max-w-md z-10 shadow-2xl overflow-hidden p-0 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl flex flex-col max-h-[85vh]">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Building size={15} className="mr-2 text-[#D4AF37]" />
            <span>Company Profile</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          <div>
            <h2 className="text-base font-black text-slate-800 dark:text-white">{company.name}</h2>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1.5 inline-block">
              {company.category}
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
            {company.description || 'No corporate description details provided.'}
          </p>

          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="flex items-center space-x-2.5 text-slate-650 dark:text-slate-250">
              <Globe size={13} className="text-slate-400" />
              <a href={`https://${company.website}`} target="_blank" rel="noreferrer" className="hover:underline font-bold text-[#D4AF37]">
                {company.website}
              </a>
            </div>

            <div className="flex items-center space-x-2.5 text-slate-650 dark:text-slate-250">
              <Mail size={13} className="text-slate-400" />
              <span className="font-semibold">{company.email || 'N/A'}</span>
            </div>

            <div className="flex items-center space-x-2.5 text-slate-650 dark:text-slate-250">
              <Phone size={13} className="text-slate-400" />
              <span className="font-semibold">{company.phone || 'N/A'}</span>
            </div>

            {company.address?.street && (
              <div className="flex items-start space-x-2.5 text-slate-650 dark:text-slate-250">
                <MapPin size={13} className="text-slate-400 mt-0.5 shrink-0" />
                <span className="font-semibold leading-relaxed">
                  {company.address.street}, {company.address.city}, {company.address.state}, {company.address.country}
                </span>
              </div>
            )}
          </div>

          {/* Quick Action buttons */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-xl space-y-2.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center">
              <Sparkles size={11} className="mr-1 text-[#D4AF37]" />
              Quick CRM Integrations
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAuditRedirect}
                className="py-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/35 text-[10px] font-bold rounded-lg cursor-pointer transition-all"
              >
                Audit Website
              </button>
              <button
                onClick={handleOutreachRedirect}
                className="py-2 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all"
              >
                Draft Cold Pitch
              </button>
            </div>
          </div>

        </div>

      </Card>
    </div>
  );
};
export default CompanyDetailModal;
