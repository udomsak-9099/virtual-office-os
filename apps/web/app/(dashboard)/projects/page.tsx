const mockProjects = [
  { name: 'Website Redesign', status: 'Active', progress: 72, members: 5, color: 'bg-blue-500' },
  { name: 'ERP Migration Phase 2', status: 'Active', progress: 45, members: 8, color: 'bg-purple-500' },
  { name: 'Mobile App MVP', status: 'Active', progress: 30, members: 4, color: 'bg-green-500' },
  { name: 'Compliance Audit 2026', status: 'Planning', progress: 10, members: 3, color: 'bg-orange-500' },
  { name: 'Vendor Portal Integration', status: 'On Hold', progress: 60, members: 6, color: 'bg-yellow-500' },
  { name: 'Data Warehouse v3', status: 'Active', progress: 88, members: 7, color: 'bg-indigo-500' },
];

const statusBadge: Record<string, string> = {
  Active: 'bg-green-50 text-green-600',
  Planning: 'bg-blue-50 text-blue-600',
  'On Hold': 'bg-yellow-50 text-yellow-600',
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Track all active projects and their progress.</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
          + New Project
        </button>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProjects.map((project, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${project.color}`} />
                <h3 className="text-sm font-semibold text-gray-900">{project.name}</h3>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[project.status]}`}>
                {project.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-gray-700">{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className={`h-2 rounded-full ${project.color}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Members */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(project.members, 4) }).map((_, j) => (
                  <div
                    key={j}
                    className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-500 font-medium"
                  >
                    {String.fromCharCode(65 + j)}
                  </div>
                ))}
                {project.members > 4 && (
                  <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] text-gray-500 font-medium">
                    +{project.members - 4}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-400">{project.members} members</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
