'use client';

// Use same-origin proxy (Next.js rewrites /api/* to backend)
// This avoids all CORS and cross-domain issues
const API_PREFIX = '/api/v1';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vos_access_token');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vos_refresh_token');
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('vos_access_token', accessToken);
  localStorage.setItem('vos_refresh_token', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('vos_access_token');
  localStorage.removeItem('vos_refresh_token');
  localStorage.removeItem('vos_user');
}

export function setUser(user: any) {
  localStorage.setItem('vos_user', JSON.stringify(user));
}

export function getUser(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('vos_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

export function logout() {
  clearTokens();
  window.location.href = '/auth/login';
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_PREFIX}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || err?.message?.join?.(', ') || 'Login failed');
  }

  const { data } = await res.json();
  setTokens(data.access_token, data.refresh_token);
  if (data.user) setUser(data.user);
  return data;
}

export async function fetchApi<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_PREFIX}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearTokens();
    if (typeof window !== 'undefined') window.location.href = '/auth/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T = any>(path: string) => fetchApi<T>(path),
  post: <T = any>(path: string, body?: any) =>
    fetchApi<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T = any>(path: string, body?: any) =>
    fetchApi<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T = any>(path: string) => fetchApi<T>(path, { method: 'DELETE' }),
};
