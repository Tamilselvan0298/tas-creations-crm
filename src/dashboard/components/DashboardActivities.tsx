import React from 'react';
import { Card } from '../../shared/components/Card';
import type { Activity } from '../../shared/types';

interface DashboardActivitiesProps {
  activities: Activity[];
}

export const DashboardActivities: React.FC<DashboardActivitiesProps> = ({ activities }) => {
  const getRelativeTimeString = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <Card 
      title="Team Activity Stream" 
      subtitle="Updates from the last 24 hours"
    >
      <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-1">
        {activities.map((act) => (
          <div key={act.id} className="relative flex items-start pl-5 pb-3 last:pb-0">
            {/* Timeline Indicator Line */}
            <div className="absolute left-1.5 top-2 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800" />
            
            {/* Circle Pin */}
            <div className={`absolute left-0 top-1.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center ${
              act.type === 'status' 
                ? 'bg-blue-500' 
                : act.type === 'seo'
                  ? 'bg-emerald-500'
                  : act.type === 'proposal'
                    ? 'bg-[#D4AF37]'
                    : 'bg-purple-500'
            }`} />
            
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-normal">
                {act.title}
              </p>
              {act.description && (
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                  {act.description}
                </p>
              )}
              <div className="flex items-center space-x-2 mt-1 text-[9px] text-slate-400 font-medium">
                <span className="text-slate-500 dark:text-slate-300">{act.performedBy}</span>
                <span>•</span>
                <span>{getRelativeTimeString(act.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default DashboardActivities;
