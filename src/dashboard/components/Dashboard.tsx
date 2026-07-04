import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardKpis } from './DashboardKpis';
import { DashboardCharts } from './DashboardCharts';
import { DashboardTasks } from './DashboardTasks';
import { DashboardActivities } from './DashboardActivities';
import { QuickActionsPanel } from './QuickActionsPanel';
import { RefreshCw, PlayCircle } from 'lucide-react';
import { Button } from '../../shared/components/Button';

export const Dashboard: React.FC = () => {
  const { stats, activities, loading, simulateRealtimeActivity } = useDashboard();

  if (loading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title & Control Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
            <span>Operations Command Center</span>
            <span className="ml-2.5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full flex items-center animate-pulse">
              ● Live Sync
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Realtime database pipeline summary of leads, SEO scan crawls, and agency contracts.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={simulateRealtimeActivity}
            className="flex items-center space-x-1.5 border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 text-[#D4AF37]"
          >
            <PlayCircle size={14} />
            <span>Simulate Event</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="flex items-center space-x-1.5"
          >
            <RefreshCw size={13} />
            <span>Reload</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grids */}
      <DashboardKpis stats={stats} />

      {/* Graphs Area */}
      <DashboardCharts stats={stats} />

      {/* Checklists, Feeds and Widgets Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardTasks />
        <DashboardActivities activities={activities} />
        <QuickActionsPanel onSimulate={simulateRealtimeActivity} />
      </div>

    </div>
  );
};
export default Dashboard;
