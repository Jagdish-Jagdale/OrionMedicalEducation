import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

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
    alert('Countries saved! (Wire to Firestore as needed)');
  };

  return (
    <AdminLayout title="Manage Countries">
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {entries.map((entry, i) => (
          <div key={i} className="bg-[#1e2d45] rounded-2xl p-6 border border-white/5 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Country {i + 1}</h3>
              {entries.length > 1 && (
                <button type="button" onClick={() => removeEntry(i)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <label className="block text-slate-400 text-sm mb-1">{label}</label>
                  <input value={entry[field]} onChange={(e) => handleChange(i, field, e.target.value)} placeholder={placeholder} className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-1">Overview</label>
                <textarea value={entry.overview} onChange={(e) => handleChange(i, 'overview', e.target.value)} rows={3} placeholder="Short description about studying MBBS in this country..." className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition resize-none" />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="button" onClick={addEntry} className="border border-white/10 text-slate-300 hover:border-blue-500 hover:text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            + Add Country
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Save All
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminCountries;
