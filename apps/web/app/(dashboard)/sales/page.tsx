const pipelineKpis = [
  { label: 'Total Pipeline', value: '฿12.5M', change: '+8%', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Qualified Leads', value: '34', change: '+5', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Won This Month', value: '฿3.2M', change: '+12%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Avg Deal Size', value: '฿420K', change: '-3%', color: 'text-purple-600', bg: 'bg-purple-50' },
];

const pipelineStages = [
  { stage: 'Lead', count: 18, value: '฿2.1M', color: 'bg-gray-400' },
  { stage: 'Qualified', count: 12, value: '฿3.4M', color: 'bg-blue-400' },
  { stage: 'Proposal', count: 8, value: '฿4.2M', color: 'bg-yellow-400' },
  { stage: 'Negotiation', count: 4, value: '฿2.1M', color: 'bg-orange-400' },
  { stage: 'Closed Won', count: 6, value: '฿3.2M', color: 'bg-green-400' },
];

const leads = [
  { company: 'TechVision Corp', contact: 'Somchai R.', stage: 'Proposal', value: '฿850K', probability: '60%', nextAction: 'Send revised proposal', due: 'Apr 6' },
  { company: 'Global Logistics', contact: 'Pranee W.', stage: 'Negotiation', value: '฿1.2M', probability: '75%', nextAction: 'Final pricing review', due: 'Apr 5' },
  { company: 'MedTech Solutions', contact: 'Wichai K.', stage: 'Qualified', value: '฿500K', probability: '40%', nextAction: 'Schedule demo', due: 'Apr 7' },
  { company: 'BankCo International', contact: 'Supaporn L.', stage: 'Proposal', value: '฿2.1M', probability: '55%', nextAction: 'Presentation to board', due: 'Apr 8' },
  { company: 'AutoParts Ltd', contact: 'Pichet M.', stage: 'Lead', value: '฿300K', probability: '20%', nextAction: 'Initial call', due: 'Apr 9' },
  { company: 'CloudNine Services', contact: 'Kannika S.', stage: 'Negotiation', value: '฿680K', probability: '80%', nextAction: 'Contract review', due: 'Apr 5' },
];

const stageColor: Record<string, string> = {
  Lead: 'bg-gray-100 text-gray-600',
  Qualified: 'bg-blue-50 text-blue-600',
  Proposal: 'bg-yellow-50 text-yellow-600',
  Negotiation: 'bg-orange-50 text-orange-600',
  'Closed Won': 'bg-green-50 text-green-600',
};

export default function SalesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
        <p className="text-gray-500 mt-1">Pipeline overview and lead management.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pipelineKpis.map((kpi, i) => (
          <div key={i} className={`${kpi.bg} rounded-xl border border-gray-100 p-5`}>
            <p className="text-sm text-gray-600">{kpi.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <span className={`text-xs font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Funnel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Stages</h2>
        <div className="flex items-end gap-2 h-32">
          {pipelineStages.map((stage, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-700">{stage.value}</span>
              <div
                className={`w-full rounded-t-lg ${stage.color}`}
                style={{ height: `${(stage.count / 18) * 100}%`, minHeight: '20px' }}
              />
              <div className="text-center">
                <p className="text-xs font-medium text-gray-700">{stage.stage}</p>
                <p className="text-xs text-gray-400">{stage.count} deals</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Active Leads</h2>
          <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
            + Add Lead
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-medium text-gray-500">Company</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Contact</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Stage</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Value</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Prob.</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Next Action</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Due</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-gray-800 font-medium">{lead.company}</td>
                <td className="py-3 px-4 text-gray-600">{lead.contact}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${stageColor[lead.stage]}`}>
                    {lead.stage}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700 font-medium">{lead.value}</td>
                <td className="py-3 px-4 text-gray-500">{lead.probability}</td>
                <td className="py-3 px-4 text-gray-600">{lead.nextAction}</td>
                <td className="py-3 px-4 text-gray-400">{lead.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
