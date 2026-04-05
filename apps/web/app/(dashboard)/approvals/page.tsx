'use client';

import { useState } from 'react';

const tabs = ['Awaiting My Action', 'My Requests', 'Completed'] as const;
type Tab = (typeof tabs)[number];

const approvals: Record<Tab, Array<{ id: string; title: string; type: string; requester: string; date: string; amount?: string; status: string }>> = {
  'Awaiting My Action': [
    { id: 'APR-041', title: 'Purchase Request — Office Laptops (x10)', type: 'Procurement', requester: 'Kittipong S.', date: 'Apr 4', amount: '฿350,000', status: 'Pending' },
    { id: 'APR-039', title: 'Expense Claim — Client Dinner', type: 'Finance', requester: 'Naree P.', date: 'Apr 3', amount: '฿8,500', status: 'Pending' },
    { id: 'APR-038', title: 'Leave Request — Annual Leave 5 days', type: 'HR', requester: 'Ariya T.', date: 'Apr 3', status: 'Pending' },
    { id: 'APR-036', title: 'Contract Amendment — Vendor B', type: 'Legal', requester: 'Sompong K.', date: 'Apr 2', status: 'Pending' },
    { id: 'APR-035', title: 'Budget Reallocation — Marketing Q2', type: 'Finance', requester: 'Naree P.', date: 'Apr 1', amount: '฿120,000', status: 'Pending' },
    { id: 'APR-033', title: 'New Hire Approval — Senior Developer', type: 'HR', requester: 'Kittipong S.', date: 'Mar 31', status: 'Pending' },
  ],
  'My Requests': [
    { id: 'APR-040', title: 'Travel Request — Bangkok Conference', type: 'Finance', requester: 'You', date: 'Apr 4', amount: '฿25,000', status: 'In Review' },
    { id: 'APR-034', title: 'Software License — Figma Enterprise', type: 'Procurement', requester: 'You', date: 'Apr 1', amount: '฿180,000', status: 'In Review' },
  ],
  Completed: [
    { id: 'APR-032', title: 'Purchase Request — Standing Desks', type: 'Procurement', requester: 'Ariya T.', date: 'Mar 30', amount: '฿95,000', status: 'Approved' },
    { id: 'APR-030', title: 'Expense Claim — Team Building', type: 'Finance', requester: 'Naree P.', date: 'Mar 28', amount: '฿15,000', status: 'Approved' },
    { id: 'APR-028', title: 'Contract Renewal — Cloud Provider', type: 'Legal', requester: 'Sompong K.', date: 'Mar 25', amount: '฿500,000', status: 'Rejected' },
  ],
};

const statusColor: Record<string, string> = {
  Pending: 'bg-orange-50 text-orange-600',
  'In Review': 'bg-blue-50 text-blue-600',
  Approved: 'bg-green-50 text-green-600',
  Rejected: 'bg-red-50 text-red-600',
};

const typeColor: Record<string, string> = {
  Procurement: 'bg-purple-50 text-purple-600',
  Finance: 'bg-emerald-50 text-emerald-600',
  HR: 'bg-blue-50 text-blue-600',
  Legal: 'bg-gray-100 text-gray-600',
};

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Awaiting My Action');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
        <p className="text-gray-500 mt-1">Review and manage approval requests across departments.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 rounded-xl border border-orange-100 p-5">
          <p className="text-sm text-gray-600">Awaiting My Action</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{approvals['Awaiting My Action'].length}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
          <p className="text-sm text-gray-600">My Requests</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{approvals['My Requests'].length}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-5">
          <p className="text-sm text-gray-600">Completed This Month</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{approvals.Completed.length}</p>
        </div>
      </div>

      {/* Tabs & Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-brand-600 text-brand-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                {approvals[tab].length}
              </span>
            </button>
          ))}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Request</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Requester</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              {activeTab === 'Awaiting My Action' && (
                <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {approvals[activeTab].map((item) => (
              <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-gray-400 font-mono text-xs">{item.id}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{item.title}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[item.type]}`}>
                    {item.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{item.requester}</td>
                <td className="py-3 px-4 text-gray-600">{item.amount || '—'}</td>
                <td className="py-3 px-4 text-gray-400">{item.date}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[item.status]}`}>
                    {item.status}
                  </span>
                </td>
                {activeTab === 'Awaiting My Action' && (
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                      <button className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300">Reject</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
