import { useState } from 'react';
import { aiRepository } from '../../shared/services/aiRepository';
import type { AiChatMessage, LeadScoreReport, CompetitorReport, MeetingSummaryReport } from '../../shared/services/aiRepository';

export const useAi = () => {
  const [chatMessages, setChatMessages] = useState<AiChatMessage[]>([
    { role: 'model', content: 'Hello! I am your TAS AI Intelligence assistant. Ask me to outline a client proposal, suggest pricing ranges, or write custom outreach pitches.' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Lead Scorer states
  const [scoreReport, setScoreReport] = useState<LeadScoreReport | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);

  // Competitor states
  const [competitorReport, setCompetitorReport] = useState<CompetitorReport | null>(null);
  const [competitorLoading, setCompetitorLoading] = useState(false);

  // Meeting states
  const [meetingReport, setMeetingReport] = useState<MeetingSummaryReport | null>(null);
  const [meetingLoading, setMeetingLoading] = useState(false);

  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: AiChatMessage = { role: 'user', content: text };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatLoading(true);

    try {
      const replyText = await aiRepository.sendChatMessage(updatedMessages);
      setChatMessages(prev => [...prev, { role: 'model', content: replyText }]);
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { role: 'model', content: 'Failed to retrieve response. Check connection.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const calculateLeadScore = async (factors: {
    hasWebsite: boolean;
    reviewsCount: number;
    googleRating: number;
    hasMetaPixel: boolean;
    hasGtm: boolean;
    pageSpeed: number;
    ssl: boolean;
  }) => {
    setScoreLoading(true);
    try {
      const report = await aiRepository.scoreLead(factors);
      setScoreReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setScoreLoading(false);
    }
  };

  const scanCompetitors = async (company: string, website?: string) => {
    setCompetitorLoading(true);
    try {
      const report = await aiRepository.scanCompetitors(company, website);
      setCompetitorReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setCompetitorLoading(false);
    }
  };

  const digestMeetingTranscript = async (transcript: string) => {
    setMeetingLoading(true);
    try {
      const report = await aiRepository.digestMeetingTranscript(transcript);
      setMeetingReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setMeetingLoading(false);
    }
  };

  return {
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
  };
};
export default useAi;
