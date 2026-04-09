'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/auth';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueAt?: string | null;
  assignee?: { id: string; displayName: string } | null;
  owner?: { id: string; displayName: string } | null;
  project?: { id: string; name: string; code: string } | null;
  department?: { id: string; name: string } | null;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  open: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-purple-50 text-purple-700',
  blocked: 'bg-red-50 text-red-700',
  review: 'bg-yellow-50 text-yellow-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-gray-50 text-gray-400',
};

const priorityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-red-50 text-red-600',
  medium: 'bg-yellow-50 text-yellow-600',
  low: 'bg-gray-50 text-gray-500',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/tasks?page_size=100')
      .then((res: any) => setTasks(res.data || []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tasks.filter((t) => {
    if (filter === 'open' && !['open', 'in_progress', 'blocked', 'review'].includes(t.status)) return false;
    if (filter === 'in_progress' && t.status !== 'in_progress') return false;
    if (filter === 'completed' && t.status !== 'completed') return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">{tasks.length} tasks across Lawi projects</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700">+ Create Task</button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
          {[
            { k: 'all', label: 'All' },
            { k: 'open', label: 'Open' },
            { k: 'in_progress', label: 'In Progress' },
            { k: 'completed', label: 'Done' },
          ].map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === f.k ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 max-w-md px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Task</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Priority</th>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold">Assignee</th>
                <th className="px-4 py-3 font-semibold">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No tasks</td></tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="text-sm font-medium text-gray-900">{t.title}</div>
                      {t.description && <div className="text-xs text-gray-500 line-clamp-1 max-w-lg mt-0.5">{t.description}</div>}
                    </td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[t.status] || 'bg-gray-100'}`}>{t.status}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[t.priority] || 'bg-gray-50'}`}>{t.priority}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-600">{t.project ? <span className="font-mono">{t.project.code}</span> : (t.department?.name || '-')}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{t.assignee?.displayName || '-'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{t.dueAt ? new Date(t.dueAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' }) : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
