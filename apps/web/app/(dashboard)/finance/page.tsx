const budgetCards = [
  { label: 'Total Budget', value: '฿8.5M', used: '฿5.2M', percent: 61, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pending Claims', value: '฿245K', used: '12 claims', percent: 0, color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Payments Due', value: '฿1.8M', used: '8 invoices', percent: 0, color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Cash Flow (MTD)', value: '+฿2.1M', used: 'Net positive', percent: 0, color: 'text-green-600', bg: 'bg-green-50' },
];

const expenseClaims = [
  { id: 'EXP-081', employee: 'Naree P.', description: 'Client Dinner — ABC Corp', amount: '฿8,500', date: 'Apr 3', status: 'Pending' },
  { id: 'EXP-080', employee: 'Sompong K.', description: 'Travel — Chiang Mai Site Visit', amount: '฿15,200', date: 'Apr 2', status: 'Approved' },
  { id: 'EXP-079', employee: 'Ariya T.', description: 'Software License — JetBrains', amount: '฿12,000', date: 'Apr 1', status: 'Pending' },
  { id: 'EXP-078', employee: 'Kittipong S.', description: 'Office Supplies', amount: '฿3,400', date: 'Mar 31', status: 'Paid' },
  { id: 'EXP-077', employee: 'You', description: 'Conference Registration Fee', amount: '฿25,000', date: 'Mar 30', status: 'Approved' },
];

const paymentQueue = [
  { vendor: 'TechSupply Co.', invoice: 'INV-4521', amount: '฿280,000', due: 'Apr 8', status: 'Scheduled' },
  { vendor: 'Cloud Services Ltd', invoice: 'INV-4518', amount: '฿185,000', due: 'Apr 10', status: 'Pending' },
  { vendor: 'Office World', invoice: 'INV-4515', amount: '฿95,000', due: 'Apr 12', status: 'Scheduled' },
  { vendor: 'Legal Associates', invoice: 'INV-4510', amount: '฿120,000', due: 'Apr 15', status: 'Pending' },
];

const departmentBudgets = [
  { dept: 'Engineering', budget: '฿2.5M', spent: '฿1.6M', percent: 64 },
  { dept: 'Marketing', budget: '฿1.8M', spent: '฿1.1M', percent: 61 },
  { dept: 'Operations', budget: '฿1.5M', spent: '฿850K', percent: 57 },
  { dept: 'HR', budget: '฿1.2M', spent: '฿720K', percent: 60 },
  { dept: 'Legal', budget: '฿800K', spent: '฿480K', percent: 60 },
  { dept: 'Admin', budget: '฿700K', spent: '฿440K', percent: 63 },
];

const statusColor: Record<string, string> = {
  Pending: 'bg-orange-50 text-orange-600',
  Approved: 'bg-blue-50 text-blue-600',
  Paid: 'bg-green-50 text-green-600',
  Scheduled: 'bg-purple-50 text-purple-600',
};

export default function FinancePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
        <p className="text-gray-500 mt-1">Expense claims, payments, and budget overview.</p>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {budgetCards.map((card, i) => (
          <div key={i} className={`${card.bg} rounded-xl border border-gray-100 p-5`}>
            <p className="text-sm text-gray-600">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color} mt-1`}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.used}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Claims */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Expense Claims</h2>
            <button className="px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
              + New Claim
            </button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {expenseClaims.map((claim) => (
                <tr key={claim.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-400 font-mono text-xs">{claim.id}</td>
                  <td className="py-3 px-4 text-gray-600">{claim.employee}</td>
                  <td className="py-3 px-4 text-gray-800">{claim.description}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{claim.amount}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[claim.status]}`}>
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Department Budget Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Budgets</h2>
            <div className="space-y-4">
              {departmentBudgets.map((dept, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{dept.dept}</span>
                    <span className="text-xs text-gray-500">{dept.spent} / {dept.budget}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className={`h-2 rounded-full ${dept.percent > 75 ? 'bg-red-400' : dept.percent > 50 ? 'bg-yellow-400' : 'bg-green-400'}`}
                      style={{ width: `${dept.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Queue */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Queue</h2>
            <div className="space-y-3">
              {paymentQueue.map((payment, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{payment.vendor}</p>
                    <p className="text-xs text-gray-400">Due {payment.due}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{payment.amount}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[payment.status]}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
