'use client';

import { useState } from 'react';

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <input
          type="text"
          placeholder="Search tasks, documents, people..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4 ml-4">
        {/* Quick create */}
        <button className="px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
          + Create
        </button>

        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-gray-700">
          <span className="text-lg">🔔</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User menu */}
        <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900">
          <div className="w-8 h-8 bg-brand-100 text-brand-700 font-semibold rounded-full flex items-center justify-center text-xs">
            U
          </div>
        </button>
      </div>
    </header>
  );
}
