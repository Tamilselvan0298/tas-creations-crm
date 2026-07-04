import React, { useState } from 'react';
import type { AiChatMessage } from '../../shared/services/aiRepository';
import { Button } from '../../shared/components/Button';
import { Send, Bot } from 'lucide-react';

interface AiChatInterfaceProps {
  messages: AiChatMessage[];
  loading: boolean;
  onSendMessage: (text: string) => void;
}

export const AiChatInterface: React.FC<AiChatInterfaceProps> = ({
  messages,
  loading,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const promptChips = [
    'Analyze Acme Corp',
    'Suggest website audit pricing',
    'Write sales email pitch',
    'Draft cold call opener script'
  ];

  const handleChipClick = (chip: string) => {
    setInputText(chip);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm h-[65vh] animate-fade-in">
      
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <Bot size={16} className="mr-2 text-[#D4AF37]" />
          <span>Conversational AI Assistant</span>
        </h3>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gemini-1.5-flash Powered</span>
      </div>

      {/* Bubbles scroll view */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20 dark:bg-slate-950/5">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-[#0B1F3A] text-white rounded-tr-none border border-[#D4AF37]/20 font-semibold'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-250 rounded-tl-none font-medium'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 p-3.5 rounded-2xl rounded-tl-none flex items-center space-x-2">
              <div className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full animate-bounce"></div>
              <div className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="h-1.5 w-1.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Prompt Shortcut chips */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-950/10 flex items-center space-x-2 overflow-x-auto shrink-0 scrollbar-none">
        {promptChips.map(chip => (
          <button
            key={chip}
            type="button"
            onClick={() => handleChipClick(chip)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 rounded-full text-[9px] font-bold tracking-wide whitespace-nowrap cursor-pointer transition-all border border-transparent hover:border-[#D4AF37]/25"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2 shrink-0">
        <input
          type="text"
          placeholder="Ask AI anything about these leads, proposals, or campaign scripts..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 text-xs py-2.5 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-xl text-slate-700 dark:text-slate-250"
          disabled={loading}
        />
        <Button type="submit" size="sm" className="px-4 py-2.5" isLoading={loading}>
          <Send size={12} />
        </Button>
      </form>

    </div>
  );
};
export default AiChatInterface;
