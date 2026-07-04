import React from 'react';
import type { CompanyProfile, Lead } from '../../../shared/types';
import { Card } from '../../../shared/components/Card';
import { 
  Phone, 
  Mail, 
  Globe, 
  Camera, 
  Award, 
  Share2, 
  Users, 
  Building,
  CheckCircle 
} from 'lucide-react';

interface CompanyOverviewTabProps {
  company: CompanyProfile;
  lead: Lead;
}

export const CompanyOverviewTab: React.FC<CompanyOverviewTabProps> = ({ company, lead }) => {
  const contactDetails = [
    { label: 'Business Phone', value: company.phone || 'Not available', icon: Phone },
    { label: 'Contact Email', value: company.email || 'Not available', icon: Mail },
    { label: 'Website Domain', value: company.website ? `https://${company.website}` : 'Not available', icon: Globe, isLink: true },
  ];

  const socialLinks = [
    { label: 'Instagram', value: company.socialLinks?.instagram || '—', icon: Camera },
    { label: 'LinkedIn', value: company.socialLinks?.linkedin || '—', icon: Award },
    { label: 'Facebook', value: company.socialLinks?.facebook || '—', icon: Share2 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Contact Channels Grid */}
      <div className="md:col-span-2 space-y-6">
        <Card title="Business Contact Points">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {contactDetails.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-xl flex items-center space-x-3">
                  <div className="p-2 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-lg text-[#D4AF37] shrink-0">
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                    {item.isLink && company.website ? (
                      <a href={item.value} target="_blank" rel="noreferrer" className="text-xs text-slate-700 dark:text-slate-200 hover:text-[#D4AF37] hover:underline font-semibold truncate block">
                        {company.website}
                      </a>
                    ) : (
                      <p className="text-xs text-slate-700 dark:text-slate-205 font-semibold truncate block">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Company Description */}
        <Card title="Corporate Profile Summary">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {company.description || 'No business overview description has been recorded for this lead profile yet.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {lead.tags.map(t => (
              <span key={t} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                {t}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Directory Meta Side-panel */}
      <div className="space-y-6">
        <Card title="Prospect Details">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-xs">
              <Users size={14} className="text-slate-400 shrink-0" />
              <div className="flex justify-between w-full">
                <span className="text-slate-400">Employees Count</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{company.employeesCount || '—'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <Building size={14} className="text-slate-400 shrink-0" />
              <div className="flex justify-between w-full">
                <span className="text-slate-400">Revenue (Annual)</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {company.annualRevenue ? `$${(company.annualRevenue / 1000000).toFixed(1)}M` : '—'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <CheckCircle size={14} className="text-slate-400 shrink-0" />
              <div className="flex justify-between w-full">
                <span className="text-slate-400">Lead Status</span>
                <span className="font-bold text-[#D4AF37] capitalize">{lead.status}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Social channels card */}
        <Card title="Social Handles">
          <div className="space-y-3">
            {socialLinks.map((sc) => {
              const Icon = sc.icon;
              return (
                <div key={sc.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Icon size={13} className="shrink-0" />
                    <span>{sc.label}</span>
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[60%]">{sc.value}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

    </div>
  );
};
export default CompanyOverviewTab;
