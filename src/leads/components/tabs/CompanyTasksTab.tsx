import React, { useState, useEffect } from 'react';
import { taskRepository } from '../../../shared/services/taskRepository';
import type { Task } from '../../../shared/types';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { CheckCircle2, Trash2, Calendar } from 'lucide-react';

interface CompanyTasksTabProps {
  leadId: string;
}

export const CompanyTasksTab: React.FC<CompanyTasksTabProps> = ({ leadId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = taskRepository.subscribeForLead(leadId, (data) => {
      setTasks(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [leadId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await taskRepository.create({
        leadId,
        title: newTitle,
        priority,
        status: 'todo',
        assignedTo: 'mock-admin',
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      setNewTitle('');
      setPriority('medium');
      setDeadline('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDone = async (task: Task) => {
    const isDone = task.status === 'completed';
    await taskRepository.update(task.id, {
      status: isDone ? 'todo' : 'completed',
      completedAt: isDone ? null : new Date()
    });
  };

  const handleDelete = async (id: string) => {
    await taskRepository.delete(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Create Task Card */}
      <Card title="Add Account Task" subtitle="Assign actionable checklist items for lead follow-ups.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Task Action Summary"
            placeholder="e.g. Schedule call, Email proposal draft..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Input
              label="Deadline Date"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm">
              Create Task
            </Button>
          </div>
        </form>
      </Card>

      {/* Task List Cards */}
      {loading ? (
        <div className="text-center py-6 text-xs text-slate-400">Syncing tasks lists...</div>
      ) : (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No tasks logged for this lead.
            </div>
          ) : (
            tasks.map((task) => (
              <div 
                key={task.id}
                className={`flex items-start p-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-xl shadow-sm transition-all ${
                  task.status === 'completed' ? 'opacity-50' : ''
                }`}
              >
                <button
                  onClick={() => handleToggleDone(task)}
                  className="mt-0.5 mr-3 text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer shrink-0"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                  ) : (
                    <div className="h-4.5 w-4.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0 pr-3">
                  <p className={`text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug ${
                    task.status === 'completed' ? 'line-through' : ''
                  }`}>
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
                    {task.deadline && (
                      <span className="text-[9px] text-slate-400 flex items-center font-medium">
                        <Calendar size={10} className="mr-1" />
                        {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800/35 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
export default CompanyTasksTab;
