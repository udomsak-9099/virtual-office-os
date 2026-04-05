const legalKpis = [
  { label: 'Active Contracts', value: '47', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Expiring (30d)', value: '5', color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Pending Review', value: '8', color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Compliance Alerts', value: '2', color: 'text-red-600', bg: 'bg-red-50' },
];

const contracts = [
  { id: 'CTR-089', name: 'SaaS License — CloudNine', type: 'Vendor', status: 'Active', value: '฿185K/yr', expiry: 'Dec 2026', owner: 'IT Department' },
  { id: 'CTR-087', name: 'Service Agreement — TechSupply', type: 'Vendor', status: 'Active', value: '฿500K', expiry: 'Jun 2026', owner: 'Procurement' },
  { id: 'CTR-085', name: 'NDA — Partner Corp', type: 'NDA', status: 'Active', value: '—', expiry: 'Apr 2027', owner: 'Business Dev' },
  { id: 'CTR-083', name: 'Office Lease — Bangkok HQ', type: 'Lease', status: 'Active', value: '฿1.2M/yr', expiry: 'Mar 2027', owner: 'Admin' },
  { id: 'CTR-081', name: 'Employment — Bulk Hires Q1', type: 'Employment', status: 'Active', value: '—', expiry: '—', owner: 'HR' },
  { id: 'CTR-079', name: 'Consulting — Legal Associates', type: 'Service', status: 'Expiring', value: '฿120K/yr', expiry: 'Apr 2026', owner: 'Legal' },
  { id: 'CTR-077', name: 'Insurance — Group Health', type: 'Insurance', status: 'Expiring', value: '฿800K/yr', expiry: 'May 2026', owner: 'HR' },
];

const complianceAlerts = [
  { title: 'PDPA Annual Compliance Review overdue', severity: 'High', deadline: 'Apr 10', department: 'Legal' },
  { title: 'Anti-Money Laundering training renewal', severity: 'Medium', deadline: 'Apr 15', department: 'Compliance' },
  { title: 'ISO 27001 audit preparation', severity: 'Low', deadline: 'May 1', department: 'IT' },
  { title: 'Fire safety certificate renewal', severity: 'Medium', deadline: 'Apr 30', department: 'Admin' },
];

const typeColor: Record<string, string> = {
  Vendor: 'bg-blue-50 text-blue-600',
  NDA: 'bg-gray-100 text-gray-600',
  Lease: 'bg-purple-50 text-purple-600',
  Employment: 'bg-green-50 text-green-600',
  Service: 'bg-yellow-50 text-yellow-600',
  Insurance: 'bg-orange-50 text-orange-600',
};

const statusColor: Record<string, string> = {
  Active: 'bg-green-50 text-green-600',
  Expiring: 'bg-orange-50 text-orange-600',
  Expired: 'bg-red-50 text-red-600',
};

const severityColor: Record<string, string> = {
  High: 'bg-red-50 text-red-600 border-red-200',
  Medium: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  Low: 'bg-blue-50 text-blue-600 border-blue-200',
};

export default function LegalPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Legal</h1>
        <p className="text-gray-500 mt-1">Contract register, compliance tracking, and legal alerts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {legalKpis.map((kpi, i) => (
          <div key={i} className={`${kpi.bg} rounded-xl border border-gray-100 p-5`}>
            <p className="text-sm text-gray-600">{kpi.label}</p>
            <p className={`text-3xl font-bold ${kpi.color} mt-1`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Register */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Contract Register</h2>
            <button className="px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
              + Add Contract
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Contract</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Expiry</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{c.id}</td>
                  <td className="py-3 px-4">
                    <p className="text-gray-800 font-medium">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.owner}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[c.type]}`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{c.value}</td>
                  <td className="py-3 px-4 text-gray-400">{c.expiry}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compliance Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Alerts</h2>
          <div className="space-y-3">
            {complianceAlerts.map((alert, i) => (
              <div key={i} className={`border rounded-lg p-3 ${severityColor[alert.severity]}`}>
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <span className="text-xs font-bold">{alert.severity}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs opacity-75">Deadline: {alert.deadline}</span>
                  <span className="text-xs opacity-75">&middot;</span>
                  <span className="text-xs opacity-75">{alert.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
