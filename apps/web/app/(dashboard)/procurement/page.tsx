'use client';

export default function ProcurementPage() {
  const epcVendors = [
    { name: 'Lawi Engineering Malaysia', type: 'EPC / Technology', project: 'WTE Nonthaburi FEED', status: 'Selected' },
    { name: 'KK Green Co., Ltd.', type: 'O&M Partner', project: 'UPT Biomass O&M', status: 'Active' },
    { name: 'Global Green Holding', type: 'Development Partner', project: 'Cross-BU Development', status: 'Active' },
    { name: 'Green Parawood Co., Ltd.', type: 'Biomass Supplier', project: 'UPT Feedstock', status: 'Active' },
  ];

  const feedstockSuppliers = [
    { name: 'Local MSW Municipalities (Nonthaburi)', type: 'Municipal Waste', volume: 'Target 1,000 tons/day', status: 'In Negotiation' },
    { name: 'Wood Biomass Cooperatives (Korat)', type: 'Woodchip', volume: '200-300 tons/day', status: 'Active (UPT)' },
    { name: 'Coconut Shell Suppliers (Ayutthaya)', type: 'Coconut Biomass', volume: '500 kg/hr AC input', status: 'Sourcing' },
    { name: 'PKS Wood Suppliers (Surat Thani)', type: 'Palm Kernel Shell', volume: '1,000 kg/hr AC input', status: 'Sourcing' },
  ];

  const equipment = [
    { item: 'RDF Processing Line (Crushing/Drying/Pelletizing)', project: 'RDF Surat Thani', capacity: '250K tons/yr', status: 'RFQ Issued' },
    { item: 'WTE Combustion & Grate System', project: 'WTE Nonthaburi', capacity: '30 MW', status: 'Vendor Shortlist' },
    { item: 'Flue Gas Treatment System', project: 'WTE Nonthaburi', capacity: '30 MW', status: 'Spec Review' },
    { item: 'Activated Carbon Kiln (Modular)', project: 'AC Ayutthaya', capacity: '100 kg/hr', status: 'Quote Received' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Procurement & Supply Chain</h1>
        <p className="text-gray-500 mt-1">EPC partners, feedstock, and equipment procurement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
          <p className="text-sm text-gray-600">EPC Partners</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{epcVendors.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-100">
          <p className="text-sm text-gray-600">Feedstock Suppliers</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{feedstockSuppliers.length}</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
          <p className="text-sm text-gray-600">Active RFQs</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{equipment.length}</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
          <p className="text-sm text-gray-600">CAPEX Commitment</p>
          <p className="text-xl font-bold text-orange-600 mt-1">4,900 MB</p>
          <p className="text-xs text-gray-500">Total Project Cost</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">EPC & Technology Partners</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Vendor</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Project</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {epcVendors.map((v, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{v.name}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{v.type}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{v.project}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${v.status === 'Active' || v.status === 'Selected' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Feedstock Supply Chain</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Supplier</th>
              <th className="px-4 py-3 font-semibold">Material</th>
              <th className="px-4 py-3 font-semibold">Volume</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {feedstockSuppliers.map((s, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.type}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.volume}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status.includes('Active') ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Equipment RFQs</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold">Equipment</th>
              <th className="px-4 py-3 font-semibold">Project</th>
              <th className="px-4 py-3 font-semibold">Capacity</th>
              <th className="px-4 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {equipment.map((e, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{e.item}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{e.project}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{e.capacity}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-50 text-blue-700">
                    {e.status}
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
