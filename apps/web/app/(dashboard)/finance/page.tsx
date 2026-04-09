'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/auth';

export default function FinancePage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboards/finance').catch(() => ({ data: null })),
      api.get('/projects').catch(() => ({ data: [] })),
    ]).then(([d, p]: any) => {
      setDashboard(d.data);
      setProjects(p.data || []);
      setLoading(false);
    });
  }, []);

  // Lawi Investment Data from PDF
  const investmentSummary = {
    totalProjectCost: 4900,
    equity: 2450,
    debt: 2450,
    pirrLow: 10.5,
    pirrHigh: 12.0,
    eirrLow: 14.5,
    eirrHigh: 16.0,
  };

  // Per-BU breakdown from PDF
  const buBreakdown = [
    { code: 'BU1-UPT-ACQ', name: 'UPT Biomass Acquisition', cost: 800, equity: 400, ebitda: 144, revenue: 308, status: 'Operating' },
    { code: 'BU1-WTE-NON', name: 'WTE Nonthaburi (Greenfield)', cost: 3500, equity: 1750, ebitda: 480, revenue: 637, status: 'Planning' },
    { code: 'BU2-RDF-NON', name: 'RDF Plant Nonthaburi', cost: 500, equity: 250, ebitda: 64, revenue: 300, status: 'Planning' },
    { code: 'BU3-AC-AYU', name: 'Activated Carbon Ayutthaya', cost: 100, equity: 50, ebitda: 25, revenue: 70, status: 'Planning' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finance & Investment</h1>
        <p className="text-gray-500 mt-1">Lawi Project Portfolio — Investment metrics and capital deployment</p>
      </div>

      {/* Investment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <p className="text-sm text-gray-600">Total Project Cost</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{investmentSummary.totalProjectCost.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">MB (Million Baht)</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
          <p className="text-sm text-gray-600">Equity (50%)</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{investmentSummary.equity.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">MB</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
          <p className="text-sm text-gray-600">Debt (50%)</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{investmentSummary.debt.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">MB</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <p className="text-sm text-gray-600">Expected Returns</p>
          <p className="text-lg font-bold text-green-700 mt-1">PIRR {investmentSummary.pirrLow}-{investmentSummary.pirrHigh}%</p>
          <p className="text-sm text-green-600">EIRR {investmentSummary.eirrLow}-{investmentSummary.eirrHigh}%</p>
        </div>
      </div>

      {/* Project Investment Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Project Investment Breakdown</h2>
          <p className="text-xs text-gray-500 mt-1">All figures in Million Baht (MB)</p>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Project</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Project Cost</th>
              <th className="px-4 py-3 font-semibold text-right">Equity</th>
              <th className="px-4 py-3 font-semibold text-right">Revenue</th>
              <th className="px-4 py-3 font-semibold text-right">EBITDA</th>
              <th className="px-4 py-3 font-semibold text-right">Margin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {buBreakdown.map((b) => (
              <tr key={b.code} className="hover:bg-gray-50">
                <td className="px-6 py-3">
                  <div className="text-sm font-medium text-gray-900">{b.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{b.code}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.status === 'Operating' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 font-mono">{b.cost.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 font-mono">{b.equity.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 font-mono">{b.revenue.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700 font-mono font-semibold">{b.ebitda.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm text-green-700 font-semibold">{((b.ebitda / b.revenue) * 100).toFixed(1)}%</td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-bold">
              <td colSpan={2} className="px-6 py-3 text-sm text-gray-900">Total Portfolio</td>
              <td className="px-4 py-3 text-right text-sm font-mono">{buBreakdown.reduce((s, b) => s + b.cost, 0).toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">{buBreakdown.reduce((s, b) => s + b.equity, 0).toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-sm font-mono">{buBreakdown.reduce((s, b) => s + b.revenue, 0).toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-sm font-mono text-green-700">{buBreakdown.reduce((s, b) => s + b.ebitda, 0).toLocaleString()}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Approval Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Finance Dashboard</h2>
          {dashboard ? (
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Pending Expense Approvals</span>
                <span className="font-semibold text-gray-900">{dashboard.pendingExpenseApprovals || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Documents Under Review</span>
                <span className="font-semibold text-gray-900">{dashboard.totalDocumentsUnderReview || 0}</span>
              </div>
              {dashboard.approvalsByStatus?.map((a: any) => (
                <div key={a.status} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600 capitalize">{a.status.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-gray-900">{a.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400">Loading...</div>
          )}
        </div>

        <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-xl border border-brand-100 p-6">
          <h2 className="text-sm font-semibold text-brand-800 mb-2">Capital Structure</h2>
          <p className="text-xs text-brand-700 leading-relaxed mb-3">
            Thai (51%) / Malaysian (49%) joint venture. 50/50 debt-to-equity split.
            Payback period 7-10 years across diversified BU portfolio.
          </p>
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-gray-700">Thai Shareholders — 51%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-xs text-gray-700">Malaysian Shareholders — 49%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
