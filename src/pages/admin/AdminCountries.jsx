import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const emptyCountry = { name: '', flag: '', capital: '', currency: '', language: '', climate: '', tuitionRange: '', duration: '', overview: '' };

const AdminCountries = () => {
  const [entries, setEntries] = useState([emptyCountry]);

  const handleChange = (i, field, val) => {
    const updated = [...entries];
    updated[i][field] = val;
    setEntries(updated);
  };

  const addEntry = () => setEntries([...entries, { ...emptyCountry }]);
  const removeEntry = (i) => setEntries(entries.filter((_, idx) => idx !== i));

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Country data updated successfully!');
  };

  return (
    <AdminLayout title="Manage Countries">
      <form onSubmit={handleSave} className="space-y-10 max-w-5xl">
        <div className="grid grid-cols-1 gap-8">
          {entries.map((entry, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg">{entry.name || 'New Country'}</h3>
                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-0.5">Configuration Unit</p>
                  </div>
                </div>
                {entries.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeEntry(i)} 
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                    title="Remove Country"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Country Name', field: 'name', placeholder: 'e.g. Russia' },
                  { label: 'Flag Emoji', field: 'flag', placeholder: 'e.g. 🇷🇺' },
                  { label: 'Capital', field: 'capital', placeholder: 'e.g. Moscow' },
                  { label: 'Currency', field: 'currency', placeholder: 'e.g. Russian Ruble (RUB)' },
                  { label: 'Language', field: 'language', placeholder: 'e.g. Russian' },
                  { label: 'Climate', field: 'climate', placeholder: 'e.g. Continental' },
                  { label: 'Tuition Range', field: 'tuitionRange', placeholder: 'e.g. $3,500 – $6,000/year' },
                  { label: 'Duration', field: 'duration', placeholder: 'e.g. 6 Years' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">{label}</label>
                    <input 
                      value={entry[field]} 
                      onChange={(e) => handleChange(i, field, e.target.value)} 
                      placeholder={placeholder} 
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                ))}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Overview</label>
                  <textarea 
                    value={entry.overview} 
                    onChange={(e) => handleChange(i, 'overview', e.target.value)} 
                    rows={4} 
                    placeholder="Short description about studying MBBS in this country..." 
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Actions for Bottom */}
        <div className="flex flex-col sm:flex-row gap-4 pt-10">
          <button 
            type="button" 
            onClick={addEntry} 
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-blue-600 text-slate-900 hover:text-blue-600 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-sm hover:shadow-xl active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            Add Another Country
          </button>
          <button 
            type="submit" 
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95"
          >
            Save All Changes
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminCountries;
