import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskRepository } from '../../shared/services/taskRepository';
import { leadRepository } from '../../shared/services/leadRepository';
import type { Task, Lead } from '../../shared/types';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { 
  CheckSquare, 
  Trash2, 
  Plus, 
  Clock, 
  AlertCircle, 
  Calendar as CalendarIcon, 
  Building,
  CheckCircle2
} from 'lucide-react';

export const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'completed'>('todo');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Form States
  const [title, setTitle] = useState('');
  const [leadId, setLeadId] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [deadline, setDeadline] = useState('');
  const [formMsg, setFormMsg] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to tasks
    const unsubscribeTasks = taskRepository.subscribe((items) => {
      setTasks(items);
      setLoading(false);
    });

    // Subscribe to leads (to associate with tasks)
    const unsubscribeLeads = leadRepository.subscribeWithCompanies((items) => {
      setLeads(items);
    });

    return () => {
      unsubscribeTasks();
      unsubscribeLeads();
    };
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);
    if (!title.trim()) {
      setFormMsg('Please enter a task description.');
      return;
    }

    setCreating(true);
    try {
      await taskRepository.create({
        leadId: leadId || 'lead-1', // Fallback to first if empty
        title: title.trim(),
        priority,
        status: 'todo',
        assignedTo: 'mock-admin',
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      setTitle('');
      setLeadId('');
      setPriority('medium');
      setDeadline('');
      setFormMsg('Task created successfully.');
    } catch (err: any) {
      setFormMsg(err.message || 'Failed to create task.');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
      await taskRepository.update(task.id, {
        status: nextStatus,
        completedAt: nextStatus === 'completed' ? new Date() : undefined
      });
    } catch (e) {
      console.error('Failed to toggle task:', e);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskRepository.delete(taskId);
    } catch (e) {
      console.error('Failed to delete task:', e);
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'completed' 
        ? t.status === 'completed' 
        : t.status !== 'completed';
        
    const matchesPriority = priorityFilter === 'all' ? true : t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
          <CheckSquare size={20} className="mr-2.5 text-[#D4AF37]" />
          <span>Operational Tasks List</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Create actionable checklists, configure deadline dates, prioritize client jobs, and map task statuses.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-2"></div>
          <span>Loading task ledger...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Panel: Tasks list (Col span 2) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Filter Bar Card */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200/50 dark:border-slate-900 gap-4 text-xs font-semibold">
              <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-250/20 dark:border-slate-800 text-slate-500">
                <button
                  onClick={() => setStatusFilter('todo')}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${statusFilter === 'todo' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${statusFilter === 'completed' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
                >
                  All
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Priority:</span>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-350 focus:ring-0"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Only</option>
                  <option value="medium">Medium Only</option>
                  <option value="low">Low Only</option>
                </select>
              </div>
            </div>

            {/* Tasks Ledger Table */}
            <Card title="Task Checklist" subtitle={`${filteredTasks.length} tasks matching criteria`}>
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-bold">
                      <th className="py-3 px-4 w-10">Done</th>
                      <th className="py-3 px-4">Task Details</th>
                      <th className="py-3 px-4">Linked Company</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Deadline</th>
                      <th className="py-3 px-4 text-center w-16">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No tasks found.
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map(t => {
                        const linkedLead = leads.find(l => l.id === t.leadId);
                        const isOverdue = t.status !== 'completed' && t.deadline && new Date(t.deadline).getTime() < Date.now();
                        
                        let pColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                        if (t.priority === 'high') pColor = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
                        else if (t.priority === 'medium') pColor = 'bg-amber-500/10 text-amber-500 border-amber-500/20';

                        return (
                          <tr key={t.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/10 transition-colors">
                            <td className="py-3 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={t.status === 'completed'}
                                onChange={() => handleToggleComplete(t)}
                                className="rounded border-slate-350 text-[#0B1F3A] focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <p className={`font-semibold text-slate-800 dark:text-slate-200 ${t.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                                {t.title}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              {linkedLead?.company ? (
                                <Link to={`/leads/${linkedLead.id}`} className="text-[#D4AF37] hover:underline flex items-center">
                                  <Building size={11} className="mr-1.5 shrink-0" />
                                  <span className="truncate max-w-[120px]">{linkedLead.company.name}</span>
                                </Link>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${pColor}`}>
                                {t.priority}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {t.deadline ? (
                                <div className="flex items-center space-x-1.5">
                                  {isOverdue ? (
                                    <AlertCircle size={12} className="text-rose-500 shrink-0" />
                                  ) : (
                                    <Clock size={11} className="text-slate-400 shrink-0" />
                                  )}
                                  <span className={`font-bold ${isOverdue ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {new Date(t.deadline).toLocaleDateString()}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteTask(t.id)}
                                className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded transition-colors shrink-0 cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>

          {/* Right Panel: Add Task Creator (Col span 1) */}
          <div className="md:col-span-1 space-y-6">
            <Card title="Add New Task" subtitle="Deploy a new operational checklist item">
              {formMsg && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-350 rounded-lg mb-4 flex items-center">
                  <CheckCircle2 size={14} className="mr-2 text-[#D4AF37]" />
                  {formMsg}
                </div>
              )}

              <form onSubmit={handleCreateTask} className="space-y-4">
                <Input
                  label="Task Description"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Call client for proposals review"
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Linked Lead / Client</label>
                  <select
                    value={leadId}
                    onChange={(e) => setLeadId(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 focus:border-[#D4AF37] focus:ring-0 outline-none"
                  >
                    <option value="">Select Company Profile</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.company?.name || 'Unknown'}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Task Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 focus:border-[#D4AF37] focus:ring-0 outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <Input
                  label="Deadline Date"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  leftIcon={<CalendarIcon size={15} />}
                />

                <div className="pt-2">
                  <Button type="submit" isLoading={creating} className="w-full justify-center">
                    <Plus size={14} className="mr-1.5" />
                    Create Task
                  </Button>
                </div>
              </form>
            </Card>
          </div>

        </div>
      )}

    </div>
  );
};
export default TasksList;
