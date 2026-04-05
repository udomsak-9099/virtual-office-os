'use client';

import { useEffect } from 'react';
import { isLoggedIn } from '@/lib/auth';

export default function RootPage() {
  useEffect(() => {
    if (isLoggedIn()) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/auth/login';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
    </div>
  );
}
