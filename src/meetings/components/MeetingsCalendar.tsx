import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meetingRepository } from '../../shared/services/meetingRepository';
import type { Meeting } from '../../shared/services/meetingRepository';
import { leadRepository } from '../../shared/services/leadRepository';
import type { Lead } from '../../shared/types';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { Input } from '../../shared/components/Input';
import { 
  Calendar as CalendarIcon, 
  Trash2, 
  Clock, 
  Plus, 
  Building, 
  CheckCircle2, 
  FileText, 
  XCircle,
  Video
} from 'lucide-react';

export const MeetingsCalendar: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('scheduled');

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [leadId, setLeadId] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('30');
  const [formMsg, setFormMsg] = useState<string | null>(null);
  const [scheduling, setScheduling] = useState(false);

  // Extended Note Edit State
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [customNotesText, setCustomNotesText] = useState('');

  useEffect(() => {
    setLoading(true);

    // Subscribe to meetings
    const unsubscribeMeetings = meetingRepository.subscribe((items) => {
      setMeetings(items);
      setLoading(false);
    });

    // Subscribe to leads (to associate with meetings)
    const unsubscribeLeads = leadRepository.subscribeWithCompanies((items) => {
      setLeads(items);
    });

    return () => {
      unsubscribeMeetings();
      unsubscribeLeads();
    };
  }, []);

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);
    if (!title.trim() || !date) {
      setFormMsg('Please enter a meeting title and date/time.');
      return;
    }

    setScheduling(true);
    try {
      await meetingRepository.create({
        leadId: leadId || 'lead-1',
        title: title.trim(),
        description: description.trim(),
        date: new Date(date),
        duration: parseInt(duration, 10) || 30,
        status: 'scheduled',
      });
      setTitle('');
      setDescription('');
      setLeadId('');
      setDate('');
      setDuration('30');
      setFormMsg('Meeting scheduled successfully.');
    } catch (err: any) {
      setFormMsg(err.message || 'Failed to schedule meeting.');
    } finally {
      setScheduling(false);
    }
  };

  const handleUpdateStatus = async (meetingId: string, status: Meeting['status']) => {
    try {
      await meetingRepository.update(meetingId, { status });
    } catch (e) {
      console.error('Failed to update meeting status:', e);
    }
  };

  const handleSaveNotes = async (meetingId: string) => {
    try {
      await meetingRepository.update(meetingId, { meetingNotes: customNotesText.trim() });
      setEditingNotesId(null);
      setCustomNotesText('');
    } catch (e) {
      console.error('Failed to save meeting notes:', e);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      await meetingRepository.delete(meetingId);
    } catch (e) {
      console.error('Failed to delete meeting:', e);
    }
  };

  // Filter meetings
  const filteredMeetings = meetings.filter(m => {
    if (statusFilter === 'all') return true;
    return m.status === statusFilter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center">
          <CalendarIcon size={20} className="mr-2.5 text-[#D4AF37]" />
          <span>Calendar & Meetings Planner</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Schedule agency meetings, client demo syncs, set automated reminder triggers, and map calendars.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent mx-auto mb-2"></div>
          <span>Loading calendar...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
          
          {/* Left Panel: Meetings schedule list (Col span 2) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Filter Toggle Buttons */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200/50 dark:border-slate-800 text-slate-500 self-start inline-flex">
              <button
                onClick={() => setStatusFilter('scheduled')}
                className={`px-4 py-2 rounded-md transition-all cursor-pointer ${statusFilter === 'scheduled' ? 'bg-white dark:bg-slate-800 text-slate-805 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-md transition-all cursor-pointer ${statusFilter === 'completed' ? 'bg-white dark:bg-slate-800 text-slate-805 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
              >
                Completed
              </button>
              <button
                onClick={() => setStatusFilter('cancelled')}
                className={`px-4 py-2 rounded-md transition-all cursor-pointer ${statusFilter === 'cancelled' ? 'bg-white dark:bg-slate-800 text-slate-805 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
              >
                Cancelled
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-md transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-white dark:bg-slate-800 text-slate-805 dark:text-white shadow-sm' : 'hover:text-slate-800'}`}
              >
                All
              </button>
            </div>

            {/* Meetings Cards Feed */}
            <div className="space-y-4">
              {filteredMeetings.length === 0 ? (
                <Card>
                  <p className="text-center text-slate-400 py-8">No meetings scheduled for this criteria.</p>
                </Card>
              ) : (
                filteredMeetings.map(m => {
                  const linkedLead = leads.find(l => l.id === m.leadId);
                  
                  let sColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                  if (m.status === 'completed') sColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                  else if (m.status === 'cancelled') sColor = 'bg-rose-500/10 text-rose-500 border-rose-500/20';

                  const meetingDate = m.date ? new Date(m.date) : new Date();

                  return (
                    <Card key={m.id} className="relative overflow-hidden group">
                      {/* Top banner wrapper */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-3 border-b border-slate-100 dark:border-slate-900 mb-3">
                        <div className="space-y-1">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${sColor} uppercase tracking-wider`}>
                            {m.status}
                          </span>
                          <h3 className="font-bold text-slate-850 dark:text-white text-sm pt-1.5 flex items-center">
                            <Video size={13} className="mr-1.5 text-indigo-500 shrink-0" />
                            {m.title}
                          </h3>
                        </div>

                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800/80">
                          <Clock size={11} className="shrink-0" />
                          <span>{meetingDate.toLocaleDateString()} at {meetingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({m.duration} mins)</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                        {m.description || 'No meeting overview description recorded.'}
                      </p>

                      {/* Associated Company */}
                      {linkedLead?.company && (
                        <div className="mt-3.5 flex items-center text-xs">
                          <span className="text-slate-400 mr-2">Lead Client:</span>
                          <Link to={`/leads/${linkedLead.id}`} className="text-[#D4AF37] hover:underline flex items-center font-bold">
                            <Building size={11} className="mr-1 shrink-0" />
                            {linkedLead.company.name}
                          </Link>
                        </div>
                      )}

                      {/* Notes Section */}
                      {m.meetingNotes && (
                        <div className="mt-3.5 p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-150/40 dark:border-slate-850 rounded-xl font-medium leading-relaxed">
                          <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider mb-1 flex items-center">
                            <FileText size={10} className="mr-1.5 shrink-0" />
                            <span>Meeting Notes Summary</span>
                          </p>
                          <p className="text-slate-600 dark:text-slate-350">{m.meetingNotes}</p>
                        </div>
                      )}

                      {/* Notes Edit Form */}
                      {editingNotesId === m.id && (
                        <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-900 pt-3">
                          <label className="text-[9px] text-slate-450 uppercase font-bold tracking-wider">Edit Session Notes</label>
                          <textarea
                            value={customNotesText}
                            onChange={(e) => setCustomNotesText(e.target.value)}
                            placeholder="Enter summary notes from the meeting call..."
                            className="w-full min-h-[60px] p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-lg text-xs resize-none text-slate-800 dark:text-slate-200 focus:ring-0 focus:border-[#D4AF37]"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingNotesId(null)}
                              className="px-2.5 py-1 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 rounded hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <Button onClick={() => handleSaveNotes(m.id)}>
                              Save Notes
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Action Triggers Footer */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-900/60 mt-3.5 flex justify-between items-center text-[10px] font-bold text-slate-450">
                        <div className="flex space-x-3">
                          {m.status === 'scheduled' && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(m.id, 'completed')}
                                className="hover:text-emerald-500 flex items-center shrink-0 cursor-pointer"
                              >
                                <CheckCircle2 size={11} className="mr-1 text-emerald-500" />
                                Mark Complete
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(m.id, 'cancelled')}
                                className="hover:text-rose-500 flex items-center shrink-0 cursor-pointer"
                              >
                                <XCircle size={11} className="mr-1 text-rose-500" />
                                Cancel Slot
                              </button>
                            </>
                          )}
                          {editingNotesId !== m.id && (
                            <button 
                              onClick={() => {
                                setEditingNotesId(m.id);
                                setCustomNotesText(m.meetingNotes || '');
                              }}
                              className="hover:text-[#D4AF37] flex items-center shrink-0 cursor-pointer"
                            >
                              <FileText size={11} className="mr-1 text-[#D4AF37]" />
                              Add Notes
                            </button>
                          )}
                        </div>

                        <button 
                          onClick={() => handleDeleteMeeting(m.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded shrink-0 cursor-pointer"
                          title="Delete Meeting"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>

          </div>

          {/* Right Panel: Add Meeting Creator (Col span 1) */}
          <div className="md:col-span-1 space-y-6">
            <Card title="Schedule Meeting" subtitle="Arrange a new client sync or call">
              {formMsg && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-350 rounded-lg mb-4 flex items-center">
                  <CheckCircle2 size={14} className="mr-2 text-[#D4AF37]" />
                  {formMsg}
                </div>
              )}

              <form onSubmit={handleScheduleMeeting} className="space-y-4">
                <Input
                  label="Meeting Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Discovery Call, Live Demo"
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Meeting Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about the meeting agenda..."
                    className="w-full min-h-[70px] p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 focus:border-[#D4AF37] focus:ring-0 resize-none text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Linked Lead / Client</label>
                  <select
                    value={leadId}
                    onChange={(e) => setLeadId(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-xl p-3 text-xs text-slate-700 dark:text-slate-300 focus:border-[#D4AF37] focus:ring-0 outline-none"
                  >
                    <option value="">Select Company Profile</option>
                    {leads.map(l => (
                      <option key={l.id} value={l.id}>{l.company?.name || 'Unknown'}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Date & Time"
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  leftIcon={<CalendarIcon size={15} />}
                  required
                />

                <Input
                  label="Duration (minutes)"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  leftIcon={<Clock size={15} />}
                />

                <div className="pt-2">
                  <Button type="submit" isLoading={scheduling} className="w-full justify-center">
                    <Plus size={14} className="mr-1.5" />
                    Schedule Meeting
                  </Button>
                </div>
              </form>
            </Card>
          </div>

        </div>
      )}

    </div>
  );
};
export default MeetingsCalendar;
