import React, { useState, useEffect } from 'react';
import { noteRepository } from '../../../shared/services/noteRepository';
import type { CRMNote } from '../../../shared/services/noteRepository';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Pin, Trash2 } from 'lucide-react';
import { useAuth } from '../../../shared/hooks/useAuth';

interface CompanyNotesTabProps {
  leadId: string;
}

export const CompanyNotesTab: React.FC<CompanyNotesTabProps> = ({ leadId }) => {
  const [notes, setNotes] = useState<CRMNote[]>([]);
  const [newContent, setNewContent] = useState('');
  const [pinOnCreate, setPinOnCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = noteRepository.subscribeForLead(leadId, (data) => {
      setNotes(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [leadId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      await noteRepository.create({
        leadId,
        content: newContent,
        createdBy: user?.displayName || 'User',
        pinned: pinOnCreate,
        attachments: [],
        createdAt: new Date(),
      });
      setNewContent('');
      setPinOnCreate(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePin = async (id: string) => {
    await noteRepository.togglePin(id);
  };

  const handleDelete = async (id: string) => {
    await noteRepository.delete(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Create Note Card */}
      <Card title="Add Account Note" subtitle="Log details regarding meetings or calls. Pinned notes display at the top.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Type notes details..."
            className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-xl h-24"
            required
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium select-none cursor-pointer">
              <input
                type="checkbox"
                checked={pinOnCreate}
                onChange={(e) => setPinOnCreate(e.target.checked)}
                className="mr-2 h-4 w-4 rounded border-slate-300 text-[#0B1F3A] focus:ring-[#D4AF37]"
              />
              Pin to top of account
            </label>
            <Button type="submit" size="sm">
              Save Note
            </Button>
          </div>
        </form>
      </Card>

      {/* Pinned & Recent Notes Display */}
      {loading ? (
        <div className="text-center py-6 text-xs text-slate-400">Syncing notes stream...</div>
      ) : (
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No logged notes for this account.
            </div>
          ) : (
            notes.map((note) => (
              <Card
                key={note.id}
                className={`border-l-4 ${
                  note.pinned 
                    ? 'border-l-[#D4AF37] bg-[#D4AF37]/5 dark:bg-[#D4AF37]/2' 
                    : 'border-l-slate-300 dark:border-l-slate-800'
                }`}
                extra={
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTogglePin(note.id)}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                        note.pinned ? 'text-[#D4AF37]' : 'text-slate-400'
                      }`}
                      title={note.pinned ? 'Unpin note' : 'Pin note'}
                    >
                      <Pin size={13} className={note.pinned ? 'fill-current' : ''} />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                }
              >
                <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
                <div className="mt-4 flex items-center space-x-2 text-[10px] text-slate-400 font-semibold">
                  <span className="text-slate-500 dark:text-slate-300">{note.createdBy}</span>
                  <span>•</span>
                  <span>
                    {new Date(note.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

    </div>
  );
};
export default CompanyNotesTab;
