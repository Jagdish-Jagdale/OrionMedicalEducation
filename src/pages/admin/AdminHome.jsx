import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

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
    toast.success('Home content updated successfully!');
  };

  return (
    <AdminLayout title="Manage Home Content">
      <div className="max-w-4xl">
        <form onSubmit={handleSave} className="space-y-8">
          {/* Hero section */}
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-slate-900 font-bold text-lg">Hero Section</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wide">Tagline / Pre-title</label>
                <input 
                  name="heroTagline" 
                  value={form.heroTagline} 
                  onChange={handleChange} 
                  placeholder="e.g. Trusted MBBS Abroad Consultancy" 
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wide">Main Title</label>
                <input 
                  name="heroTitle" 
                  value={form.heroTitle} 
                  onChange={handleChange} 
                  placeholder="e.g. Your MBBS Abroad Journey Starts Here" 
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-700 text-sm font-bold mb-2 uppercase tracking-wide">Subtitle / Description</label>
                <textarea 
                  name="heroSubtitle" 
                  value={form.heroSubtitle} 
                  onChange={handleChange} 
                  rows={4} 
                  placeholder="Tell students why they should choose you..." 
                  className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" 
                />
              </div>
            </div>
          </section>

          {/* Stats section */}
          <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
              <h2 className="text-slate-900 font-bold text-lg">Key Stats</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">statistic {n}</span>
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <input 
                      name={`stat${n}Label`} 
                      value={form[`stat${n}Label`]} 
                      onChange={handleChange} 
                      placeholder="Label (e.g. Students Placed)" 
                      className="w-full bg-white text-slate-900 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all" 
                    />
                    <input 
                      name={`stat${n}Value`} 
                      value={form[`stat${n}Value`]} 
                      onChange={handleChange} 
                      placeholder="Value (e.g. 500+)" 
                      className="w-full bg-white text-blue-600 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black focus:outline-none focus:border-blue-500 transition-all" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="flex justify-end p-4 lg:p-0">
            <button 
              type="submit" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95"
            >
              Update Home Page
            </button>
          </footer>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
