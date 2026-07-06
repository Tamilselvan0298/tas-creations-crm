import React, { useState, useEffect } from 'react';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { 
  GitFork, 
  Zap, 
  GitPullRequest, 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock, 
  Plus, 
  Trash2, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { workflowRepository } from '../../shared/services/workflowRepository';
import type { WorkflowSettings } from '../../shared/services/workflowRepository';

interface SequenceStep {
  id: string;
  day: number;
  type: 'email' | 'whatsapp' | 'sms' | 'call' | 'proposal';
  title: string;
  description: string;
}

export const WorkflowHub: React.FC = () => {
  const [settings, setSettings] = useState<WorkflowSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'sequences' | 'pipeline'>('leads');
  const [loading, setLoading] = useState(true);

  // Sequences States
  const [steps, setSteps] = useState<SequenceStep[]>([
    { id: '1', day: 1, type: 'email', title: 'Intro Pitch Cold Email', description: 'Pitch free technical website speed audit.' },
    { id: '2', day: 3, type: 'whatsapp', title: 'WhatsApp Speed Diagnostic Check', description: 'Send PDF checklist and request discovery call.' },
    { id: '3', day: 5, type: 'email', title: 'Follow-up SEO Analysis Review', description: 'Brief overview of search ranking opportunities.' },
    { id: '4', day: 8, type: 'call', title: 'Discovery Phone Call Sync', description: 'Address design questions and discuss budget estimations.' },
  ]);

  const [newDay, setNewDay] = useState(10);
  const [newType, setNewType] = useState<SequenceStep['type']>('email');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await workflowRepository.getWorkflowSettings();
        setSettings(data);
      } catch (e) {
        console.error('Failed to load workflow settings:', e);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleToggleLeadRule = async (field: keyof WorkflowSettings['leadAutomation']) => {
    if (!settings) return;
    
    const updatedLead = { 
      ...settings.leadAutomation, 
      [field]: !settings.leadAutomation[field] 
    };
    
    try {
      await workflowRepository.saveWorkflowSettings({
        ...settings,
        leadAutomation: updatedLead
      });
      setSettings({
        ...settings,
        leadAutomation: updatedLead
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleTogglePipelineRule = async (index: number) => {
    if (!settings) return;

    const updatedRules = [...settings.pipelineRules];
    updatedRules[index] = {
      ...updatedRules[index],
      enabled: !updatedRules[index].enabled
    };

    try {
      await workflowRepository.saveWorkflowSettings({
        ...settings,
        pipelineRules: updatedRules
      });
      setSettings({
        ...settings,
        pipelineRules: updatedRules
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newStep: SequenceStep = {
      id: 'step-' + Date.now(),
      day: newDay,
      type: newType,
      title: newTitle.trim(),
      description: newDesc.trim()
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
      default: return <Clock size={13} />;
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-2"></div>
        <span>Loading automation settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
            <GitFork size={20} className="mr-2.5 text-[#D4AF37]" />
            <span>Workflow Automation Hub</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build automated rules, configure outreach sequences, and map pipeline triggers.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800 font-semibold text-xs text-slate-500">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-md transition-all cursor-pointer ${activeTab === 'leads' ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
          >
            <Zap size={13} className="inline mr-1.5" />
            Lead Capture Triggers
          </button>
          <button 
            onClick={() => setActiveTab('sequences')}
            className={`px-4 py-2 rounded-md transition-all cursor-pointer ${activeTab === 'sequences' ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
          >
            <GitPullRequest size={13} className="inline mr-1.5" />
            Outreach Sequences
          </button>
          <button 
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-md transition-all cursor-pointer ${activeTab === 'pipeline' ? 'bg-white dark:bg-slate-800 text-slate-850 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
          >
            <GitFork size={13} className="inline mr-1.5" />
            Pipeline Stage Rules
          </button>
        </div>
      </div>

      {activeTab === 'leads' ? (
        /* Tab 1: Lead Capture triggers */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
          <div className="md:col-span-2 space-y-6">
            <Card title="Automation Triggers on Lead Capture" subtitle="Rules executed instantly when a new lead is imported or registered.">
              <div className="space-y-4 pt-2">
                
                {/* Trigger Row 1 */}
                <div className="flex justify-between items-center py-3.5 border-b border-slate-100 dark:border-slate-900/60">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-850 dark:text-white">Auto-run Website Crawler & Technical Audit</p>
                    <p className="text-[10px] text-slate-450 leading-relaxed max-w-md">Scrapes SEO tags, sitemaps, headers, and extracts active contact phone numbers and email channels.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.leadAutomation.autoScrape} 
                      onChange={() => handleToggleLeadRule('autoScrape')}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                {/* Trigger Row 2 */}
                <div className="flex justify-between items-center py-3.5 border-b border-slate-100 dark:border-slate-900/60">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-850 dark:text-white">Auto-trigger Google PageSpeed Mobile Vitals</p>
                    <p className="text-[10px] text-slate-455 leading-relaxed max-w-md">Analyses mobile speed indices (LCP, CLS, INP) for technical optimization diagnostics.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.leadAutomation.autoSpeed} 
                      onChange={() => handleToggleLeadRule('autoSpeed')}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                {/* Trigger Row 3 */}
                <div className="flex justify-between items-center py-3.5 border-b border-slate-100 dark:border-slate-900/60">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-850 dark:text-white">Trigger AI Gemini Lead Profiler</p>
                    <p className="text-[10px] text-slate-455 leading-relaxed max-w-md">Runs Gemini reasoning model to review crawled metadata, draft pitch summaries, and estimate project budgets.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.leadAutomation.autoScore} 
                      onChange={() => handleToggleLeadRule('autoScore')}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                {/* Trigger Row 4 */}
                <div className="flex justify-between items-center py-3.5 border-b border-slate-100 dark:border-slate-900/60">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-850 dark:text-white">Auto-Assign Default Task Checklist</p>
                    <p className="text-[10px] text-slate-455 leading-relaxed max-w-md">Automatically deploys active follow-up tasks linked directly to the new company file.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.leadAutomation.autoTasks} 
                      onChange={() => handleToggleLeadRule('autoTasks')}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

                {/* Trigger Row 5 */}
                <div className="flex justify-between items-center py-3.5">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-850 dark:text-white">Auto-Assign Lead Owner (Round Robin)</p>
                    <p className="text-[10px] text-slate-455 leading-relaxed max-w-md">Distributes new lead ownership sequentially among available workspace agents.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={settings.leadAutomation.autoAssign} 
                      onChange={() => handleToggleLeadRule('autoAssign')}
                      className="sr-only peer" 
                    />
                    <div className="w-9 h-5 bg-slate-200 dark:bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                  </label>
                </div>

              </div>
            </Card>
          </div>

          {/* Right sidebar info */}
          <div className="md:col-span-1 space-y-6">
            <Card title="Trigger Summary" subtitle="Operational metrics">
              <div className="space-y-4 pt-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-lg flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Active Rules</span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {Object.values(settings.leadAutomation).filter(Boolean).length} Rules
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-lg flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Target Queue</span>
                  <span className="font-bold text-slate-800 dark:text-white">Instant Trigger</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : activeTab === 'sequences' ? (
        /* Tab 2: Outreach step sequences */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
          {/* Left panel Timeline visualizer */}
          <div className="md:col-span-2 space-y-6">
            <Card title="Automation Step Sequence Pipeline" subtitle="Configure automatic delayed follow-ups across channels.">
              <div className="mt-6 relative pl-6 space-y-6">
                
                {/* Left timeline thread */}
                <div className="absolute left-2.5 top-2.5 bottom-6 w-0.5 bg-slate-100 dark:bg-slate-905/70 border-l border-slate-200 dark:border-slate-900" />

                {steps.map((step) => (
                  <div key={step.id} className="relative flex items-start group">
                    {/* Circle Node */}
                    <div className="absolute left-[-24px] top-1.5 h-5 w-5 rounded-full border border-white dark:border-slate-900 bg-white dark:bg-slate-950 shadow-sm flex items-center justify-center text-[#D4AF37]">
                      {getStepIcon(step.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-extrabold px-2 py-0.5 rounded-full border border-slate-200/40 dark:border-slate-800/80">
                          Day {step.day}
                        </span>
                        <span className="text-xs font-bold text-slate-850 dark:text-slate-100 truncate pt-0.5">
                          {step.title}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15">
                          {step.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                        {step.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteStep(step.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer shrink-0 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right panel add step creator */}
          <div className="md:col-span-1">
            <Card title="Add Sequence Step" subtitle="Build visual pipeline timeline node">
              <form onSubmit={handleAddStep} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase block">Action Type</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-350 focus:border-[#D4AF37] focus:ring-0 cursor-pointer outline-none"
                    >
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="call">Call</option>
                      <option value="proposal">Proposal</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-450 uppercase block">Day Delay</label>
                    <input
                      type="number"
                      value={newDay}
                      onChange={(e) => setNewDay(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-350 focus:border-[#D4AF37] focus:ring-0 outline-none"
                      min={1}
                      required
                    />
                  </div>
                </div>

                <Input
                  label="Action Title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Follow-up Pitch Email"
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Step Details Description</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Briefly state the goal of this step node..."
                    className="w-full min-h-[60px] p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl text-xs text-slate-800 dark:text-slate-250 focus:border-[#D4AF37] focus:ring-0 outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full justify-center">
                    <Plus size={14} className="mr-1.5" /> Add Step Node
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      ) : (
        /* Tab 3: Pipeline mapping rules */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
          <div className="md:col-span-2 space-y-6">
            <Card title="Sales Pipeline Stage Automations" subtitle="Auto-transitions stage steps based on trigger changes.">
              <div className="space-y-4 pt-2">
                
                {settings.pipelineRules.map((rule, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3.5 border-b border-slate-100 dark:border-slate-900/60 last:border-0">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-[#D4AF37]/20 uppercase">
                          Trigger
                        </span>
                        <span className="font-extrabold text-slate-850 dark:text-white text-xs">{rule.trigger}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="bg-indigo-50 dark:bg-slate-900 text-indigo-500 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-indigo-150/10 uppercase">
                          Action
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{rule.action}</span>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rule.enabled} 
                        onChange={() => handleTogglePipelineRule(idx)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>
                ))}

              </div>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card title="Rules Log" subtitle="Audit activity">
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 text-slate-650 dark:text-slate-350 rounded-lg flex items-start space-x-2 leading-relaxed">
                <AlertCircle size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-[10.5px]">
                  Custom Pipeline Automations are evaluated in real-time when Proposals or Invoice transactions are compiled.
                </span>
              </div>
            </Card>
          </div>
        </div>
      )}

    </div>
  );
};
export default WorkflowHub;
