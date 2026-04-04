import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const emptyMember = { name: '', role: '', bio: '', image: '', linkedin: '', email: '' };

const AdminTeam = () => {
  const [members, setMembers] = useState([emptyMember]);

  const handleChange = (i, field, val) => {
    const updated = [...members];
    updated[i][field] = val;
    setMembers(updated);
  };

  const addMember = () => setMembers([...members, { ...emptyMember }]);
  const removeMember = (i) => setMembers(members.filter((_, idx) => idx !== i));

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Team data updated successfully!');
  };

  return (
    <AdminLayout title="Manage Team Members">
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        <div className="grid grid-cols-1 gap-8">
          {members.map((m, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm transition-all hover:shadow-lg group overflow-hidden">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-purple-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg">{m.name || 'New Member'}</h3>
                    <p className="text-purple-600 text-[10px] font-black uppercase tracking-widest mt-0.5">{m.role || 'Personnel Profile'}</p>
                  </div>
                </div>
                {members.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeMember(i)} 
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                    title="Remove Member"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', field: 'name', placeholder: 'e.g. Dr. Rahul Sharma' },
                  { label: 'Role / Designation', field: 'role', placeholder: 'e.g. Senior MBBS Counselor' },
                  { label: 'Email', field: 'email', placeholder: 'e.g. rahul@orion.com' },
                  { label: 'LinkedIn URL', field: 'linkedin', placeholder: 'https://linkedin.com/in/...' },
                  { label: 'Profile Image URL', field: 'image', placeholder: 'Public direct image link' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field} className={field === 'image' ? 'md:col-span-2' : ''}>
                    <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">{label}</label>
                    <input 
                      value={m[field]} 
                      onChange={(e) => handleChange(i, field, e.target.value)} 
                      placeholder={placeholder} 
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Biography</label>
                  <textarea 
                    value={m.bio} 
                    onChange={(e) => handleChange(i, 'bio', e.target.value)} 
                    rows={4} 
                    placeholder="Short description highlighting professional background..." 
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
            onClick={addMember} 
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-purple-600 text-slate-900 hover:text-purple-600 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-sm hover:shadow-xl active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            Add Team Member
          </button>
          <button 
            type="submit" 
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95"
          >
            Update Team Profiles
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminTeam;
