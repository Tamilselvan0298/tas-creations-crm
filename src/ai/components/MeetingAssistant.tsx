import React, { useState } from 'react';
import type { MeetingSummaryReport } from '../../shared/services/aiRepository';
import { Card } from '../../shared/components/Card';
import { Button } from '../../shared/components/Button';
import { ClipboardList, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface MeetingAssistantProps {
  report: MeetingSummaryReport | null;
  loading: boolean;
  onSummarize: (transcript: string) => Promise<void>;
}

export const MeetingAssistant: React.FC<MeetingAssistantProps> = ({
  report,
  loading,
  onSummarize,
}) => {
  const [transcript, setTranscript] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    onSummarize(transcript);
  };

  const handleInsertSample = () => {
    setTranscript(
      `Prospect: "We really want to speed up our homepage Acme.com because we lose 30% traffic. Also, we want to index on Google Maps for local queries."\n` +
      `Agent: "Got it. We can overhaul your core speed score to >90 and set up maps citations by next month."\n` +
      `Prospect: "Great. Can you send over a proposal contract and we can begin next week?"`
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Input Transcripts paste box */}
      <Card title="Meeting Transcript Notes" subtitle="Paste transcript to extract summaries.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Audio Transcript</label>
            <button
              type="button"
              onClick={handleInsertSample}
              className="text-[9px] text-[#D4AF37] hover:underline font-bold cursor-pointer"
            >
              Insert Sample Sync
            </button>
          </div>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste raw conversation transcript here..."
            className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl h-36 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-slate-700 dark:text-slate-250"
            required
          />
          <Button type="submit" size="sm" className="w-full flex items-center justify-center space-x-1.5" isLoading={loading}>
            <ClipboardList size={12} />
            <span>Summarize Meeting</span>
          </Button>
        </form>
      </Card>

      {/* Output results checklist cards */}
      <div className="md:col-span-2 space-y-6">
        {report ? (
          <Card title="Meeting Summary & Actions Items" subtitle="AI actions items extracted from sync.">
            <div className="space-y-4 mt-4 text-xs">
              
              {/* Brief Executive outline */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block mb-1">Executive Summary</span>
                <p className="font-semibold text-slate-650 dark:text-slate-200 leading-normal">{report.summary}</p>
              </div>

              {/* Action checklist */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-450 dark:text-slate-400 font-black uppercase tracking-wider block flex items-center">
                  <CheckCircle2 size={11} className="mr-1 text-emerald-500" />
                  Extracted Action Checklist
                </span>
                <div className="space-y-1.5 pl-1">
                  {report.actionItems.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <input type="checkbox" defaultChecked={false} className="mt-0.5 cursor-pointer h-3.5 w-3.5" />
                      <span className="text-slate-600 dark:text-slate-300 font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow ups */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-wider block flex items-center">
                  <FileText size={10} className="mr-1" />
                  Scheduled Follow-up Syncs
                </span>
                <ul className="list-disc pl-4 text-[10px] text-slate-400 font-bold space-y-1">
                  {report.followUps.map((fl, idx) => <li key={idx}>{fl}</li>)}
                </ul>
              </div>

            </div>
          </Card>
        ) : (
          <Card className="h-full flex flex-col items-center justify-center text-center p-12">
            <ShieldAlert size={32} className="text-slate-300 dark:text-slate-700 mb-2" />
            <span className="text-xs text-slate-450 dark:text-slate-500 font-semibold">Paste conversation transcript logs and click "Summarize Meeting" to view checklist metrics.</span>
          </Card>
        )}
      </div>

    </div>
  );
};
export default MeetingAssistant;
