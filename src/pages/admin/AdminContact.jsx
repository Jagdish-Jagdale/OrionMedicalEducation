import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

// Placeholder – replace with Firestore fetch when ready
const mockSubmissions = [
  { id: '1', name: 'Anjali Mehta', email: 'anjali@gmail.com', phone: '+91 98765 43210', message: 'I want to study MBBS in Russia. Please guide me.', date: '2026-04-01' },
  { id: '2', name: 'Rohan Patil', email: 'rohan@gmail.com', phone: '+91 91234 56789', message: 'Interested in Georgia. What are the requirements?', date: '2026-04-02' },
];

const AdminContact = () => {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [search, setSearch] = useState('');

  const filtered = submissions.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Contact Submissions">
      <div className="max-w-5xl">
        {/* Search */}
        <div className="mb-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full max-w-sm bg-[#1e2d45] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Table */}
        <div className="bg-[#1e2d45] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-400 px-5 py-3 font-medium">Name</th>
                  <th className="text-left text-slate-400 px-5 py-3 font-medium">Email</th>
                  <th className="text-left text-slate-400 px-5 py-3 font-medium">Phone</th>
                  <th className="text-left text-slate-400 px-5 py-3 font-medium">Message</th>
                  <th className="text-left text-slate-400 px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-slate-500 py-10">No submissions found.</td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 text-white font-medium">{s.name}</td>
                      <td className="px-5 py-3 text-slate-300">{s.email}</td>
                      <td className="px-5 py-3 text-slate-300">{s.phone}</td>
                      <td className="px-5 py-3 text-slate-400 max-w-xs truncate">{s.message}</td>
                      <td className="px-5 py-3 text-slate-500">{s.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-slate-600 text-xs mt-3">Showing {filtered.length} of {submissions.length} submissions. Connect to Firestore to load live data.</p>
      </div>
    </AdminLayout>
  );
};

export default AdminContact;
