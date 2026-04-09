'use client';

import { useEffect, useState } from 'react';
import { api, getUser, logout } from '@/lib/auth';
import Link from 'next/link';

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
    api.get('/users/me').then((res: any) => setUser(res.data)).catch(() => {});
  }, []);

  async function doSearch(q: string) {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const res: any = await api.get(`/search?q=${encodeURIComponent(q)}`);
      setSearchResults(res.data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  const initial = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 relative z-20">
      <div className="flex-1 max-w-xl relative">
        <input
          type="text"
          placeholder="Search tasks, documents, projects, meetings..."
          value={searchQuery}
          onChange={(e) => doSearch(e.target.value)}
          onBlur={() => setTimeout(() => setSearchResults([]), 200)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-30">
            {searchResults.slice(0, 10).map((r: any, i: number) => (
              <Link
                key={i}
                href={r.deepLink || '#'}
                onClick={() => { setSearchResults([]); setSearchQuery(''); }}
                className="block px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase text-gray-400 w-16">{r.type}</span>
                  <span className="text-sm text-gray-800 flex-1">{r.title}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Searching...</div>
        )}
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button className="px-3 py-1.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors">
          + Create
        </button>

        <button className="relative text-gray-500 hover:text-gray-700">
          <span className="text-lg">🔔</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <div className="w-8 h-8 bg-brand-100 text-brand-700 font-semibold rounded-full flex items-center justify-center text-xs">
              {initial}
            </div>
            {user && (
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-800 leading-tight">{user.displayName}</div>
                <div className="text-xs text-gray-500 leading-tight">{user.profile?.jobTitle || user.email}</div>
              </div>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-30">
              {user && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-900">{user.displayName}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  {user.roles && user.roles.length > 0 && (
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {user.roles.map((r: string) => (
                        <span key={r} className="text-[10px] px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded">{r}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <Link href="/settings" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Settings
              </Link>
              <button
                onClick={() => logout()}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
