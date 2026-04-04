import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const mockSubmissions = [
  { id: 1, name: 'Suresh Raina', email: 'suresh@example.com', phone: '+91 98765 43210', subject: 'MBBS in Russia Inquiry', message: 'I want to know about the admission process for Kazan Federal University.', date: '2024-03-20 10:45 AM' },
  { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '+91 91234 56789', subject: 'Tuition Fees', message: 'What is the total package for 6 years in Uzbekistan?', date: '2024-03-19 03:12 PM' },
];

const AdminContact = () => {
  return (
    <AdminLayout title="Contact Submissions">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-lg">Inbound Leads</h3>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total: {mockSubmissions.length} Submissions</p>
            </div>
          </div>
          <button className="w-full sm:w-auto bg-slate-900 text-white font-bold px-6 py-3 rounded-2xl text-xs hover:bg-slate-800 transition-all active:scale-95">
            Export to CSV
          </button>
        </div>

        {/* Submissions List */}
        <div className="grid grid-cols-1 gap-4">
          {mockSubmissions.map((sub) => (
            <div key={sub.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                      New Lead
                    </span>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{sub.date}</span>
                  </div>
                  
                  <div>
                    <h4 className="text-slate-900 font-black text-xl mb-1">{sub.name}</h4>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-500 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                        {sub.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                        {sub.phone}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 italic text-slate-700 text-sm leading-relaxed">
                    <p className="font-bold text-slate-400 not-italic text-[10px] uppercase tracking-widest mb-2">Message</p>
                    "{sub.message}"
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-2">
                  <button className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-blue-100 active:scale-95">
                    Reply Email
                  </button>
                  <button className="flex-1 lg:flex-none bg-white border border-slate-200 hover:border-red-500 text-slate-600 hover:text-red-500 font-bold px-6 py-3 rounded-2xl text-xs transition-all active:scale-95">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContact;
