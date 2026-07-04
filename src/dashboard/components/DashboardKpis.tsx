import React from 'react';
import { Card } from '../../shared/components/Card';
import { 
  Users, 
  UserPlus, 
  Heart, 
  Calendar, 
  FileText, 
  Award, 
  XCircle, 
  DollarSign, 
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { DashboardStats } from '../../shared/services/dashboardRepository';

interface DashboardKpisProps {
  stats: DashboardStats;
}

export const DashboardKpis: React.FC<DashboardKpisProps> = ({ stats }) => {
  const kpiItems = [
    { label: 'Total Leads', value: stats.totalLeads.toLocaleString(), change: '+14.2%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    { label: 'New Leads', value: stats.newLeads.toString(), change: 'Today Inflow', icon: UserPlus, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
    { label: 'Interested', value: stats.interested.toString(), change: '14.5% Rate', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/10' },
    { label: 'Meetings Today', value: stats.meetingsToday.toString(), change: 'Active Schedules', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
    { label: 'Proposals Sent', value: stats.proposalSent.toString(), change: 'Active Negot.', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/10' },
    { label: 'Won Deals', value: stats.wonDeals.toString(), change: '8.4% Conv', icon: Award, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
    { label: 'Lost Deals', value: stats.lostDeals.toString(), change: '-1.4% MoM', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/10' },
    { label: 'Active Revenue', value: `$${stats.revenue.toLocaleString()}`, change: '+18% MoM', icon: DollarSign, color: 'text-[#D4AF37]', bg: 'bg-amber-50 dark:bg-amber-950/15', highlight: true },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiItems.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <Card 
              interactive 
              className={`relative overflow-hidden ${
                kpi.highlight 
                  ? 'border-[#D4AF37]/40 bg-gradient-to-br from-[#0B1F3A] to-[#122e54] text-white dark:from-slate-900 dark:to-slate-800' 
                  : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    kpi.highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {kpi.label}
                  </p>
                  <h3 className={`text-2xl font-black tracking-tight mt-2 ${
                    kpi.highlight ? 'text-white' : 'text-slate-800 dark:text-slate-100'
                  }`}>
                    {kpi.value}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${kpi.bg} shrink-0`}>
                  <Icon size={18} className={kpi.color} />
                </div>
              </div>
              
              <div className="flex items-center mt-4 space-x-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center ${
                  kpi.highlight 
                    ? 'bg-[#D4AF37]/20 text-[#D4AF37]' 
                    : 'bg-emerald-100/80 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {kpi.change.includes('+') ? <ArrowUpRight size={10} className="mr-0.5 shrink-0" /> : null}
                  {kpi.change}
                </span>
                <span className={`text-[9px] ${
                  kpi.highlight ? 'text-slate-400' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  vs. last month
                </span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
export default DashboardKpis;
