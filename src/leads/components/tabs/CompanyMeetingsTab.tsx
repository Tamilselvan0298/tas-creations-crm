import React, { useState, useEffect } from 'react';
import { meetingRepository } from '../../../shared/services/meetingRepository';
import type { Meeting } from '../../../shared/services/meetingRepository';
import { Card } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Calendar, Clock, Trash2 } from 'lucide-react';

interface CompanyMeetingsTabProps {
  leadId: string;
}

export const CompanyMeetingsTab: React.FC<CompanyMeetingsTabProps> = ({ leadId }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = meetingRepository.subscribeForLead(leadId, (data) => {
      setMeetings(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [leadId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    try {
      await meetingRepository.create({
        leadId,
        title,
        description: description || undefined,
        date: new Date(date),
        duration: parseInt(duration, 10),
        status: 'scheduled',
      });
      setTitle('');
      setDescription('');
      setDate('');
      setDuration('30');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    await meetingRepository.delete(id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Create Meeting Form */}
      <Card title="Schedule Client Meeting" subtitle="Map call invites, demo sessions, or contract reviews.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Meeting Topic"
            placeholder="e.g. Discovery Call, Contract Review..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Agenda Description"
            placeholder="e.g. Discuss SEO report deliverables..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Meeting Date & Time"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Duration (Minutes)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                <option value="15">15 mins</option>
                <option value="30">30 mins</option>
                <option value="45">45 mins</option>
                <option value="60">60 mins</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm">
              Schedule Sync
            </Button>
          </div>
        </form>
      </Card>

      {/* Meetings Schedule Cards */}
      {loading ? (
        <div className="text-center py-6 text-xs text-slate-400">Syncing meeting schedules...</div>
      ) : (
        <div className="space-y-4">
          {meetings.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No meetings scheduled for this account.
            </div>
          ) : (
            meetings.map((meet) => (
              <Card
                key={meet.id}
                title={meet.title}
                extra={
                  <button
                    onClick={() => handleDelete(meet.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800/35 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                }
              >
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{meet.description || 'No agenda recorded.'}</p>
                <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span className="flex items-center text-[#D4AF37]">
                    <Calendar size={12} className="mr-1.5 shrink-0" />
                    {new Date(meet.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1.5 shrink-0" />
                    {meet.duration} Minutes
                  </span>
                  <span className="flex items-center px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-850 text-slate-500 font-bold">
                    {meet.status}
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
export default CompanyMeetingsTab;
