'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/auth';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  meetingType: string;
  startAt: string;
  endAt: string;
  locationType: string;
  status: string;
  organizer?: { id: string; displayName: string };
  attendeeCount?: number;
  noteCount?: number;
  actionItemCount?: number;
}

const typeColors: Record<string, string> = {
  board: 'bg-purple-50 text-purple-700',
  executive: 'bg-blue-50 text-blue-700',
  project: 'bg-green-50 text-green-700',
  external: 'bg-orange-50 text-orange-700',
  general: 'bg-gray-100 text-gray-600',
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/meetings')
      .then((res: any) => setMeetings(res.data || []))
      .catch(() => setMeetings([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = meetings.filter((m) => new Date(m.startAt) >= now).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  const past = meetings.filter((m) => new Date(m.startAt) < now).sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-500 mt-1">{meetings.length} meetings — Lawi team coordination</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700">+ Schedule Meeting</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Upcoming ({upcoming.length})</h2>
            <div className="space-y-2">
              {upcoming.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">No upcoming meetings</div>
              ) : (
                upcoming.map((m) => (
                  <MeetingCard key={m.id} m={m} />
                ))
              )}
            </div>
          </div>

          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Past ({past.length})</h2>
              <div className="space-y-2">
                {past.slice(0, 5).map((m) => <MeetingCard key={m.id} m={m} past />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MeetingCard({ m, past }: { m: Meeting; past?: boolean }) {
  const start = new Date(m.startAt);
  const end = new Date(m.endAt);
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow ${past ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[m.meetingType] || 'bg-gray-100'}`}>
              {m.meetingType}
            </span>
            <span className="text-xs text-gray-400">{m.locationType}</span>
          </div>
          <h3 className="font-semibold text-gray-900">{m.title}</h3>
          {m.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{m.description}</p>}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{start.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>🕐</span>
              <span>{start.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {m.organizer && (
              <div className="flex items-center gap-1">
                <span>👤</span>
                <span>{m.organizer.displayName}</span>
              </div>
            )}
            {typeof m.attendeeCount === 'number' && (
              <div className="flex items-center gap-1">
                <span>👥</span>
                <span>{m.attendeeCount}</span>
              </div>
            )}
          </div>
        </div>
        {!past && (
          <button className="px-3 py-1.5 bg-brand-50 text-brand-700 text-xs font-medium rounded-lg hover:bg-brand-100">Join</button>
        )}
      </div>
    </div>
  );
}
