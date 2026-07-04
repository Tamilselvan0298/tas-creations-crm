import React, { useState } from 'react';
import type { ChatConversation } from '../hooks/useOutreach';
import { Button } from '../../shared/components/Button';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

interface WhatsAppChatProps {
  conversations: ChatConversation[];
  activeChat?: ChatConversation;
  activeChatId: string;
  onSelectChat: (id: string) => void;
  onSendMessage: (text: string) => void;
  onGenerateAi: (type: 'whatsapp', ctx: { company: string; category: string }) => Promise<string>;
}

export const WhatsAppChat: React.FC<WhatsAppChatProps> = ({
  conversations,
  activeChat,
  activeChatId,
  onSelectChat,
  onSendMessage,
  onGenerateAi,
}) => {
  const [inputText, setInputText] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleAiQuickReply = async () => {
    if (!activeChat) return;
    setLoadingAi(true);
    try {
      const reply = await onGenerateAi('whatsapp', {
        company: activeChat.companyName,
        category: 'Outreach prospect',
      });
      setInputText(reply);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="flex bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm h-[65vh] animate-fade-in">
      
      {/* Active Chats Sidebar */}
      <div className="w-56 border-r border-slate-100 dark:border-slate-800 shrink-0 flex flex-col">
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/10">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Conversations</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(chat => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left text-xs p-2.5 rounded-xl transition-all cursor-pointer block ${
                activeChatId === chat.id
                  ? 'border border-[#D4AF37] bg-[#D4AF37]/5 font-bold text-slate-800 dark:text-white'
                  : 'border border-transparent hover:bg-slate-50 text-slate-500'
              }`}
            >
              <div className="font-semibold truncate">{chat.companyName}</div>
              <div className="text-[9px] text-slate-400 truncate mt-1">{chat.lastMessage}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Messaging Viewport */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/10">
        {activeChat ? (
          <>
            {/* Header info */}
            <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center shrink-0">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{activeChat.companyName} Chat Log</span>
              
              <button
                onClick={handleAiQuickReply}
                disabled={loadingAi}
                className="inline-flex items-center space-x-1 text-[10px] text-[#D4AF37] hover:text-[#D4AF37]/80 disabled:opacity-40 cursor-pointer font-bold"
              >
                <Sparkles size={11} className="animate-pulse" />
                <span>{loadingAi ? 'Drafting...' : 'AI Quick Reply'}</span>
              </button>
            </div>

            {/* Bubble logs */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChat.messages.map(msg => {
                const isAgency = msg.sender === 'agency';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isAgency ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        isAgency
                          ? 'bg-[#0B1F3A] text-white rounded-tr-none border border-[#D4AF37]/20'
                          : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-250 rounded-tl-none'
                      }`}
                    >
                      <p className="font-semibold">{msg.text}</p>
                      <span className="text-[8px] text-slate-400 block mt-1.5 text-right uppercase tracking-wider font-semibold">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message input bar */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 flex items-center space-x-2 shrink-0">
              <input
                type="text"
                placeholder="Type your WhatsApp message response here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 text-xs py-2 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-xl text-slate-700 dark:text-slate-250"
              />
              <Button type="submit" size="sm" className="px-3">
                <Send size={12} />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs">
            <MessageSquare size={20} className="mb-2 text-slate-300" />
            <span>Select a conversation to start messaging.</span>
          </div>
        )}
      </div>

    </div>
  );
};
export default WhatsAppChat;
