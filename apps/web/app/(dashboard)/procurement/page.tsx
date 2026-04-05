const summaryCards = [
  { label: 'Open PRs', value: 14, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pending POs', value: 8, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Awaiting Delivery', value: 5, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Completed This Month', value: 22, color: 'text-green-600', bg: 'bg-green-50' },
];

const purchaseRequests = [
  { id: 'PR-2026-041', title: 'Office Laptops (x10)', requester: 'IT Department', date: 'Apr 4', amount: '฿350,000', status: 'Pending Approval' },
  { id: 'PR-2026-040', title: 'Standing Desks (x15)', requester: 'Facilities', date: 'Apr 3', amount: '฿95,000', status: 'Approved' },
  { id: 'PR-2026-039', title: 'Server Rack Equipment', requester: 'IT Department', date: 'Apr 2', amount: '฿280,000', status: 'PO Issued' },
  { id: 'PR-2026-038', title: 'Office Supplies — Q2', requester: 'Admin', date: 'Apr 1', amount: '฿45,000', status: 'Pending Approval' },
  { id: 'PR-2026-037', title: 'Marketing Collateral Print', requester: 'Marketing', date: 'Mar 31', amount: '฿62,000', status: 'Approved' },
  { id: 'PR-2026-036', title: 'Safety Equipment', requester: 'Operations', date: 'Mar 30', amount: '฿38,000', status: 'Delivered' },
];

const purchaseOrders = [
  { id: 'PO-2026-018', vendor: 'TechSupply Co.', pr: 'PR-2026-039', amount: '฿280,000', issued: 'Apr 3', delivery: 'Apr 12', status: 'In Transit' },
  { id: 'PO-2026-017', vendor: 'Office World', pr: 'PR-2026-040', amount: '฿95,000', issued: 'Apr 2', delivery: 'Apr 10', status: 'Confirmed' },
  { id: 'PO-2026-016', vendor: 'PrintMaster', pr: 'PR-2026-037', amount: '฿62,000', issued: 'Mar 31', delivery: 'Apr 8', status: 'In Transit' },
];

const statusColor: Record<string, string> = {
  'Pending Approval': 'bg-orange-50 text-orange-600',
  Approved: 'bg-blue-50 text-blue-600',
  'PO Issued': 'bg-purple-50 text-purple-600',
  Delivered: 'bg-green-50 text-green-600',
  'In Transit': 'bg-yellow-50 text-yellow-600',
  Confirmed: 'bg-blue-50 text-blue-600',
};

export default function ProcurementPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procurement</h1>
          <p className="text-gray-500 mt-1">Purchase requests, orders, and delivery tracking.</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
          + New Purchase Request
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <div key={i} className={`${card.bg} rounded-xl border border-gray-100 p-5`}>
            <p className="text-sm text-gray-600">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color} mt-1`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Purchase Requests */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Purchase Requests</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-medium text-gray-500">PR #</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Item</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Requester</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchaseRequests.map((pr) => (
              <tr key={pr.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-gray-400 font-mono text-xs">{pr.id}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{pr.title}</td>
                <td className="py-3 px-4 text-gray-600">{pr.requester}</td>
                <td className="py-3 px-4 text-gray-400">{pr.date}</td>
                <td className="py-3 px-4 text-gray-700 font-medium">{pr.amount}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[pr.status]}`}>
                    {pr.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Purchase Orders */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Purchase Orders</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-medium text-gray-500">PO #</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Vendor</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">PR Ref</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Issued</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Est. Delivery</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((po) => (
              <tr key={po.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-gray-400 font-mono text-xs">{po.id}</td>
                <td className="py-3 px-4 text-gray-800 font-medium">{po.vendor}</td>
                <td className="py-3 px-4 text-gray-400 font-mono text-xs">{po.pr}</td>
                <td className="py-3 px-4 text-gray-700 font-medium">{po.amount}</td>
                <td className="py-3 px-4 text-gray-400">{po.issued}</td>
                <td className="py-3 px-4 text-gray-400">{po.delivery}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[po.status]}`}>
                    {po.status}
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
