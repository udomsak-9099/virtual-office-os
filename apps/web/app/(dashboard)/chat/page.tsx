'use client';

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Chat</h1>
        <p className="text-gray-500 mt-1">Internal communication for Lawi team</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="text-4xl mb-3">💬</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Chat Coming Soon</h2>
        <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
          Real-time messaging, project channels, and thread discussions for the Lawi team. Currently use email and iMessage for coordination.
        </p>
        <div className="text-xs text-gray-400">
          Planned channels: #exec-office · #bu1-renewable · #bu2-rdf · #bu3-activated-carbon · #finance · #legal
        </div>
      </div>
    </div>
  );
}
