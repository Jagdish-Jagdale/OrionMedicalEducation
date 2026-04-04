import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const emptyProgram = { title: '', hospital: '', location: '', duration: '', price: '', description: '', image: '' };

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
    toast.success('Observership programs updated successfully!');
  };

  return (
    <AdminLayout title="Manage Observership Programs">
      <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
        <div className="grid grid-cols-1 gap-8">
          {programs.map((prog, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg">{prog.title || 'New Program'}</h3>
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Clinical Training Entry</p>
                  </div>
                </div>
                {programs.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeProgram(i)} 
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Program Title", field: "title", placeholder: "e.g. Clinical Observership in Internal Medicine" },
                  { label: "Hospital / Institution", field: "hospital", placeholder: "e.g. Kazan State Medical University Hospital" },
                  { label: "Location", field: "location", placeholder: "e.g. Kazan, Russia" },
                  { label: "Duration", field: "duration", placeholder: "e.g. 4-8 Weeks" },
                  { label: "Estimated Fees", field: "price", placeholder: "e.g. $1,200" },
                  { label: "Program Image URL", field: "image", placeholder: "Public direct image link" },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">{label}</label>
                    <input 
                      value={prog[field]} 
                      onChange={(e) => handleChange(i, field, e.target.value)} 
                      placeholder={placeholder} 
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                ))}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Program Description</label>
                  <textarea 
                    value={prog.description} 
                    onChange={(e) => handleChange(i, 'description', e.target.value)} 
                    rows={4} 
                    placeholder="Highlight clinical exposure, mentorship, and eligibility..." 
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-10">
          <button 
            type="button" 
            onClick={addProgram} 
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-blue-500 text-slate-900 hover:text-blue-500 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-sm hover:shadow-xl active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            Add New Program
          </button>
          <button 
            type="submit" 
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95"
          >
            Save All Programs
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminObservership;
