import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminHome = () => {
  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    heroTagline: '',
    stat1Label: 'Students Placed',
    stat1Value: '',
    stat2Label: 'Universities',
    stat2Value: '',
    stat3Label: 'Countries',
    stat3Value: '',
    stat4Label: 'Success Rate',
    stat4Value: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = (e) => {
    e.preventDefault();
    alert('Home content saved! (Wire to Firestore as needed)');
  };

  return (
    <AdminLayout title="Manage Home">
      <div className="max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Hero section */}
          <section className="bg-[#1e2d45] rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-semibold mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Tagline</label>
                <input name="heroTagline" value={form.heroTagline} onChange={handleChange} placeholder="e.g. Trusted MBBS Abroad Consultancy" className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Hero Title</label>
                <input name="heroTitle" value={form.heroTitle} onChange={handleChange} placeholder="e.g. Your MBBS Abroad Journey Starts Here" className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Subtitle</label>
                <textarea name="heroSubtitle" value={form.heroSubtitle} onChange={handleChange} rows={3} placeholder="Short description below the title..." className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition resize-none" />
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="bg-[#1e2d45] rounded-2xl p-6 border border-white/5">
            <h2 className="text-white font-semibold mb-4">Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="space-y-2">
                  <label className="block text-slate-400 text-xs uppercase tracking-wider">Stat {n}</label>
                  <input name={`stat${n}Label`} value={form[`stat${n}Label`]} onChange={handleChange} placeholder="Label" className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition" />
                  <input name={`stat${n}Value`} value={form[`stat${n}Value`]} onChange={handleChange} placeholder="Value (e.g. 500+)" className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition" />
                </div>
              ))}
            </div>
          </section>

          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
