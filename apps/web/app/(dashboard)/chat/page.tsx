'use client';

import { useState } from 'react';

const channels = [
  { name: 'general', unread: 3, type: 'channel' },
  { name: 'engineering', unread: 0, type: 'channel' },
  { name: 'product', unread: 1, type: 'channel' },
  { name: 'design', unread: 0, type: 'channel' },
  { name: 'hr-announcements', unread: 2, type: 'channel' },
  { name: 'random', unread: 0, type: 'channel' },
];

const dms = [
  { name: 'Sompong K.', unread: 1, online: true },
  { name: 'Naree P.', unread: 0, online: true },
  { name: 'Ariya T.', unread: 0, online: false },
  { name: 'Kittipong S.', unread: 2, online: true },
];

const mockMessages = [
  { sender: 'Sompong K.', time: '09:15', text: 'Good morning team! The vendor meeting is confirmed for 2 PM today.' },
  { sender: 'Naree P.', time: '09:18', text: 'Great, I\'ll prepare the presentation deck. Can someone share the latest financials?' },
  { sender: 'You', time: '09:20', text: 'I\'ll send the Q1 numbers in a few minutes.' },
  { sender: 'Kittipong S.', time: '09:22', text: 'Also, the procurement approval for the office laptops is pending your review.' },
  { sender: 'Sompong K.', time: '09:25', text: 'Noted. I\'ll take a look before lunch. Anything else for the agenda?' },
  { sender: 'Ariya T.', time: '09:30', text: 'Can we add a quick discussion on the CI pipeline issues? I have some updates.' },
  { sender: 'You', time: '09:32', text: 'Sure, let\'s add that to AOB. See everyone at 2!' },
];

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState('general');

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col">
        {/* Search */}
        <div className="p-3 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Channels */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Channels</h3>
            <div className="space-y-0.5">
              {channels.map((ch) => (
                <button
                  key={ch.name}
                  onClick={() => setActiveChannel(ch.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                    activeChannel === ch.name
                      ? 'bg-brand-50 text-brand-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span># {ch.name}</span>
                  {ch.unread > 0 && (
                    <span className="bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded-full">{ch.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Direct Messages</h3>
            <div className="space-y-0.5">
              {dms.map((dm) => (
                <button
                  key={dm.name}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${dm.online ? 'bg-green-400' : 'bg-gray-300'}`} />
                    <span>{dm.name}</span>
                  </div>
                  {dm.unread > 0 && (
                    <span className="bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded-full">{dm.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900"># {activeChannel}</h2>
            <p className="text-xs text-gray-400">8 members</p>
          </div>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">Pin</button>
            <button className="text-xs px-3 py-1 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">Files</button>
            <button className="text-xs px-3 py-1 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">Members</button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {mockMessages.map((msg, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-medium shrink-0">
                {msg.sender === 'You' ? 'Y' : msg.sender.charAt(0)}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-sm font-medium ${msg.sender === 'You' ? 'text-brand-700' : 'text-gray-800'}`}>
                    {msg.sender}
                  </span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message #${activeChannel}...`}
              className="flex-1 text-sm border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
