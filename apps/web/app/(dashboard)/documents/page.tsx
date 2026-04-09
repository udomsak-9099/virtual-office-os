'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/auth';

interface DocItem {
  id: string;
  title: string;
  documentType: string;
  status: string;
  classification: string;
  isControlled: boolean;
  createdAt: string;
  owner?: { id: string; displayName: string };
  department?: { id: string; name: string };
  currentVersion?: {
    id: string;
    versionNo: number;
    fileName: string;
    storageObjectKey?: string;
    uploadedAt?: string;
  };
}

const classColors: Record<string, string> = {
  public: 'bg-green-50 text-green-700',
  internal: 'bg-blue-50 text-blue-700',
  confidential: 'bg-orange-50 text-orange-700',
  restricted: 'bg-red-50 text-red-700',
};

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-blue-50 text-blue-700',
  under_review: 'bg-yellow-50 text-yellow-700',
  approved: 'bg-green-50 text-green-700',
  archived: 'bg-gray-50 text-gray-500',
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/documents')
      .then((res: any) => setDocs(res.data || []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = docs.filter((d) => !search || d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">{docs.length} documents in Lawi repository</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700">+ Upload</button>
      </div>

      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Classification</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Version</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 text-sm">No documents</td></tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="text-sm font-medium text-gray-900">{d.title}</div>
                      {d.department && <div className="text-xs text-gray-500">{d.department.name}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{d.documentType.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${classColors[d.classification] || 'bg-gray-100'}`}>
                        {d.classification}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[d.status] || 'bg-gray-100'}`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{d.owner?.displayName || '-'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">v{d.currentVersion?.versionNo || 1}</td>
                    <td className="px-4 py-3 text-right">
                      {d.currentVersion?.storageObjectKey && (
                        <a
                          href={d.currentVersion.storageObjectKey}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded hover:bg-brand-100 inline-block"
                        >
                          Open
                        </a>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
