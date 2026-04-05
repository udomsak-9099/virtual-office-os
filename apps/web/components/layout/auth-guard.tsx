'use client';

import { useEffect, useState } from 'react';
import { isLoggedIn, getUser, api } from '@/lib/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = '/auth/login';
      return;
    }

    const cached = getUser();
    if (cached) {
      setUser(cached);
      setReady(true);
    }

    // Verify token is still valid
    api.get('/users/me').then((res: any) => {
      if (res.data) {
        setUser(res.data);
        setReady(true);
      }
    }).catch(() => {
      window.location.href = '/auth/login';
    });
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
