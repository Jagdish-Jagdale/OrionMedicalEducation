import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

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
    alert('Team saved! (Wire to Firestore as needed)');
  };

  return (
    <AdminLayout title="Manage Team">
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {members.map((m, i) => (
          <div key={i} className="bg-[#1e2d45] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Member {i + 1}</h3>
              {members.length > 1 && (
                <button type="button" onClick={() => removeMember(i)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', field: 'name', placeholder: 'e.g. Dr. Rahul Sharma' },
                { label: 'Role / Designation', field: 'role', placeholder: 'e.g. MBBS Counselor' },
                { label: 'Email', field: 'email', placeholder: 'e.g. rahul@orion.com' },
                { label: 'LinkedIn URL', field: 'linkedin', placeholder: 'https://linkedin.com/in/...' },
                { label: 'Profile Image URL', field: 'image', placeholder: 'https://...' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-slate-400 text-sm mb-1">{label}</label>
                  <input value={m[field]} onChange={(e) => handleChange(i, field, e.target.value)} placeholder={placeholder} className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition" />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-1">Bio</label>
                <textarea value={m.bio} onChange={(e) => handleChange(i, 'bio', e.target.value)} rows={3} placeholder="Short description about this team member..." className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition resize-none" />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="button" onClick={addMember} className="border border-white/10 text-slate-300 hover:border-blue-500 hover:text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            + Add Member
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Save All
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminTeam;
