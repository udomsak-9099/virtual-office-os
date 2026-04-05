'use client';

import { useEffect, useState } from 'react';
import { api, getUser } from '@/lib/auth';
import Link from 'next/link';

interface DashboardData {
  pendingApprovals: number;
  myTasksCount: number;
  meetingsToday: number;
  tasks: any[];
  meetings: any[];
}

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await api.get('/home');
      setData(res.data);
    } catch {
      // Fallback to individual queries
      try {
        const [tasksRes, approvalsRes] = await Promise.all([
          api.get('/tasks?page_size=5').catch(() => ({ data: [], meta: { total: 0 } })),
          api.get('/approval-requests?approver_scope=mine&status=submitted').catch(() => ({ data: [], meta: { total: 0 } })),
        ]);
        setData({
          pendingApprovals: approvalsRes.meta?.total || approvalsRes.data?.length || 0,
          myTasksCount: tasksRes.meta?.total || tasksRes.data?.length || 0,
          meetingsToday: 0,
          tasks: tasksRes.data || [],
          meetings: [],
        });
      } catch {
        setData({ pendingApprovals: 0, myTasksCount: 0, meetingsToday: 0, tasks: [], meetings: [] });
      }
    } finally {
      setLoading(false);
    }
  }

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}{user?.displayName ? `, ${user.displayName}` : ''}
        </h1>
        <p className="text-gray-500 mt-1">Here is what needs your attention today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <WidgetCard
          title="Pending Approvals"
          count={data?.pendingApprovals || 0}
          color="text-orange-600"
          bg="bg-orange-50"
          href="/approvals"
        />
        <WidgetCard
          title="My Tasks"
          count={data?.myTasksCount || 0}
          color="text-blue-600"
          bg="bg-blue-50"
          href="/tasks"
        />
        <WidgetCard
          title="Meetings Today"
          count={data?.meetingsToday || 0}
          color="text-purple-600"
          bg="bg-purple-50"
          href="/meetings"
        />
        <WidgetCard
          title="AI Workspace"
          count={0}
          color="text-green-600"
          bg="bg-green-50"
          href="/ai"
          label="Open"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
            <Link href="/tasks" className="text-sm text-brand-600 hover:text-brand-700">View all</Link>
          </div>
          {data?.tasks && data.tasks.length > 0 ? (
            <div className="space-y-1">
              {data.tasks.map((task: any) => (
                <Link
                  key={task.id}
                  href={`/tasks?id=${task.id}`}
                  className="flex items-center justify-between py-2.5 px-2 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === 'completed' ? 'bg-green-400' :
                      task.status === 'in_progress' ? 'bg-blue-400' :
                      task.status === 'blocked' ? 'bg-red-400' :
                      'bg-gray-300'
                    }`} />
                    <span className={`text-sm ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      task.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      task.priority === 'high' ? 'bg-red-50 text-red-600' :
                      task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-gray-50 text-gray-500'
                    }`}>
                      {task.priority}
                    </span>
                    {task.dueAt && (
                      <span className="text-xs text-gray-400">
                        {new Date(task.dueAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No tasks yet</p>
              <Link href="/tasks" className="text-sm text-brand-600 hover:text-brand-700 mt-2 inline-block">
                Create your first task
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Meetings</h2>
              <Link href="/meetings" className="text-sm text-brand-600 hover:text-brand-700">View all</Link>
            </div>
            {data?.meetings && data.meetings.length > 0 ? (
              <div className="space-y-3">
                {data.meetings.map((meeting: any, i: number) => (
                  <div key={meeting.id || i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-1 h-10 bg-brand-500 rounded-full mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">{meeting.title}</p>
                      <p className="text-xs text-gray-400">
                        {meeting.startAt ? new Date(meeting.startAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">No meetings today</p>
            )}
          </div>

          <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-xl border border-brand-100 p-6">
            <h2 className="text-sm font-semibold text-brand-800 mb-2">Quick Actions</h2>
            <div className="space-y-2">
              <Link href="/tasks" className="block text-xs text-brand-600 hover:text-brand-700 py-1">
                + Create Task
              </Link>
              <Link href="/meetings" className="block text-xs text-brand-600 hover:text-brand-700 py-1">
                + Schedule Meeting
              </Link>
              <Link href="/documents" className="block text-xs text-brand-600 hover:text-brand-700 py-1">
                + Upload Document
              </Link>
              <Link href="/approvals" className="block text-xs text-brand-600 hover:text-brand-700 py-1">
                + Submit Request
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WidgetCard({ title, count, color, bg, href, label }: {
  title: string; count: number; color: string; bg: string; href: string; label?: string;
}) {
  return (
    <Link href={href} className={`${bg} rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow block`}>
      <p className="text-sm text-gray-600">{title}</p>
      {label ? (
        <p className={`text-lg font-semibold ${color} mt-1`}>{label}</p>
      ) : (
        <p className={`text-3xl font-bold ${color} mt-1`}>{count}</p>
      )}
    </Link>
  );
}
