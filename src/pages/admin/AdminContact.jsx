import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getContactSubmissions } from '../../firebase/firestore';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';

const AdminContact = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getContactSubmissions();
      setSubmissions(data);
    } catch {
      toast.error('Failed to load contact submissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    try {
      await deleteDoc(doc(db, 'contacts', id));
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      toast.success('Submission deleted.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Date'];
    const rows = submissions.map((s) => [
      s.name, s.email, s.phone, s.subject, s.message,
      s.createdAt?.toDate ? s.createdAt.toDate().toLocaleString() : ''
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_submissions.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    if (ts?.toDate) return ts.toDate().toLocaleString();
    return String(ts);
  };

  return (
    <AdminLayout title="Contact Submissions">
      <PageTitle title="Admin | Contacts" />
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-lg">Inbound Leads</h3>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                {loading ? 'Loading...' : `Total: ${submissions.length} Submissions`}
              </p>
            </div>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={loading || submissions.length === 0}
            className="w-full sm:w-auto bg-slate-900 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-2xl text-xs hover:bg-slate-800 transition-all active:scale-95"
          >
            Export to CSV
          </button>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-36 bg-white rounded-3xl border border-slate-200 animate-pulse" />)}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
            </div>
            <p className="text-slate-400 font-semibold">No contact submissions yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all group">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">New Lead</span>
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{formatDate(sub.createdAt)}</span>
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-black text-xl mb-1">{sub.name}</h4>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-500 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                          {sub.email}
                        </div>
                        {sub.phone && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                            {sub.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    {sub.subject && (
                      <p className="text-slate-600 text-sm font-semibold">📌 {sub.subject}</p>
                    )}
                    {sub.message && (
                      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 italic text-slate-700 text-sm leading-relaxed">
                        <p className="font-bold text-slate-400 not-italic text-[10px] uppercase tracking-widest mb-2">Message</p>
                        "{sub.message}"
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2">
                    <a
                      href={`mailto:${sub.email}?subject=Re: ${sub.subject || 'Your Inquiry'}`}
                      className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-blue-100 active:scale-95 text-center"
                    >
                      Reply Email
                    </a>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="flex-1 lg:flex-none bg-white border border-slate-200 hover:border-red-500 text-slate-600 hover:text-red-500 font-bold px-6 py-3 rounded-2xl text-xs transition-all active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContact;
