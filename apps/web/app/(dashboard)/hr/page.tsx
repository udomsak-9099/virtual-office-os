const hrKpis = [
  { label: 'Total Employees', value: '142', change: '+3 this month', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Pending Leave Requests', value: '8', change: '3 urgent', color: 'text-orange-600', bg: 'bg-orange-50' },
  { label: 'Onboarding', value: '4', change: 'Starting this month', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Open Positions', value: '6', change: '2 critical', color: 'text-purple-600', bg: 'bg-purple-50' },
];

const leaveRequests = [
  { employee: 'Ariya T.', type: 'Annual Leave', from: 'Apr 7', to: 'Apr 11', days: 5, status: 'Pending' },
  { employee: 'Pranee W.', type: 'Sick Leave', from: 'Apr 5', to: 'Apr 5', days: 1, status: 'Pending' },
  { employee: 'Wichai K.', type: 'Annual Leave', from: 'Apr 14', to: 'Apr 18', days: 5, status: 'Pending' },
  { employee: 'Somchai R.', type: 'Personal Leave', from: 'Apr 8', to: 'Apr 8', days: 1, status: 'Approved' },
  { employee: 'Kannika S.', type: 'Annual Leave', from: 'Apr 21', to: 'Apr 23', days: 3, status: 'Approved' },
];

const onboarding = [
  { name: 'Thana M.', role: 'Senior Developer', department: 'Engineering', startDate: 'Apr 7', progress: 60 },
  { name: 'Pimchan L.', role: 'UX Designer', department: 'Design', startDate: 'Apr 14', progress: 30 },
  { name: 'Worawit K.', role: 'Sales Executive', department: 'Sales', startDate: 'Apr 14', progress: 20 },
  { name: 'Siriporn D.', role: 'HR Coordinator', department: 'HR', startDate: 'Apr 21', progress: 10 },
];

const departments = [
  { name: 'Engineering', headcount: 38, growth: '+2' },
  { name: 'Sales', headcount: 22, growth: '+1' },
  { name: 'Marketing', headcount: 15, growth: '0' },
  { name: 'Operations', headcount: 20, growth: '0' },
  { name: 'Finance', headcount: 12, growth: '0' },
  { name: 'HR', headcount: 8, growth: '+1' },
  { name: 'Legal', headcount: 6, growth: '0' },
  { name: 'Design', headcount: 10, growth: '+1' },
  { name: 'Admin', headcount: 11, growth: '0' },
];

const statusColor: Record<string, string> = {
  Pending: 'bg-orange-50 text-orange-600',
  Approved: 'bg-green-50 text-green-600',
  Rejected: 'bg-red-50 text-red-600',
};

export default function HRPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
        <p className="text-gray-500 mt-1">Employee management, leave requests, and onboarding.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {hrKpis.map((kpi, i) => (
          <div key={i} className={`${kpi.bg} rounded-xl border border-gray-100 p-5`}>
            <p className="text-sm text-gray-600">{kpi.label}</p>
            <p className={`text-3xl font-bold ${kpi.color} mt-1`}>{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Requests */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Leave Requests</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Employee</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">From</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">To</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Days</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((req, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-800 font-medium">{req.employee}</td>
                  <td className="py-3 px-4 text-gray-600">{req.type}</td>
                  <td className="py-3 px-4 text-gray-400">{req.from}</td>
                  <td className="py-3 px-4 text-gray-400">{req.to}</td>
                  <td className="py-3 px-4 text-gray-600">{req.days}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {req.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                        <button className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Department Headcount */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Headcount</h2>
          <div className="space-y-3">
            {departments.map((dept, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{dept.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800">{dept.headcount}</span>
                  {dept.growth !== '0' && (
                    <span className="text-xs text-green-600 font-medium">{dept.growth}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Onboarding */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Onboarding Status</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {onboarding.map((person, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-sm text-brand-700 font-medium">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{person.name}</p>
                  <p className="text-xs text-gray-400">{person.role}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-2">{person.department} &middot; Starts {person.startDate}</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Onboarding</span>
                <span className="text-xs font-medium text-gray-700">{person.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-brand-500 rounded-full" style={{ width: `${person.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
