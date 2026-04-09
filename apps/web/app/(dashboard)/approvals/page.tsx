'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/auth';

interface Approval {
  id: string;
  requestType: string;
  sourceType: string;
  sourceId: string;
  status: string;
  currentStepNo: number;
  submittedAt?: string;
  createdAt: string;
  requester?: { id: string; displayName: string };
  stepsCount?: number;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-50 text-blue-700',
  in_review: 'bg-purple-50 text-purple-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  returned: 'bg-yellow-50 text-yellow-700',
  cancelled: 'bg-gray-50 text-gray-400',
};

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    api.get('/approval-requests')
      .then((res: any) => setApprovals(res.data || []))
      .catch(() => setApprovals([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = approvals.filter((a) => {
    if (tab === 'pending') return ['submitted', 'in_review'].includes(a.status);
    if (tab === 'mine') return true; // TODO: filter by current user
    if (tab === 'completed') return ['approved', 'rejected', 'cancelled'].includes(a.status);
    return true;
  });

  const pendingCount = approvals.filter((a) => ['submitted', 'in_review'].includes(a.status)).length;
  const approvedCount = approvals.filter((a) => a.status === 'approved').length;
  const totalAmount = approvals.length;

  async function handleApprove(id: string) {
    try {
      await api.post(`/approval-requests/${id}/approve`, { comment: 'Approved' });
      const res: any = await api.get('/approval-requests');
      setApprovals(res.data || []);
    } catch (e) { console.error(e); }
  }

  async function handleReject(id: string) {
    try {
      await api.post(`/approval-requests/${id}/reject`, { comment: 'Rejected' });
      const res: any = await api.get('/approval-requests');
      setApprovals(res.data || []);
    } catch (e) { console.error(e); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
        <p className="text-gray-500 mt-1">Investment and approval requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
          <p className="text-sm text-gray-600">Pending My Action</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{approvedCount}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <p className="text-sm text-gray-600">Total Requests</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{totalAmount}</p>
        </div>
      </div>

      <div className="flex bg-white border border-gray-200 rounded-lg p-1 w-fit">
        {[
          { k: 'pending', label: 'Awaiting Action' },
          { k: 'mine', label: 'My Requests' },
          { k: 'completed', label: 'Completed' },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t.k ? 'bg-brand-50 text-brand-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
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
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Requester</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Step</th>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No approvals</td></tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="text-sm font-medium text-gray-900">{a.requestType.replace(/_/g, ' ')}</div>
                      <div className="text-xs text-gray-500">{a.sourceType}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{a.requester?.displayName || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[a.status] || 'bg-gray-100'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">Step {a.currentStepNo}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('th-TH') : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {['submitted', 'in_review'].includes(a.status) && (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleApprove(a.id)} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded hover:bg-green-100">Approve</button>
                          <button onClick={() => handleReject(a.id)} className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded hover:bg-red-100">Reject</button>
                        </div>
                      )}
                    </td>
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
