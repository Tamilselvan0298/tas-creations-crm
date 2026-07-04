import React, { useState } from 'react';
import { useOutreach } from '../hooks/useOutreach';
import { CampaignDashboard } from './CampaignDashboard';
import { EmailComposeModal } from './EmailComposeModal';
import { WhatsAppChat } from './WhatsAppChat';
import { SequenceBuilder } from './SequenceBuilder';
import { Button } from '../../shared/components/Button';
import { Send, MessageSquare, ListTodo, BarChart3, Mail } from 'lucide-react';

export const OutreachCenter: React.FC = () => {
  const {
    campaigns,
    templates,
    conversations,
    activeChat,
    activeChatId,
    setActiveChatId,
    loading,
    createCampaign,
    sendChatMessage,
    generateAiCopy,
  } = useOutreach();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'whatsapp' | 'sequences'>('dashboard');
  const [composeOpen, setComposeOpen] = useState(false);

  const tabs: Array<{ id: typeof activeTab; label: string; icon: any }> = [
    { id: 'dashboard', label: 'Campaigns Dashboard', icon: BarChart3 },
    { id: 'whatsapp', label: 'WhatsApp Messenger', icon: MessageSquare },
    { id: 'sequences', label: 'Sequence Pipeline', icon: ListTodo },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title & Compose Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
            <Send size={20} className="mr-2.5 text-[#D4AF37]" />
            <span>Outreach Hub Command Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build multichannel campaigns, generate copy using Gemini AI, and schedule automated sequence steps.
          </p>
        </div>

        <Button size="sm" onClick={() => setComposeOpen(true)} className="flex items-center space-x-1.5 shrink-0">
          <Mail size={13} />
          <span>Compose Email</span>
        </Button>
      </div>

      {/* Tabs Menu Selection */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 space-x-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-1 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'border-b-[#D4AF37] text-slate-800 dark:text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading state indicator */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-2"></div>
          <span>Syncing outreach center statistics...</span>
        </div>
      ) : (
        <div className="mt-6">
          {activeTab === 'dashboard' && (
            <CampaignDashboard campaigns={campaigns} onCreateCampaign={createCampaign} />
          )}
          {activeTab === 'whatsapp' && (
            <WhatsAppChat
              conversations={conversations}
              activeChat={activeChat}
              activeChatId={activeChatId}
              onSelectChat={setActiveChatId}
              onSendMessage={sendChatMessage}
              onGenerateAi={generateAiCopy}
            />
          )}
          {activeTab === 'sequences' && <SequenceBuilder />}
        </div>
      )}

      {/* Pop-up Composers */}
      <EmailComposeModal
        isOpen={composeOpen}
        onClose={() => setComposeOpen(false)}
        templates={templates}
        onGenerateAi={generateAiCopy}
      />

    </div>
  );
};
export default OutreachCenter;
