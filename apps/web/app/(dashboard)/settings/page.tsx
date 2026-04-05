'use client';

import { useState } from 'react';

const sections = ['Profile', 'Notifications', 'Roles & Permissions', 'Workflows'] as const;
type Section = (typeof sections)[number];

const notificationSettings = [
  { label: 'Email notifications for approvals', enabled: true },
  { label: 'Push notifications for mentions', enabled: true },
  { label: 'Daily digest email', enabled: false },
  { label: 'Task due date reminders', enabled: true },
  { label: 'Meeting reminders (15 min before)', enabled: true },
  { label: 'AI alert notifications', enabled: false },
  { label: 'Weekly activity summary', enabled: true },
];

const roles = [
  { name: 'Admin', description: 'Full system access', members: 3, color: 'bg-red-50 text-red-600' },
  { name: 'Manager', description: 'Department-level access with approval rights', members: 12, color: 'bg-orange-50 text-orange-600' },
  { name: 'Employee', description: 'Standard access to assigned modules', members: 118, color: 'bg-blue-50 text-blue-600' },
  { name: 'Finance', description: 'Finance module access plus reporting', members: 8, color: 'bg-green-50 text-green-600' },
  { name: 'HR', description: 'HR module and employee data access', members: 6, color: 'bg-purple-50 text-purple-600' },
  { name: 'Viewer', description: 'Read-only access', members: 5, color: 'bg-gray-100 text-gray-600' },
];

const workflows = [
  { name: 'Purchase Request Approval', steps: 3, status: 'Active', lastRun: 'Apr 4, 2026' },
  { name: 'Expense Claim Processing', steps: 4, status: 'Active', lastRun: 'Apr 3, 2026' },
  { name: 'Leave Request Approval', steps: 2, status: 'Active', lastRun: 'Apr 5, 2026' },
  { name: 'Contract Review & Sign-off', steps: 5, status: 'Active', lastRun: 'Apr 2, 2026' },
  { name: 'New Employee Onboarding', steps: 8, status: 'Draft', lastRun: '—' },
  { name: 'Vendor Evaluation', steps: 4, status: 'Inactive', lastRun: 'Mar 15, 2026' },
];

const workflowStatus: Record<string, string> = {
  Active: 'bg-green-50 text-green-600',
  Draft: 'bg-gray-100 text-gray-600',
  Inactive: 'bg-yellow-50 text-yellow-600',
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('Profile');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile, preferences, and system configuration.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-3 space-y-1">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === section
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeSection === 'Profile' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center text-xl text-brand-700 font-bold">
                  U
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Udom S.</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                  <button className="text-xs text-brand-600 hover:text-brand-700 mt-1">Change photo</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" defaultValue="Udom Sakkaewsiri" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" defaultValue="udom@virtualoffice.co" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" defaultValue="Management" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input type="text" defaultValue="Admin" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" defaultValue="+66 81 234 5678" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option>Thai</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'Notifications' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              <div className="space-y-3">
                {notificationSettings.map((setting, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">{setting.label}</span>
                    <div
                      className={`w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${
                        setting.enabled ? 'bg-brand-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          setting.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'Roles & Permissions' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Roles &amp; Permissions</h2>
                <button className="px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
                  + Create Role
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {roles.map((role, i) => (
                  <div key={i} className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${role.color}`}>
                        {role.name}
                      </span>
                      <div>
                        <p className="text-sm text-gray-700">{role.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-400">{role.members} members</span>
                      <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'Workflows' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Workflow Automation</h2>
                <button className="px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
                  + New Workflow
                </button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Workflow</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Steps</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Last Run</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.map((wf, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-800 font-medium">{wf.name}</td>
                      <td className="py-3 px-4 text-gray-600">{wf.steps} steps</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${workflowStatus[wf.status]}`}>
                          {wf.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{wf.lastRun}</td>
                      <td className="py-3 px-4">
                        <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
