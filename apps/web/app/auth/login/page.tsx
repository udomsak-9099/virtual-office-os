'use client';

import { useState, useEffect } from 'react';
import { login } from '@/lib/auth';
import Script from 'next/script';

export default function LoginPage() {
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Fallback inline script for when React hydration is slow */}
      <Script id="login-fallback" strategy="afterInteractive">{`
        (function() {
          if (window.__loginAttached) return;
          window.__loginAttached = true;

          function attachLogin() {
            var form = document.getElementById('login-form');
            if (!form) { setTimeout(attachLogin, 500); return; }

            form.addEventListener('submit', function(e) {
              e.preventDefault();
              var emailEl = document.getElementById('email');
              var passEl = document.getElementById('password');
              var btnEl = document.getElementById('login-btn');
              var errEl = document.getElementById('login-error');

              if (!emailEl || !passEl) return;

              btnEl.textContent = 'Signing in...';
              btnEl.disabled = true;
              if (errEl) errEl.style.display = 'none';

              fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: emailEl.value, password: passEl.value})
              })
              .then(function(r) { return r.json(); })
              .then(function(d) {
                if (d.data && d.data.access_token) {
                  localStorage.setItem('vos_access_token', d.data.access_token);
                  localStorage.setItem('vos_refresh_token', d.data.refresh_token);
                  if (d.data.user) localStorage.setItem('vos_user', JSON.stringify(d.data.user));
                  window.location.href = '/dashboard';
                } else {
                  throw new Error(d.message || d.error?.message || 'Login failed');
                }
              })
              .catch(function(err) {
                if (errEl) {
                  errEl.textContent = err.message || 'Login failed';
                  errEl.style.display = 'block';
                }
                btnEl.textContent = 'Sign In';
                btnEl.disabled = false;
              });
            });
          }
          attachLogin();
        })();
      `}</Script>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-600 text-white rounded-xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
              V
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Virtual Office OS</h1>
            <p className="text-gray-500 mt-2">Sign in to your workspace</p>
          </div>

          <div
            id="login-error"
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg"
            style={{ display: error ? 'block' : 'none' }}
          >
            {error}
          </div>

          <form id="login-form" onSubmit={hydrated ? handleSubmit : undefined} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="email"
                name="email"
                type="text"
                defaultValue="admin"
                value={hydrated ? email : undefined}
                onChange={hydrated ? (e) => setEmail(e.target.value) : undefined}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                defaultValue="1234"
                value={hydrated ? password : undefined}
                onChange={hydrated ? (e) => setPassword(e.target.value) : undefined}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
