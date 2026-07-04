import React, { useState } from 'react';
import { Card } from '../../shared/components/Card';
import { CheckCircle2, Clock } from 'lucide-react';

export const DashboardTasks: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Follow up with Apex Logistics on Quotation #1042', priority: 'high', done: false, deadline: 'Today, 2:00 PM' },
    { id: 2, title: 'Review automated SEO Audit results for designco.com', priority: 'medium', done: false, deadline: 'Today, 5:30 PM' },
    { id: 3, title: 'Draft custom Proposal for Silverline Agency', priority: 'high', done: true, deadline: 'Completed' },
    { id: 4, title: 'Schedule demo meeting with Spark Media', priority: 'low', done: false, deadline: 'Tomorrow, 11:00 AM' },
  ]);

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <Card 
      title="Operational Focus & Tasks" 
      subtitle="Today's critical client deadlines"
      extra={
        <button className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold hover:underline cursor-pointer">
          View all
        </button>
      }
    >
      <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`flex items-start p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30 transition-all ${
              task.done ? 'opacity-50 line-through' : ''
            }`}
          >
            <button 
              onClick={() => handleToggleTask(task.id)}
              className="mt-0.5 mr-3 text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              {task.done ? (
                <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
              ) : (
                <div className="h-4.5 w-4.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                {task.title}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${
                  task.priority === 'high' 
                    ? 'bg-red-100 dark:bg-red-950/20 text-red-600' 
                    : task.priority === 'medium'
                      ? 'bg-amber-100 dark:bg-amber-950/20 text-amber-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {task.priority}
                </span>
                <span className="text-[9px] text-slate-400 flex items-center font-medium">
                  <Clock size={10} className="mr-1 shrink-0" />
                  {task.deadline}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
export default DashboardTasks;
