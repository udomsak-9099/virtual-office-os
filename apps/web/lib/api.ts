const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = `${baseUrl}/api/v1`;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth/login';
      throw new Error('Unauthorized');
    }

    return res.json();
  }

  get<T>(path: string) {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, body);
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>('PATCH', path, body);
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path);
  }

  // Auth
  login(email: string, password: string) {
    return this.post('/auth/login', { email, password });
  }

  // Users
  getMe() {
    return this.get('/users/me');
  }

  // Tasks
  getTasks(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.get(`/tasks${query}`);
  }

  createTask(data: Record<string, unknown>) {
    return this.post('/tasks', data);
  }

  // Meetings
  getMeetings(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.get(`/meetings${query}`);
  }

  // Documents
  getDocuments(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.get(`/documents${query}`);
  }

  // Approvals
  getApprovalRequests(params?: Record<string, string>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.get(`/approval-requests${query}`);
  }

  approveRequest(requestId: string, comment?: string) {
    return this.post(`/approval-requests/${requestId}/approve`, { comment });
  }

  rejectRequest(requestId: string, comment?: string) {
    return this.post(`/approval-requests/${requestId}/reject`, { comment });
  }

  // AI
  askAi(prompt: string, scope?: Record<string, unknown>) {
    return this.post('/ai/ask', { task_type: 'knowledge_search', prompt, scope });
  }

  // Search
  search(query: string, modules?: string[]) {
    const params = new URLSearchParams({ q: query });
    if (modules) params.set('modules', modules.join(','));
    return this.get(`/search?${params.toString()}`);
  }

  // Notifications
  getNotifications() {
    return this.get('/notifications');
  }

  markNotificationRead(id: string) {
    return this.post(`/notifications/${id}/read`);
  }
}

export const api = new ApiClient(API_BASE);
