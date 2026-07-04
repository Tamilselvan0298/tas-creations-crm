import React, { useState } from 'react';
import { useAi } from '../hooks/useAi';
import { AiChatInterface } from './AiChatInterface';
import { LeadScorer } from './LeadScorer';
import { CompetitorAnalyzer } from './CompetitorAnalyzer';
import { MeetingAssistant } from './MeetingAssistant';
import { Sparkles, ClipboardCheck, Compass, Bot } from 'lucide-react';

export const AiIntelligenceCenter: React.FC = () => {
  const {
    chatMessages,
    chatLoading,
    scoreReport,
    scoreLoading,
    competitorReport,
    competitorLoading,
    meetingReport,
    meetingLoading,
    sendChatMessage,
    calculateLeadScore,
    scanCompetitors,
    digestMeetingTranscript,
  } = useAi();

  const [activeTab, setActiveTab] = useState<'chat' | 'scoring' | 'competitors' | 'meeting'>('chat');

  const tabs: Array<{ id: typeof activeTab; label: string; icon: any }> = [
    { id: 'chat', label: 'AI Sales Chatbot', icon: Bot },
    { id: 'scoring', label: 'Lead Scoring Calculator', icon: ClipboardCheck },
    { id: 'competitors', label: 'Competitor Scanner', icon: Compass },
    { id: 'meeting', label: 'Meeting transcript assistant', icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
          <Sparkles size={20} className="mr-2.5 text-[#D4AF37] animate-pulse" />
          <span>AI Sales Intelligence Hub</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Leverage Gemini-1.5-flash to score opportunities, audit SEO competitor metrics, and extract actionable sync summaries.
        </p>
      </div>

      {/* Tabs bar */}
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
                  : 'border-transparent text-slate-400 hover:text-slate-650'
              }`}
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel rendering */}
      <div className="mt-6">
        {activeTab === 'chat' && (
          <AiChatInterface messages={chatMessages} loading={chatLoading} onSendMessage={sendChatMessage} />
        )}
        {activeTab === 'scoring' && (
          <LeadScorer report={scoreReport} loading={scoreLoading} onScoreLead={calculateLeadScore} />
        )}
        {activeTab === 'competitors' && (
          <CompetitorAnalyzer report={competitorReport} loading={competitorLoading} onScan={scanCompetitors} />
        )}
        {activeTab === 'meeting' && (
          <MeetingAssistant report={meetingReport} loading={meetingLoading} onSummarize={digestMeetingTranscript} />
        )}
      </div>

    </div>
  );
};
export default AiIntelligenceCenter;
