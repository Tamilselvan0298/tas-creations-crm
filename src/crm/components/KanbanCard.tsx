import React from 'react';
import type { Lead } from '../../shared/types';
import { Link } from 'react-router-dom';
import { Card } from '../../shared/components/Card';
import { ExternalLink } from 'lucide-react';

interface KanbanCardProps {
  lead: Lead;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ lead }) => {
  const c = lead.company;
  if (!c) return null;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', lead.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const getPriorityTag = () => {
    const isHot = lead.tags.includes('Hot');
    const isVip = lead.tags.includes('VIP');
    
    if (isVip) return 'bg-purple-100 dark:bg-purple-950/20 text-purple-600 border border-purple-200';
    if (isHot) return 'bg-red-100 dark:bg-red-950/20 text-red-600 border border-red-200';
    return 'bg-blue-100 dark:bg-blue-900/10 text-blue-600 border border-blue-200';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="cursor-grab active:cursor-grabbing transform hover:scale-[1.01] transition-all duration-200"
    >
      <Card glass className="p-3 border-slate-200/80 dark:border-slate-800/60 shadow-sm relative hover:border-[#D4AF37]/50">
        
        {/* Name and Detail link */}
        <div className="flex justify-between items-start mb-2">
          <Link 
            to={`/leads/${lead.id}`} 
            className="font-bold text-xs text-slate-800 dark:text-slate-100 hover:text-[#D4AF37] hover:underline truncate max-w-[80%]"
          >
            {c.name}
          </Link>
          <a 
            href={`https://${c.website}`} 
            target="_blank" 
            rel="noreferrer" 
            className="text-slate-400 hover:text-[#D4AF37] shrink-0"
          >
            <ExternalLink size={10} />
          </a>
        </div>

        {/* Category & Region */}
        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mb-3">
          {c.category} • {c.address?.city || 'USA'}
        </div>

        {/* Badges and Tags row */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded ${getPriorityTag()}`}>
            {lead.tags[0] || 'Lead'}
          </span>
          {c.phone && (
            <span className="text-[9px] text-slate-400 font-medium">
              📞 Connected
            </span>
          )}
        </div>

      </Card>
    </div>
  );
};
export default KanbanCard;
