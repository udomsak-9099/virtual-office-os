'use client';

import { useState } from 'react';

const mockTasks = [
  { id: 1, title: 'Review proposal for ABC client', status: 'In Progress', priority: 'High', assignee: 'Sompong K.', due: 'Apr 5' },
  { id: 2, title: 'Prepare Q1 board pack', status: 'To Do', priority: 'Medium', assignee: 'Naree P.', due: 'Apr 6' },
  { id: 3, title: 'Approve vendor shortlist for IT equipment', status: 'In Progress', priority: 'High', assignee: 'You', due: 'Apr 5' },
  { id: 4, title: 'Update SOP for procurement flow', status: 'To Do', priority: 'Low', assignee: 'Ariya T.', due: 'Apr 8' },
  { id: 5, title: 'Submit monthly compliance report', status: 'Done', priority: 'Medium', assignee: 'You', due: 'Apr 3' },
  { id: 6, title: 'Negotiate contract terms with vendor D', status: 'In Progress', priority: 'High', assignee: 'Kittipong S.', due: 'Apr 7' },
  { id: 7, title: 'Onboard new hire — engineering team', status: 'To Do', priority: 'Medium', assignee: 'Naree P.', due: 'Apr 10' },
  { id: 8, title: 'Fix CI pipeline for staging env', status: 'Done', priority: 'Low', assignee: 'Ariya T.', due: 'Apr 2' },
];

const statusColor: Record<string, string> = {
  'To Do': 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-50 text-blue-600',
  Done: 'bg-green-50 text-green-600',
};

const priorityColor: Record<string, string> = {
  High: 'bg-red-50 text-red-600',
  Medium: 'bg-yellow-50 text-yellow-600',
  Low: 'bg-gray-50 text-gray-500',
};

export default function TasksPage() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? mockTasks : mockTasks.filter((t) => t.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and track all your tasks in one place.</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
          + Create Task
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
        {['All', 'To Do', 'In Progress', 'Done'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
              filter === f ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto">
          <input
            type="text"
            placeholder="Search tasks..."
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-medium text-gray-500">Task</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Priority</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Assignee</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((task) => (
              <tr key={task.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-gray-800 font-medium">{task.title}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[task.status]}`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">{task.assignee}</td>
                <td className="py-3 px-4 text-gray-400">{task.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
