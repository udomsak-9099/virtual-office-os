'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  displayName: string;
  userType: string;
  status: string;
  profile?: {
    jobTitle?: string;
    employeeCode?: string;
    workLocation?: string;
    employmentType?: string;
  };
  department?: { id: string; name: string };
}

interface Department {
  id: string;
  name: string;
  code: string;
  _count?: { employeeProfiles: number };
}

export default function HRPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [depts, setDepts] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users').catch(() => ({ data: [] })),
      api.get('/departments').catch(() => ({ data: [] })),
    ]).then(([u, d]: any) => {
      setUsers(u.data || []);
      setDepts(d.data || []);
      setLoading(false);
    });
  }, []);

  const activeUsers = users.filter((u) => u.status === 'active').length;
  const humanUsers = users.filter((u) => u.userType === 'human').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Human Resources</h1>
        <p className="text-gray-500 mt-1">Lawi Energy Holding — Team & Organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPI label="Total Users" value={users.length} color="text-blue-600" bg="bg-blue-50" />
        <KPI label="Active" value={activeUsers} color="text-green-600" bg="bg-green-50" />
        <KPI label="Human Staff" value={humanUsers} color="text-purple-600" bg="bg-purple-50" />
        <KPI label="Departments" value={depts.length} color="text-orange-600" bg="bg-orange-50" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                          {u.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{u.displayName}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-xs">
                      {u.profile?.jobTitle || u.userType}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Departments</h2>
            <div className="space-y-2">
              {depts.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{d.name}</div>
                    <div className="text-xs text-gray-400 font-mono">{d.code}</div>
                  </div>
                  {d._count?.employeeProfiles !== undefined && (
                    <span className="text-xs text-gray-500">{d._count.employeeProfiles}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-xl p-5 border border-gray-100`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
    </div>
  );
}
