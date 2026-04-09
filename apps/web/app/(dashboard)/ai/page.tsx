'use client';

import { useState } from 'react';
import { api } from '@/lib/auth';

export default function AIPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const quickActions = [
    { title: 'Summarize UPT DD Report', icon: '📊', prompt: 'Summarize the UPT Biomass Power Plant due diligence findings' },
    { title: 'Analyze WTE Nonthaburi Risks', icon: '⚠️', prompt: 'What are the top 5 risks for WTE Nonthaburi development project?' },
    { title: 'Review Investment Opportunity', icon: '📄', prompt: 'Summarize key points from Project Lawi Investment Opportunity Rev3' },
    { title: 'Compare PIRR vs EIRR', icon: '📈', prompt: 'Compare PIRR and EIRR across all 4 business units' },
    { title: 'Draft PPA Application', icon: '✍️', prompt: 'Draft a PPA application letter for WTE Nonthaburi 24 MW to PEA' },
    { title: 'ESG Impact Calculation', icon: '🌱', prompt: 'Calculate estimated CO2 reduction from full Lawi portfolio' },
  ];

  async function handleAsk(p?: string) {
    const q = p || prompt;
    if (!q) return;
    setPrompt(q);
    setLoading(true);
    setResponse(null);
    try {
      const res: any = await api.post('/ai/ask', { task_type: 'knowledge_search', prompt: q });
      setResponse(res.data);
    } catch (e: any) {
      setResponse({ error: e.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Workspace</h1>
        <p className="text-gray-500 mt-1">AI assistant for Lawi investment analysis, documents, and decision support</p>
      </div>

      <div className="bg-gradient-to-br from-brand-50 via-blue-50 to-purple-50 rounded-xl border border-brand-100 p-6">
        <h2 className="text-lg font-semibold text-brand-900 mb-3">Ask AI about Project Lawi</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="e.g. What is the expected EBITDA for the WTE Nonthaburi project?"
            className="flex-1 px-4 py-3 bg-white border border-brand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !prompt}
            className="px-6 py-3 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>

        {response && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-brand-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">AI Response</h3>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <button
              key={a.title}
              onClick={() => handleAsk(a.prompt)}
              className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-brand-300 hover:shadow-md transition-all"
            >
              <div className="text-2xl mb-2">{a.icon}</div>
              <p className="text-sm font-medium text-gray-900">{a.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.prompt}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">AI Knowledge Base</h2>
        <p className="text-sm text-gray-600 mb-4">AI has access to the following Lawi context:</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Project Lawi Investment Opportunity (Rev 3)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            UPT Biomass DD documents
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            WTE Nonthaburi project specs
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            PDP 2024 and national energy policy
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Team profiles, tasks, meetings, contracts
          </li>
        </ul>
      </div>
    </div>
  );
}
