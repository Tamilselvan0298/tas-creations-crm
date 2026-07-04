import React from 'react';
import { Card } from '../../shared/components/Card';
import { 
  UserPlus, 
  Globe, 
  FileCheck, 
  Calendar, 
  Activity 
} from 'lucide-react';

interface QuickActionsPanelProps {
  onSimulate: () => void;
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ onSimulate }) => {
  const actions = [
    { label: 'Add Lead', icon: UserPlus, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/10 hover:border-blue-400' },
    { label: 'New Audit', icon: Globe, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 hover:border-emerald-400' },
    { label: 'Generate Proposal', icon: FileCheck, color: 'text-[#D4AF37] bg-amber-50 dark:bg-amber-950/15 hover:border-[#D4AF37]' },
    { label: 'Create Task', icon: Calendar, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/10 hover:border-purple-400' },
  ];

  return (
    <Card title="Quick Operations Panel" subtitle="Trigger core actions instantly">
      <div className="mt-4 grid grid-cols-2 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              className={`p-3 border border-slate-100 dark:border-slate-800/60 rounded-xl transition-all cursor-pointer text-left flex items-center space-x-3 group ${act.color}`}
            >
              <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm shrink-0">
                <Icon size={16} />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-current">
                {act.label}
              </span>
            </button>
          );
        })}

        {/* Real-time simulation tool */}
        <button
          onClick={onSimulate}
          className="col-span-2 p-3 border border-dashed border-[#D4AF37]/50 rounded-xl hover:bg-[#D4AF37]/5 transition-all cursor-pointer text-center flex items-center justify-center space-x-2 text-[#D4AF37]"
        >
          <Activity size={16} className="animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Simulate Realtime Firestore Sync
          </span>
        </button>
      </div>
    </Card>
  );
};
export default QuickActionsPanel;
