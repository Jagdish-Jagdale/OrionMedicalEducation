import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const emptyProgram = { title: '', hospital: '', city: '', country: '', duration: '', eligibility: '', fee: '', description: '', applyLink: '' };

const AdminObservership = () => {
  const [programs, setPrograms] = useState([emptyProgram]);

  const handleChange = (i, field, val) => {
    const updated = [...programs];
    updated[i][field] = val;
    setPrograms(updated);
  };

  const addProgram = () => setPrograms([...programs, { ...emptyProgram }]);
  const removeProgram = (i) => setPrograms(programs.filter((_, idx) => idx !== i));

  const handleSave = (e) => {
    e.preventDefault();
    alert('Observership programs saved! (Wire to Firestore as needed)');
  };

  return (
    <AdminLayout title="Manage Observership">
      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {programs.map((p, i) => (
          <div key={i} className="bg-[#1e2d45] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Program {i + 1}</h3>
              {programs.length > 1 && (
                <button type="button" onClick={() => removeProgram(i)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Program Title', field: 'title', placeholder: 'e.g. Clinical Observership – Cardiology' },
                { label: 'Hospital / Institution', field: 'hospital', placeholder: 'e.g. Moscow City Hospital' },
                { label: 'City', field: 'city', placeholder: 'e.g. Moscow' },
                { label: 'Country', field: 'country', placeholder: 'e.g. Russia' },
                { label: 'Duration', field: 'duration', placeholder: 'e.g. 4 Weeks' },
                { label: 'Eligibility', field: 'eligibility', placeholder: 'e.g. MBBS Final Year / Graduate' },
                { label: 'Fee', field: 'fee', placeholder: 'e.g. $500' },
                { label: 'Apply Link', field: 'applyLink', placeholder: 'https://...' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-slate-400 text-sm mb-1">{label}</label>
                  <input value={p[field]} onChange={(e) => handleChange(i, field, e.target.value)} placeholder={placeholder} className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-1">Description</label>
                <textarea value={p.description} onChange={(e) => handleChange(i, 'description', e.target.value)} rows={3} placeholder="Program details..." className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition resize-none" />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="button" onClick={addProgram} className="border border-white/10 text-slate-300 hover:border-blue-500 hover:text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            + Add Program
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Save All
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminObservership;
