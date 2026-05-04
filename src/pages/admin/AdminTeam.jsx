import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getTeam, saveTeam } from '../../firebase/firestore';
import { uploadFile } from '../../firebase/storage';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';
import DeleteModal from '../../components/admin/DeleteModal';

const emptyMember = { name: '', role: '', bio: '', image: '', linkedin: '', email: '' };

const AdminTeam = () => {
  const [members, setMembers] = useState([emptyMember]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, index: null, itemName: '' });

  useEffect(() => {
    getTeam().then((data) => {
      if (data && data.length > 0) setMembers(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (i, field, val) => {
    const updated = [...members];
    updated[i][field] = val;
    setMembers(updated);
  };

  const handleImageUpload = async (i, file) => {
    if (!file) return;
    const path = `team/${Date.now()}_${file.name}`;
    try {
      const url = await uploadFile(file, path, (progress) => {
        setUploadProgress((prev) => ({ ...prev, [i]: progress }));
      });
      handleChange(i, 'image', url);
      setUploadProgress((prev) => ({ ...prev, [i]: null }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed.');
      setUploadProgress((prev) => ({ ...prev, [i]: null }));
    }
  };

  const addMember = () => setMembers([...members, { ...emptyMember }]);
  
  const removeMember = (i) => {
    setDeleteModal({ isOpen: true, index: i, itemName: members[i].name || `Team Member #${i + 1}` });
  };

  const confirmDeleteMember = () => {
    if (deleteModal.index !== null) {
      setMembers(members.filter((_, idx) => idx !== deleteModal.index));
      setDeleteModal({ isOpen: false, index: null, itemName: '' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveTeam(members);
      toast.success('Team data saved to Firestore!');
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminLayout title="Manage Team Members">
      <PageTitle title="Admin | Team" />
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        {/* Top action bar */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={addMember}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-purple-600 text-slate-900 hover:text-purple-600 font-bold px-5 py-2.5 rounded-2xl text-sm transition-all shadow-sm hover:shadow-xl active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            Add Team Member
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-8 py-2.5 rounded-2xl text-sm transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
          >
            {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {saving ? 'Saving...' : 'Update Team Profiles'}
          </button>
        </div>

        {loading ? (
          <div className="h-48 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {members.map((m, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm transition-all hover:shadow-lg group overflow-hidden">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-purple-100">
                      {m.image ? (
                        <img src={m.image} alt={m.name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-bold text-lg">{m.name || 'New Member'}</h3>
                      <p className="text-purple-600 text-[10px] font-black uppercase tracking-widest mt-0.5">{m.role || 'Personnel Profile'}</p>
                    </div>
                  </div>
                  {members.length > 1 && (
                    <button type="button" onClick={() => removeMember(i)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100" title="Remove Member">
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
                  ].map(({ label, field, placeholder }) => (
                    <div key={field}>
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">{label}</label>
                      <input value={m[field]} onChange={(e) => handleChange(i, field, e.target.value)} placeholder={placeholder} className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                  ))}

                  {/* Profile Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Profile Image</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(i, e.target.files[0])}
                        className="flex-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                      />
                      {uploadProgress[i] != null && (
                        <div className="text-xs font-bold text-blue-600">{uploadProgress[i]}%</div>
                      )}
                    </div>
                    {m.image && <p className="text-xs text-green-600 mt-1 font-medium truncate">✓ {m.image}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Biography</label>
                    <textarea value={m.bio} onChange={(e) => handleChange(i, 'bio', e.target.value)} rows={4} placeholder="Short description highlighting professional background..." className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, index: null, itemName: '' })} 
        onConfirm={confirmDeleteMember}
        title="Confirm Deletion"
        message={
          <>
            Are you sure you want to delete this item <span className="font-bold text-slate-900">"{deleteModal.itemName}"</span>?
            <div className="text-slate-400 text-xs mt-2">This action cannot be undone.</div>
          </>
        }
      />
    </AdminLayout>
    </>
  );
};

export default AdminTeam;
