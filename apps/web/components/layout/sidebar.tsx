'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  group?: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/dashboard', icon: '🏠', group: 'main' },
  { label: 'Tasks', href: '/tasks', icon: '✓', group: 'work' },
  { label: 'Projects', href: '/projects', icon: '📋', group: 'work' },
  { label: 'Meetings', href: '/meetings', icon: '📅', group: 'work' },
  { label: 'Documents', href: '/documents', icon: '📄', group: 'work' },
  { label: 'Approvals', href: '/approvals', icon: '✅', group: 'work' },
  { label: 'Chat', href: '/chat', icon: '💬', group: 'work' },
  { label: 'Sales', href: '/sales', icon: '📈', group: 'business' },
  { label: 'Procurement', href: '/procurement', icon: '🛒', group: 'business' },
  { label: 'Finance', href: '/finance', icon: '💰', group: 'business' },
  { label: 'HR', href: '/hr', icon: '👥', group: 'business' },
  { label: 'Legal', href: '/legal', icon: '⚖️', group: 'business' },
  { label: 'AI Workspace', href: '/ai', icon: '🤖', group: 'platform' },
  { label: 'Settings', href: '/settings', icon: '⚙️', group: 'platform' },
];

const groupLabels: Record<string, string> = {
  main: '',
  work: 'Work',
  business: 'Business',
  platform: 'Platform',
};

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const groups = [...new Set(navItems.map((item) => item.group || 'main'))];

  return (
    <aside
      className={clsx(
        'h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <span className="font-bold text-brand-700 text-sm">LAWI</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {groups.map((group) => (
          <div key={group}>
            {!collapsed && groupLabels[group] && (
              <div className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {groupLabels[group]}
              </div>
            )}
            {navItems
              .filter((item) => (item.group || 'main') === group)
              .map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    )}
                  >
                    <span className="text-base">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
