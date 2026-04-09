'use client';

export default function SalesPage() {
  const revenueMix = [
    { name: 'WTE Development', value: 637, percent: 49, color: 'bg-blue-500' },
    { name: 'Biomass Acquisition', value: 307, percent: 23, color: 'bg-green-500' },
    { name: 'RDF Machinery', value: 297, percent: 23, color: 'bg-purple-500' },
    { name: 'Activated Carbon', value: 70, percent: 5, color: 'bg-orange-500' },
  ];

  const offtakers = [
    { name: 'PEA — Provincial Electricity Authority', type: 'PPA Off-taker', project: 'UPT Biomass (PPA to 2039)', status: 'Active' },
    { name: 'GULF Energy Development', type: 'AC Off-taker', project: 'Activated Carbon Ayutthaya', status: 'LOI Signed' },
    { name: 'BWG (Better World Green)', type: 'AC Off-taker', project: 'Activated Carbon Ayutthaya', status: 'In Negotiation' },
    { name: 'GP4 WTE Plant', type: 'RDF Off-taker', project: 'RDF Surat Thani', status: 'In Development' },
    { name: 'TPCH — T.P.C. Power Holding', type: 'RDF Off-taker', project: 'RDF Nonthaburi (24MW)', status: 'In Development' },
  ];

  const investors = [
    { name: 'Thai Investors Group', stake: '51%', type: 'Strategic', status: 'Committed' },
    { name: 'Malaysian Investors Group', stake: '49%', type: 'Strategic', status: 'Committed' },
    { name: 'Green Financing Banks (BBL/KBANK/SCB)', stake: 'Debt 2,450 MB', type: 'Debt Provider', status: 'In Discussion' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Commercial & Off-take</h1>
        <p className="text-gray-500 mt-1">Lawi revenue pipeline — off-takers and commercial partnerships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <p className="text-sm text-gray-600">Target Annual Revenue</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">1,312</p>
          <p className="text-xs text-gray-500 mt-1">MB at full run-rate</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <p className="text-sm text-gray-600">Target EBITDA</p>
          <p className="text-3xl font-bold text-green-600 mt-1">723</p>
          <p className="text-xs text-gray-500 mt-1">MB (55% margin)</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
          <p className="text-sm text-gray-600">Active Off-takers</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{offtakers.length}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
          <p className="text-sm text-gray-600">Contract Avg Tenor</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">15+</p>
          <p className="text-xs text-gray-500 mt-1">years</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Mix by Business Unit</h2>
        <div className="space-y-3">
          {revenueMix.map((r) => (
            <div key={r.name}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-700">{r.name}</span>
                <span className="text-sm text-gray-900 font-semibold">{r.value} MB <span className="text-gray-400">({r.percent}%)</span></span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`${r.color} h-2 rounded-full`} style={{ width: `${r.percent}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Off-taker Pipeline</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Counterparty</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Project</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {offtakers.map((o, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{o.name}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{o.type}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{o.project}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    o.status === 'Active' ? 'bg-green-50 text-green-700' :
                    o.status.includes('Signed') ? 'bg-blue-50 text-blue-700' :
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Investor & Financing Pipeline</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Investor</th>
              <th className="px-4 py-3 font-semibold">Stake / Amount</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {investors.map((inv, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{inv.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700 font-mono">{inv.stake}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{inv.type}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${inv.status === 'Committed' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
