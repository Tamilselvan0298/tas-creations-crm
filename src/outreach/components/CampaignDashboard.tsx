import React, { useState } from 'react';
import type { Campaign } from '../../shared/services/outreachRepository';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { BarChart3, Plus } from 'lucide-react';

interface CampaignDashboardProps {
  campaigns: Campaign[];
  onCreateCampaign: (name: string, channel: 'email' | 'whatsapp' | 'sms') => Promise<void>;
}

export const CampaignDashboard: React.FC<CampaignDashboardProps> = ({
  campaigns,
  onCreateCampaign,
}) => {
  const [newCampName, setNewCampName] = useState('');
  const [newCampChannel, setNewCampChannel] = useState<'email' | 'whatsapp' | 'sms'>('email');
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName.trim()) return;
    await onCreateCampaign(newCampName, newCampChannel);
    setNewCampName('');
    setModalOpen(false);
  };

  // Aggregated Stats
  const totalSent = campaigns.reduce((acc, c) => acc + c.sent, 0);
  const totalReplies = campaigns.reduce((acc, c) => acc + c.replied, 0);
  const totalOpens = campaigns.reduce((acc, c) => acc + c.opened, 0);
  const openRate = totalSent ? Math.round((totalOpens / totalSent) * 100) : 0;
  const replyRate = totalSent ? Math.round((totalReplies / totalSent) * 100) : 0;
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);

  const metrics = [
    { label: 'Outreach Sent', value: totalSent, sub: 'All channels' },
    { label: 'Avg Open Rate', value: `${openRate}%`, sub: 'Industry standard: 40%' },
    { label: 'Avg Reply Rate', value: `${replyRate}%`, sub: 'Industry standard: 8%' },
    { label: 'Booked Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: 'Closed leads value' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Metrics Card Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((item) => (
          <Card key={item.label} className="p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{item.label}</span>
              <p className="text-xl font-black text-slate-700 dark:text-slate-205 mt-2">{item.value}</p>
            </div>
            <span className="text-[9px] text-[#D4AF37] font-semibold mt-1">{item.sub}</span>
          </Card>
        ))}
      </div>

      {/* Campaigns Actions & Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <BarChart3 size={15} className="mr-2 text-[#D4AF37]" />
          Outreach Campaigns ({campaigns.length})
        </h3>
        <Button size="sm" onClick={() => setModalOpen(true)} className="flex items-center space-x-1.5">
          <Plus size={13} />
          <span>New Campaign</span>
        </Button>
      </div>

      {/* Campaigns Table */}
      <Card className="overflow-hidden p-0 border-slate-200/80 dark:border-slate-800/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Sent</th>
                <th className="py-3 px-4 text-center">Opens</th>
                <th className="py-3 px-4 text-center">Replies</th>
                <th className="py-3 px-4 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No campaigns created yet.</td>
                </tr>
              ) : (
                campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">{camp.name}</td>
                    <td className="py-3 px-4 text-slate-500 capitalize">{camp.channel}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        camp.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">{camp.sent}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{camp.opened}</td>
                    <td className="py-3 px-4 text-center text-slate-500">{camp.replied}</td>
                    <td className="py-3 px-4 text-right font-semibold text-[#D4AF37]">${camp.revenue.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Campaign Modal popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <Card className="w-full max-w-sm z-10 shadow-2xl relative">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Create Campaign</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Campaign Name"
                value={newCampName}
                onChange={(e) => setNewCampName(e.target.value)}
                placeholder="e.g. Cold Email Outreach Q4..."
                required
              />
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Channel</label>
                <select
                  value={newCampChannel}
                  onChange={(e) => setNewCampChannel(e.target.value as any)}
                  className="text-xs py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" size="sm">Create</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
};
export default CampaignDashboard;
