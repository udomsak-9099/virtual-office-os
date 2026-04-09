'use client';

export default function LegalPage() {
  const contracts = [
    { name: 'UPT Biomass — Share Purchase Agreement (SPA)', type: 'M&A', counterparty: 'UPT Seller', value: '800 MB', expiry: 'Closing Q2 2026', status: 'In Negotiation' },
    { name: 'UPT Biomass — PPA (existing)', type: 'Power Purchase', counterparty: 'PEA', value: '308 MB/yr', expiry: 'May 2039', status: 'Active' },
    { name: 'WTE Nonthaburi — 20yr PPA', type: 'Power Purchase', counterparty: 'PEA / GULF (TBC)', value: '637 MB/yr', expiry: '20 years from COD', status: 'Application' },
    { name: 'RDF Surat Thani — GP4 Offtake', type: 'Supply Agreement', counterparty: 'GP4 WTE', value: 'c.150 MB/yr', expiry: 'Long-term', status: 'Term Sheet' },
    { name: 'RDF Nonthaburi — TPCH Offtake', type: 'Supply Agreement', counterparty: 'TPCH (WTE 24MW)', value: 'c.150 MB/yr', expiry: 'Long-term', status: 'Discussion' },
    { name: 'Activated Carbon — GULF/BWG Offtake', type: 'Supply Agreement', counterparty: 'GULF, BWG', value: '70 MB/yr', expiry: 'Long-term', status: 'LOI' },
    { name: 'Thai-Malaysian JV Shareholders Agreement', type: 'Corporate', counterparty: 'Thai (51%) / Malaysian (49%)', value: '2,450 MB equity', expiry: 'Evergreen', status: 'Drafting' },
    { name: 'Green Financing — Sustainability Linked Loan', type: 'Debt', counterparty: 'BBL / KBANK / SCB', value: '2,450 MB', expiry: '15-20 years', status: 'Term Sheet' },
  ];

  const complianceAlerts = [
    { severity: 'high', title: 'EIA Submission — WTE Nonthaburi', dueBy: 'Aug 31, 2026', category: 'Environmental' },
    { severity: 'high', title: 'PPA Application Filing — WTE Nonthaburi', dueBy: 'Jul 1, 2026', category: 'Regulatory' },
    { severity: 'medium', title: 'UPT Operating License Renewal', dueBy: 'Q3 2026', category: 'Operating License' },
    { severity: 'medium', title: 'Thai FDA — Activated Carbon Product Registration', dueBy: 'Q4 2026', category: 'Product Certification' },
    { severity: 'low', title: 'Annual ESG Disclosure (GRI Standards)', dueBy: 'Mar 2027', category: 'Sustainability' },
  ];

  const severityColors: Record<string, string> = {
    high: 'bg-red-50 border-red-200 text-red-700',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    low: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  const statusColors: Record<string, string> = {
    Active: 'bg-green-50 text-green-700',
    'In Negotiation': 'bg-yellow-50 text-yellow-700',
    Application: 'bg-blue-50 text-blue-700',
    'Term Sheet': 'bg-purple-50 text-purple-700',
    Discussion: 'bg-gray-100 text-gray-600',
    LOI: 'bg-blue-50 text-blue-700',
    Drafting: 'bg-orange-50 text-orange-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Legal & Compliance</h1>
        <p className="text-gray-500 mt-1">Lawi contract register, regulatory filings, and compliance tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <p className="text-sm text-gray-600">Total Contracts</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{contracts.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{contracts.filter((c) => c.status === 'Active').length}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
          <p className="text-sm text-gray-600">High-Priority Alerts</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{complianceAlerts.filter((a) => a.severity === 'high').length}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
          <p className="text-sm text-gray-600">Contract Value</p>
          <p className="text-xl font-bold text-purple-600 mt-1">5,250+ MB</p>
          <p className="text-xs text-gray-500">Committed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Contract Register</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Contract</th>
                <th className="px-4 py-3 font-semibold">Counterparty</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contracts.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="text-sm font-medium text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{c.type} · {c.value} · {c.expiry}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{c.counterparty}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[c.status] || 'bg-gray-100'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Alerts</h2>
          <div className="space-y-3">
            {complianceAlerts.map((a, i) => (
              <div key={i} className={`p-3 rounded-lg border ${severityColors[a.severity]}`}>
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-semibold uppercase">{a.severity}</span>
                  <span className="text-xs">{a.category}</span>
                </div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs mt-1 opacity-75">Due: {a.dueBy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
