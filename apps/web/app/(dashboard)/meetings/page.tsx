const todayMeetings = [
  { title: 'Weekly Standup', time: '09:00 - 09:30', room: 'Virtual — Zoom', attendees: 8, status: 'upcoming' },
  { title: 'Client Review — ABC Corp', time: '10:30 - 11:30', room: 'Meeting Room A', attendees: 4, status: 'upcoming' },
  { title: 'Sprint Planning', time: '13:00 - 14:00', room: 'Virtual — Teams', attendees: 12, status: 'upcoming' },
  { title: 'Budget Review Q2', time: '15:00 - 15:30', room: 'Board Room', attendees: 5, status: 'upcoming' },
  { title: '1:1 with Manager', time: '16:00 - 16:30', room: 'Virtual — Zoom', attendees: 2, status: 'upcoming' },
];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dates = [31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-500 mt-1">Your schedule and upcoming meetings.</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
          + Schedule Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">April 2026</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">Prev</button>
              <button className="px-3 py-1 text-sm bg-brand-600 text-white rounded-lg">Today</button>
              <button className="px-3 py-1 text-sm bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">Next</button>
            </div>
          </div>
          {/* Mini Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {weekDays.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
            ))}
            {dates.map((d, i) => (
              <div
                key={i}
                className={`text-center text-sm py-3 rounded-lg cursor-pointer transition-colors ${
                  d === 5
                    ? 'bg-brand-600 text-white font-semibold'
                    : d < 1
                    ? 'text-gray-300'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {d}
              </div>
            ))}
          </div>
          {/* Time Slots Placeholder */}
          <div className="space-y-2 border-t border-gray-100 pt-4">
            {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map((time) => {
              const meeting = todayMeetings.find((m) => m.time.startsWith(time));
              return (
                <div key={time} className="flex items-center gap-4 py-2">
                  <span className="text-xs text-gray-400 w-12">{time}</span>
                  {meeting ? (
                    <div className="flex-1 bg-brand-50 border border-brand-200 rounded-lg px-3 py-2">
                      <p className="text-sm font-medium text-brand-800">{meeting.title}</p>
                      <p className="text-xs text-brand-500">{meeting.room} &middot; {meeting.attendees} attendees</p>
                    </div>
                  ) : (
                    <div className="flex-1 border border-dashed border-gray-200 rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-300">Available</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Meetings List */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Meetings</h2>
          <div className="space-y-4">
            {todayMeetings.map((meeting, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="w-1 h-12 bg-brand-500 rounded-full mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{meeting.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{meeting.time}</p>
                  <p className="text-xs text-gray-400">{meeting.room}</p>
                </div>
                <span className="text-xs text-gray-400">{meeting.attendees} ppl</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
