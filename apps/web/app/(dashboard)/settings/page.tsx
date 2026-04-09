'use client';

import { useEffect, useState } from 'react';
import { api, getUser, logout } from '@/lib/auth';

export default function SettingsPage() {
  const [section, setSection] = useState('profile');
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    api.get('/users/me').then((res: any) => setMe(res.data)).catch(() => setMe(getUser()));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile and Lawi workspace configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 h-fit">
          <nav className="space-y-1">
            {[
              { k: 'profile', label: 'My Profile', icon: '👤' },
              { k: 'organization', label: 'Organization', icon: '🏢' },
              { k: 'notifications', label: 'Notifications', icon: '🔔' },
              { k: 'security', label: 'Security', icon: '🔐' },
              { k: 'about', label: 'About LAWI', icon: 'ℹ️' },
            ].map((s) => (
              <button
                key={s.k}
                onClick={() => setSection(s.k)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  section === s.k ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left text-red-600 hover:bg-red-50 mt-4"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {section === 'profile' && me && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Profile</h2>
              <div className="space-y-4">
                <Field label="Display Name" value={me.displayName} />
                <Field label="Email / Username" value={me.email} />
                <Field label="Job Title" value={me.profile?.jobTitle || '-'} />
                <Field label="Employee Code" value={me.profile?.employeeCode || '-'} />
                <Field label="Roles" value={me.roles?.join(', ')} />
                <Field label="Status" value={me.status} />
                <Field label="MFA Enabled" value={me.mfaEnabled ? 'Yes' : 'No'} />
              </div>
            </div>
          )}

          {section === 'organization' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
              <div className="space-y-4">
                <Field label="Company Name" value="Lawi Energy Holding" />
                <Field label="Code" value="LAWI" />
                <Field label="Structure" value="Thai (51%) / Malaysian (49%) Joint Venture" />
                <Field label="Business Units" value="BU1 Renewable Energy · BU2 Alternative Fuel · BU3 Advanced Material" />
                <Field label="Default Timezone" value="Asia/Bangkok" />
                <Field label="Default Locale" value="Thai (th)" />
                <Field label="Status" value="Active" />
              </div>
            </div>
          )}

          {section === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
              <div className="space-y-3">
                {[
                  { label: 'Approval requests pending my action', on: true },
                  { label: 'Task assignments and updates', on: true },
                  { label: 'Meeting invitations and reminders', on: true },
                  { label: 'Document routed for approval', on: true },
                  { label: 'Compliance alerts', on: true },
                  { label: 'AI review queue items', on: false },
                  { label: 'Daily digest email', on: false },
                ].map((n) => (
                  <label key={n.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-700">{n.label}</span>
                    <div className={`w-10 h-6 rounded-full relative transition-colors ${n.on ? 'bg-brand-600' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${n.on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {section === 'security' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">⚠️ Two-Factor Authentication is currently disabled. Enable MFA for additional security.</p>
                </div>
                <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700">
                  Enable MFA
                </button>
                <button className="ml-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200">
                  Change Password
                </button>
              </div>
            </div>
          )}

          {section === 'about' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About LAWI</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>LAWI</strong> — Digital headquarters platform for Lawi Energy Holding</p>
                <p>Integrated operating system for Project Lawi — managing investment pipeline, tasks, documents, approvals, and team coordination across BU1 (Renewable Energy), BU2 (Alternative Fuel), and BU3 (Advanced Material).</p>
                <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <p>Version: 1.0.0</p>
                  <p>Environment: Production</p>
                  <p>Source: github.com/udomsak-9099/virtual-office-os</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <div className="text-sm text-gray-900">{value || '-'}</div>
    </div>
  );
}
