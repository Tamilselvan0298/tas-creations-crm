import React, { useState, useEffect } from 'react';
import { activityRepository } from '../../../shared/services/activityRepository';
import type { Activity } from '../../../shared/types';
import { Card } from '../../../shared/components/Card';
import { Mail, MessageSquare, Phone, Columns, Globe, FileCheck, Award, Calendar } from 'lucide-react';

interface CompanyTimelineTabProps {
  leadId: string;
}

export const CompanyTimelineTab: React.FC<CompanyTimelineTabProps> = ({ leadId }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = activityRepository.subscribe((items) => {
      const filtered = items
        .filter(act => act.leadId === leadId)
        .sort((a, b) => {
          const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
          const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
          return timeB - timeA;
        });
      setActivities(filtered);
      setLoading(false);
    });
    return unsubscribe;
  }, [leadId]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'email': return <Mail size={13} />;
      case 'whatsapp': return <MessageSquare size={13} />;
      case 'call': return <Phone size={13} />;
      case 'meeting': return <Calendar size={13} />;
      case 'proposal': return <FileCheck size={13} />;
      case 'status': return <Columns size={13} />;
      case 'seo': return <Globe size={13} />;
      default: return <Award size={13} />;
    }
  };

  const getIconColor = (type: Activity['type']) => {
    switch (type) {
      case 'status': return 'bg-blue-500 text-white';
      case 'seo': return 'bg-emerald-500 text-white';
      case 'proposal': return 'bg-[#D4AF37] text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <Card title="Activity Timeline History" subtitle="Chronological history of interactions with this prospect.">
      {loading ? (
        <div className="text-center py-6 text-xs text-slate-400">Syncing timeline logs...</div>
      ) : (
        <div className="mt-6 space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No activity logs recorded for this lead profile.
            </div>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="relative flex items-start pl-6 pb-4 last:pb-0">
                {/* Vertical line segment */}
                <div className="absolute left-2 top-2.5 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800" />
                
                {/* Floating Circle Icon */}
                <div className={`absolute left-0 top-1.5 h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white dark:border-slate-950 shrink-0 ${getIconColor(act.type)}`}>
                  {getActivityIcon(act.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                    {act.title}
                  </p>
                  {act.description && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                      {act.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-1.5 text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    <span>{act.performedBy}</span>
                    <span>•</span>
                    <span>
                      {new Date(act.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
};
export default CompanyTimelineTab;
