'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/auth';
import Link from 'next/link';

interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: string;
  priority: string;
  startDate?: string;
  endDate?: string;
  owner?: { id: string; displayName: string };
  department?: { id: string; name: string };
  memberCount?: number;
  taskCount?: number;
  documentCount?: number;
}

const statusColors: Record<string, string> = {
  planning: 'bg-blue-50 text-blue-700',
  active: 'bg-green-50 text-green-700',
  on_hold: 'bg-yellow-50 text-yellow-700',
  completed: 'bg-gray-100 text-gray-600',
  archived: 'bg-gray-50 text-gray-500',
};

const priorityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-red-50 text-red-600',
  medium: 'bg-yellow-50 text-yellow-600',
  low: 'bg-gray-50 text-gray-500',
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects')
      .then((res: any) => setProjects(res.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Lawi Investment Pipeline — {projects.length} active projects</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <p>No projects yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-brand-200 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-brand-600 font-semibold">{p.code}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status] || 'bg-gray-100'}`}>
                      {p.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[p.priority] || 'bg-gray-50'}`}>
                      {p.priority}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base leading-snug">{p.name}</h3>
                </div>
              </div>

              {p.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{p.description}</p>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
                {p.department && (
                  <div className="flex items-center gap-1">
                    <span>🏢</span>
                    <span className="truncate max-w-[140px]">{p.department.name}</span>
                  </div>
                )}
                {p.owner && (
                  <div className="flex items-center gap-1">
                    <span>👤</span>
                    <span className="truncate max-w-[120px]">{p.owner.displayName}</span>
                  </div>
                )}
                {typeof p.memberCount === 'number' && (
                  <div className="flex items-center gap-1">
                    <span>👥</span>
                    <span>{p.memberCount}</span>
                  </div>
                )}
                {typeof p.taskCount === 'number' && (
                  <div className="flex items-center gap-1">
                    <span>✓</span>
                    <span>{p.taskCount}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
