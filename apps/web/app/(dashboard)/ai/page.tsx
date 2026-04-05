'use client';

import { useState } from 'react';

const recentRequests = [
  { id: 'AI-042', query: 'Summarize the Q1 financial report', status: 'Completed', time: '2 min ago', type: 'Summary' },
  { id: 'AI-041', query: 'Draft email response to vendor pricing inquiry', status: 'Completed', time: '15 min ago', type: 'Draft' },
  { id: 'AI-040', query: 'Review procurement policy for compliance gaps', status: 'In Progress', time: '30 min ago', type: 'Review' },
  { id: 'AI-039', query: 'Generate meeting notes from standup transcript', status: 'Completed', time: '1 hr ago', type: 'Summary' },
  { id: 'AI-038', query: 'Analyze expense claim patterns for anomalies', status: 'Completed', time: '2 hr ago', type: 'Analysis' },
];

const reviewQueue = [
  { id: 'REV-015', title: 'Contract renewal terms — auto-generated summary', source: 'Legal AI', confidence: '92%', status: 'Needs Review' },
  { id: 'REV-014', title: 'Employee onboarding checklist — AI suggested updates', source: 'HR AI', confidence: '87%', status: 'Needs Review' },
  { id: 'REV-013', title: 'Sales forecast model — Q2 predictions', source: 'Sales AI', confidence: '78%', status: 'Approved' },
  { id: 'REV-012', title: 'Procurement vendor rating update', source: 'Procurement AI', confidence: '95%', status: 'Approved' },
];

const quickActions = [
  { label: 'Summarize Document', description: 'Upload or paste a document for AI summary' },
  { label: 'Draft Communication', description: 'Email, memo, or message draft assistance' },
  { label: 'Analyze Data', description: 'Upload spreadsheet or report for insights' },
  { label: 'Review Contract', description: 'AI-powered contract clause review' },
  { label: 'Generate Report', description: 'Create reports from your data' },
  { label: 'Translate', description: 'Translate documents between languages' },
];

const statusColor: Record<string, string> = {
  Completed: 'bg-green-50 text-green-600',
  'In Progress': 'bg-blue-50 text-blue-600',
  'Needs Review': 'bg-orange-50 text-orange-600',
  Approved: 'bg-green-50 text-green-600',
};

export default function AIPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Workspace</h1>
        <p className="text-gray-500 mt-1">Your AI assistant for documents, analysis, and automation.</p>
      </div>

      {/* Ask AI Input */}
      <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-xl border border-brand-200 p-6">
        <h2 className="text-lg font-semibold text-brand-800 mb-3">Ask AI</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything — summarize, draft, analyze, review..."
            className="flex-1 text-sm border border-brand-200 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button className="px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors whitespace-nowrap">
            Ask AI
          </button>
        </div>
        <p className="text-xs text-brand-500 mt-2">
          Try: &quot;Summarize my pending approvals&quot; or &quot;Draft a reply to the vendor email&quot;
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickActions.map((action, i) => (
          <button
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:shadow-md hover:border-brand-200 transition-all"
          >
            <p className="text-sm font-medium text-gray-800">{action.label}</p>
            <p className="text-xs text-gray-400 mt-1">{action.description}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentRequests.map((req) => (
              <div key={req.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{req.query}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{req.time}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{req.type}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[req.status]}`}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Review Queue */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Review Queue</h2>
            <p className="text-xs text-gray-400 mt-0.5">AI-generated content requiring human review</p>
          </div>
          <div className="divide-y divide-gray-100">
            {reviewQueue.map((item) => (
              <div key={item.id} className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 font-medium">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">{item.source}</span>
                      <span className="text-xs text-gray-400">&middot;</span>
                      <span className="text-xs text-gray-400">Confidence: {item.confidence}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor[item.status]}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
