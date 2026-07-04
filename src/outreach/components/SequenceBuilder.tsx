import React, { useState } from 'react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Mail, MessageSquare, Phone, Plus, Trash2, Calendar, FileCheck } from 'lucide-react';

interface SequenceStep {
  id: string;
  day: number;
  type: 'email' | 'whatsapp' | 'sms' | 'call' | 'proposal';
  title: string;
  description: string;
}

export const SequenceBuilder: React.FC = () => {
  const [steps, setSteps] = useState<SequenceStep[]>([
    { id: '1', day: 1, type: 'email', title: 'Intro Pitch Cold Email', description: 'Pitch free technical website speed audit.' },
    { id: '2', day: 3, type: 'whatsapp', title: 'WhatsApp Speed Diagnostic Check', description: 'Send PDF checklist and request discovery call.' },
    { id: '3', day: 5, type: 'email', title: 'Follow-up SEO Analysis Review', description: 'Brief overview of search ranking opportunities.' },
    { id: '4', day: 8, type: 'call', title: 'Discovery Phone Call Sync', description: 'Address design questions and discuss budget estimations.' },
    { id: '5', day: 12, type: 'proposal', title: 'Proposal Contract Follow-up', description: 'Auto-send finalized proposal with milestone timelines.' },
  ]);

  const [newDay, setNewDay] = useState(14);
  const [newType, setNewType] = useState<SequenceStep['type']>('email');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newStep: SequenceStep = {
      id: 'step-' + Date.now(),
      day: newDay,
      type: newType,
      title: newTitle,
      description: newDesc,
    };

    setSteps(prev => [...prev, newStep].sort((a, b) => a.day - b.day));
    setNewTitle('');
    setNewDesc('');
    setNewDay(prev => prev + 2);
  };

  const handleDeleteStep = (id: string) => {
    setSteps(prev => prev.filter(s => s.id !== id));
  };

  const getStepIcon = (type: SequenceStep['type']) => {
    switch (type) {
      case 'email': return <Mail size={13} />;
      case 'whatsapp': return <MessageSquare size={13} />;
      case 'call': return <Phone size={13} />;
      case 'proposal': return <FileCheck size={13} />;
      default: return <Calendar size={13} />;
    }
  };

  const getBadgeColor = (type: SequenceStep['type']) => {
    switch (type) {
      case 'email': return 'bg-blue-100 dark:bg-blue-950/20 text-blue-600';
      case 'whatsapp': return 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600';
      case 'call': return 'bg-purple-100 dark:bg-purple-950/20 text-purple-600';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Workflow Step Timeline on left */}
      <div className="md:col-span-2 space-y-6">
        <Card title="Automation Step Sequence Pipeline" subtitle="Configure automatic delayed follow-ups across channels.">
          <div className="mt-6 relative pl-6 space-y-6">
            
            {/* Left line segment */}
            <div className="absolute left-2.5 top-2.5 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-800" />

            {steps.map((step) => (
              <div key={step.id} className="relative flex items-start group">
                
                {/* Visual Circle Node */}
                <div className={`absolute left-[-24px] top-1 h-5 w-5 rounded-full border border-white dark:border-slate-900 bg-white dark:bg-slate-950 shadow-sm flex items-center justify-center text-[#D4AF37]`}>
                  {getStepIcon(step.type)}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-extrabold px-1.5 py-0.5 rounded-full">
                      Day {step.day}
                    </span>
                    <span className="text-xs font-bold text-slate-850 dark:text-slate-100 truncate">
                      {step.title}
                    </span>
                    <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${getBadgeColor(step.type)}`}>
                      {step.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    {step.description}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteStep(step.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800/35 transition-colors cursor-pointer shrink-0 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>

              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Step Sidebar form */}
      <Card title="Add Sequence Step">
        <form onSubmit={handleAddStep} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Action Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="text-xs py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="call">Call</option>
                <option value="proposal">Proposal</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Day Offset</label>
              <input
                type="number"
                value={newDay}
                onChange={(e) => setNewDay(parseInt(e.target.value, 10))}
                className="text-xs py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-250 cursor-pointer"
                min={1}
                required
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Action Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Schedule Call Reminder..."
              className="text-xs py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-250"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Instructions description</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="e.g. Discuss mobile speeds..."
              className="text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-250 h-16"
            />
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" className="w-full flex items-center justify-center space-x-1">
              <Plus size={13} />
              <span>Add Step Node</span>
            </Button>
          </div>
        </form>
      </Card>

    </div>
  );
};
export default SequenceBuilder;
