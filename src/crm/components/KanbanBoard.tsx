import React from 'react';
import { useKanban } from '../hooks/useKanban';
import { KanbanCard } from './KanbanCard';
import type { LeadStatus } from '../../shared/types';
import { Columns, Layers } from 'lucide-react';

export const KanbanBoard: React.FC = () => {
  const { columns, boardData, loading, moveLead } = useKanban();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: LeadStatus) => {
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      await moveLead(leadId, targetStatus);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-2"></div>
        <span>Syncing pipeline board...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Board Header Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
          <Columns size={20} className="mr-2.5 text-[#D4AF37]" />
          <span>Opportunity Pipeline CRM</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Drag and drop cards across columns to update lead opportunity statuses in realtime.
        </p>
      </div>

      {/* Columns Scroll Wrapper */}
      <div className="flex space-x-4 pb-6 overflow-x-auto min-h-[70vh]">
        {columns.map((col) => {
          const columnLeads = boardData[col.id] || [];
          return (
            <div
              key={col.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`w-72 shrink-0 border border-slate-200/80 dark:border-slate-800/60 rounded-2xl flex flex-col p-3 shadow-sm ${col.color}`}
            >
              
              {/* Column Meta Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3 shrink-0">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider truncate max-w-[80%]">
                  {col.title}
                </span>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-extrabold px-2 py-0.5 rounded-full shrink-0">
                  {columnLeads.length}
                </span>
              </div>

              {/* Cards Scroll Viewport */}
              <div className="flex-1 space-y-3 overflow-y-auto min-h-[50vh] pr-0.5">
                {columnLeads.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-400">
                    <Layers size={14} className="mb-1 text-slate-300" />
                    <span>Drop cards here</span>
                  </div>
                ) : (
                  columnLeads.map((lead) => (
                    <KanbanCard key={lead.id} lead={lead} />
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
export default KanbanBoard;
