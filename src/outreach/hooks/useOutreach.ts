import { useState, useEffect } from 'react';
import { outreachRepository } from '../../shared/services/outreachRepository';
import type { Campaign, OutreachTemplate } from '../../shared/services/outreachRepository';

export interface ChatMessage {
  id: string;
  sender: 'agency' | 'prospect';
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  companyName: string;
  lastMessage: string;
  messages: ChatMessage[];
}

export const useOutreach = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<OutreachTemplate[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadOutreachData = async () => {
    setLoading(true);
    try {
      const [cList, tList] = await Promise.all([
        outreachRepository.listCampaigns(),
        outreachRepository.listTemplates(),
      ]);
      setCampaigns(cList);
      setTemplates(tList);
    } catch (e) {
      console.warn('Failed to load campaigns/templates:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOutreachData();
    
    // Seed 2 mock active WhatsApp chats
    const seedChats: ChatConversation[] = [
      {
        id: 'chat-1',
        companyName: 'Acme Corp',
        lastMessage: 'Got the audit sheet, looks good. Let’s hop on a call Friday.',
        messages: [
          { id: 'm-1', sender: 'agency', text: 'Hey there! Sent the speed audit over to your email.', timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
          { id: 'm-2', sender: 'prospect', text: 'Got the audit sheet, looks good. Let’s hop on a call Friday.', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
        ],
      },
      {
        id: 'chat-2',
        companyName: 'Spark Media',
        lastMessage: 'Sure, send the proposal link.',
        messages: [
          { id: 'm-3', sender: 'agency', text: 'Hi Spark Media, following up on the design outline.', timestamp: new Date(Date.now() - 120 * 60000).toISOString() },
          { id: 'm-4', sender: 'prospect', text: 'Sure, send the proposal link.', timestamp: new Date(Date.now() - 80 * 60000).toISOString() },
        ],
      },
    ];
    setConversations(seedChats);
    setActiveChatId(seedChats[0]?.id || '');
  }, []);

  const createCampaign = async (name: string, channel: 'email' | 'whatsapp' | 'sms') => {
    try {
      const newCamp = await outreachRepository.createCampaign(name, channel);
      setCampaigns(prev => [newCamp, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  const sendChatMessage = (text: string) => {
    if (!text.trim() || !activeChatId) return;
    setConversations(prev =>
      prev.map(chat => {
        if (chat.id === activeChatId) {
          const newMsg: ChatMessage = {
            id: 'msg-' + Date.now(),
            sender: 'agency',
            text,
            timestamp: new Date().toISOString(),
          };
          return {
            ...chat,
            lastMessage: text,
            messages: [...chat.messages, newMsg],
          };
        }
        return chat;
      })
    );
  };

  const generateAiCopy = async (type: 'email' | 'whatsapp' | 'call', ctx: { company: string; website?: string; category?: string }) => {
    return await outreachRepository.getAiCopy(type, ctx);
  };

  const activeChat = conversations.find(c => c.id === activeChatId);

  return {
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
    refreshData: loadOutreachData,
  };
};
export default useOutreach;
