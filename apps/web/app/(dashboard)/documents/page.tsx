'use client';

import { useState } from 'react';

const folders = [
  { name: 'Contracts', count: 24 },
  { name: 'Proposals', count: 12 },
  { name: 'Policies & SOPs', count: 18 },
  { name: 'Finance Reports', count: 31 },
  { name: 'HR Documents', count: 15 },
  { name: 'Meeting Notes', count: 42 },
  { name: 'Templates', count: 8 },
];

const files = [
  { name: 'Vendor Agreement — TechCorp.pdf', folder: 'Contracts', modified: 'Apr 4, 2026', size: '2.4 MB', type: 'PDF' },
  { name: 'Q1 Financial Summary.xlsx', folder: 'Finance Reports', modified: 'Apr 3, 2026', size: '1.1 MB', type: 'Excel' },
  { name: 'Employee Handbook v3.docx', folder: 'HR Documents', modified: 'Mar 28, 2026', size: '890 KB', type: 'Word' },
  { name: 'Proposal Template.docx', folder: 'Templates', modified: 'Mar 25, 2026', size: '340 KB', type: 'Word' },
  { name: 'Board Meeting Notes — Mar 2026.pdf', folder: 'Meeting Notes', modified: 'Mar 22, 2026', size: '520 KB', type: 'PDF' },
  { name: 'Procurement Policy v2.pdf', folder: 'Policies & SOPs', modified: 'Mar 15, 2026', size: '1.8 MB', type: 'PDF' },
  { name: 'NDA — Partner Co.pdf', folder: 'Contracts', modified: 'Mar 10, 2026', size: '410 KB', type: 'PDF' },
];

const typeIcon: Record<string, string> = {
  PDF: 'text-red-500 bg-red-50',
  Excel: 'text-green-500 bg-green-50',
  Word: 'text-blue-500 bg-blue-50',
};

export default function DocumentsPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const filtered = selectedFolder ? files.filter((f) => f.folder === selectedFolder) : files;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-500 mt-1">Centralized document library for your organization.</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors">
          + Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folder Tree */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Folders</h2>
          <div className="space-y-1">
            <button
              onClick={() => setSelectedFolder(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedFolder === null ? 'bg-brand-50 text-brand-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Files
            </button>
            {folders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setSelectedFolder(folder.name)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                  selectedFolder === folder.name
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{folder.name}</span>
                <span className="text-xs text-gray-400">{folder.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* File List */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Folder</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Modified</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Size</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((file, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${typeIcon[file.type]}`}>{file.type}</span>
                      <span className="text-gray-800 font-medium">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{file.folder}</td>
                  <td className="py-3 px-4 text-gray-400">{file.modified}</td>
                  <td className="py-3 px-4 text-gray-400">{file.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
