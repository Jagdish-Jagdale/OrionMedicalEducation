import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getTeamAllData, saveTeamAllData } from '../../firebase/firestore';
import { uploadFile, deleteFileByUrl, getFileNameFromUrl } from '../../firebase/storage';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';
import DeleteModal from '../../components/admin/DeleteModal';
import { motion, AnimatePresence } from 'framer-motion';

const defaultStats = [
  { label: 'Years Experience', value: '7+' },
  { label: 'Country Specialists', value: '4' },
  { label: 'Student-First', value: '100%' },
  { label: 'Hidden Charges', value: '0' }
];

const emptyMember = { 
  name: '', 
  position: '', 
  description: '', 
  image: '', 
  status: 'Active', 
  expertise: ''
};

const AdminTeam = () => {
  const [members, setMembers] = useState([]);
  const [regionalExperts, setRegionalExperts] = useState([]);
  const [settings, setSettings] = useState({
    heroBadge: '',
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    stats: defaultStats,
    quote1: '',
    quote2: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('core'); // 'core' or 'regional'
  const [editIndex, setEditIndex] = useState(null);
  const [tempMember, setTempMember] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, index: null, itemName: '', type: 'core' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTeamAllData();
        
        if (data.core) setMembers(data.core);
        if (data.regional) setRegionalExperts(data.regional);
        if (data.hero || data.stats || data.quotes) {
          setSettings({
            heroBadge: data.hero?.badge || '',
            heroTitle: data.hero?.title || '',
            heroDescription: data.hero?.description || '',
            stats: (data.stats && data.stats.length > 0) ? data.stats : defaultStats,
            quote1: data.quotes?.quote1 || '',
            quote2: data.quotes?.quote2 || ''
          });
        }
        
        setInitialData(JSON.stringify({ members: data.core, regionalExperts: data.regional, settings: {
          heroBadge: data.hero?.badge || '',
          heroTitle: data.hero?.title || '',
          heroDescription: data.hero?.description || '',
          stats: (data.stats && data.stats.length > 0) ? data.stats : settings.stats,
          quote1: data.quotes?.quote1 || '',
          quote2: data.quotes?.quote2 || ''
        }}));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && initialData) {
      const current = JSON.stringify({ members, regionalExperts, settings });
      setHasChanges(current !== initialData);
    }
  }, [members, settings, loading, initialData]);

  const handleSettingsChange = (field, val) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleStatChange = (idx, field, val) => {
    const updatedStats = [...settings.stats];
    updatedStats[idx][field] = val;
    setSettings(prev => ({ ...prev, stats: updatedStats }));
  };

  const openAddModal = (type = 'core') => {
    setModalType(type);
    setEditIndex(-1);
    setTempMember({ ...emptyMember });
    setIsModalOpen(true);
  };

  const openEditModal = (index, type = 'core') => {
    setModalType(type);
    setEditIndex(index);
    const list = type === 'core' ? members : regionalExperts;
    setTempMember({ ...list[index] });
    setIsModalOpen(true);
  };

  const saveMemberModal = () => {
    if (modalType === 'core') {
      const updatedMembers = [...members];
      if (editIndex === -1) {
        updatedMembers.push(tempMember);
      } else {
        updatedMembers[editIndex] = tempMember;
      }
      setMembers(updatedMembers);
    } else {
      const updatedRegional = [...regionalExperts];
      if (editIndex === -1) {
        updatedRegional.push(tempMember);
      } else {
        updatedRegional[editIndex] = tempMember;
      }
      setRegionalExperts(updatedRegional);
    }
    setIsModalOpen(false);
    toast.success(editIndex === -1 ? 'Expert added to list' : 'Expert updated');
  };

  const handleFileSelection = (file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setTempMember(prev => ({
      ...prev,
      image: previewUrl,
      pendingFile: file
    }));
  };

  const handleFinalSave = async () => {
    setSaving(true);
    try {
      // 1. Upload pending images for Core Members
      const finalMembers = await Promise.all(members.map(async (m, idx) => {
        if (m.pendingFile) {
          const url = await uploadFile(
            m.pendingFile, 
            `team/${Date.now()}_${m.pendingFile.name}`, 
            (p) => setUploadProgress(prev => ({ ...prev, [`core_${idx}`]: p }))
          );
          const { pendingFile, ...rest } = m;
          return { ...rest, image: url };
        }
        return m;
      }));

      // 2. Upload pending images for Regional Experts
      const finalRegional = await Promise.all(regionalExperts.map(async (m, idx) => {
        if (m.pendingFile) {
          const url = await uploadFile(
            m.pendingFile, 
            `team/${Date.now()}_${m.pendingFile.name}`, 
            (p) => setUploadProgress(prev => ({ ...prev, [`reg_${idx}`]: p }))
          );
          const { pendingFile, ...rest } = m;
          return { ...rest, image: url };
        }
        return m;
      }));

      await saveTeamAllData({ 
        members: finalMembers, 
        regional: finalRegional, 
        settings 
      });

      // Cleanup old images from Storage
      try {
        const oldData = JSON.parse(initialData);
        const oldImages = [
          ...(oldData.members || []).map(m => m.image),
          ...(oldData.regionalExperts || []).map(m => m.image)
        ].filter(url => url && typeof url === 'string' && url.includes('firebasestorage'));

        const newImages = [
          ...finalMembers.map(m => m.image),
          ...finalRegional.map(m => m.image)
        ];

        const toDelete = oldImages.filter(url => !newImages.includes(url));
        await Promise.all(toDelete.map(url => deleteFileByUrl(url)));
      } catch (e) {
        console.error("Storage cleanup failed:", e);
      }

      setMembers(finalMembers);
      setRegionalExperts(finalRegional);
      setInitialData(JSON.stringify({ 
        members: finalMembers, 
        regionalExperts: finalRegional, 
        settings 
      }));
      setHasChanges(false);
      setUploadProgress({});
      toast.success('All team data synced to Database!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const removeMember = (i, type = 'core') => {
    const list = type === 'core' ? members : regionalExperts;
    setDeleteModal({ isOpen: true, index: i, itemName: list[i].name || `Expert #${i + 1}`, type });
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'core') {
      setMembers(members.filter((_, idx) => idx !== deleteModal.index));
    } else {
      setRegionalExperts(regionalExperts.filter((_, idx) => idx !== deleteModal.index));
    }
    setDeleteModal({ isOpen: false, index: null, itemName: '', type: 'core' });
  };

  const saveAction = (
    <button
      onClick={handleFinalSave}
      disabled={saving || loading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[100px] text-sm"
    >
      {saving ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Saving...
        </>
      ) : (
        'Save'
      )}
    </button>
  );

  return (
    <>
      <AdminLayout title="Manage Team Page" isDirty={hasChanges} actions={saveAction}>
        <PageTitle title="Admin | Team" />
        
        <div className="space-y-8">
          {/* Header Card: Hero Settings */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Team Hero Section</h2>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-0.5">Configure page header and introductory text</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Badge Title</label>
                <input value={settings.heroBadge} onChange={(e) => handleSettingsChange('heroBadge', e.target.value)} placeholder="e.g. THE PEOPLE BEHIND YOUR SUCCESS" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Heading</label>
                <input value={settings.heroTitle} onChange={(e) => handleSettingsChange('heroTitle', e.target.value)} placeholder="e.g. Meet the Experts" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Description</label>
                <textarea value={settings.heroDescription} onChange={(e) => handleSettingsChange('heroDescription', e.target.value)} rows={3} placeholder="Intro text for the team..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none" />
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Performance Stats</h2>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-0.5">Manage the 4 statistical impact cards</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {settings.stats.map((stat, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Stat {idx + 1} Label</label>
                    <input value={stat.label} onChange={(e) => handleStatChange(idx, 'label', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Stat {idx + 1} Value</label>
                    <input value={stat.value} onChange={(e) => handleStatChange(idx, 'value', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-indigo-600 outline-none focus:border-indigo-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quotes Card */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-inner">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Motivational Quotes</h2>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-0.5">Manage the two large call-to-action cards</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Quote 1 (White Card)</label>
                <textarea 
                  value={settings.quote1} 
                  onChange={(e) => handleSettingsChange('quote1', e.target.value)} 
                  rows={2} 
                  placeholder="e.g. We believe every student is unique..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all resize-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Quote 2 (Navy Card)</label>
                <textarea 
                  value={settings.quote2} 
                  onChange={(e) => handleSettingsChange('quote2', e.target.value)} 
                  rows={2} 
                  placeholder="e.g. Your dream is our responsibility." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none" 
                />
              </div>
            </div>
          </div>

          {/* Members Registry Card */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-inner">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Core Leadership & Experts</h2>
                  <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-0.5">Manage individual team member profiles</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => openAddModal('core')} className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl hover:bg-purple-600 transition-all shadow-xl shadow-purple-100 active:scale-95 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                  Add Team Member
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expert Info</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Position</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {members.map((m, i) => (
                    <tr key={i} onClick={() => openEditModal(i, 'core')} className="group hover:bg-purple-50/30 cursor-pointer transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-purple-200 transition-all relative">
                            {m.image ? <img src={m.image} alt="" className="w-full h-full object-cover" /> : <span className="text-slate-300 font-black">#{(i + 1)}</span>}
                            {uploadProgress[`core_${i}`] != null && (
                              <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10">
                                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[7px] font-black mt-1 text-purple-600">{uploadProgress[`core_${i}`]}%</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-slate-900 font-black text-sm">{m.name || 'Anonymous'}</p>
                            <p className="text-purple-600 text-[10px] font-black uppercase tracking-widest mt-0.5 opacity-60">{m.expertise || 'General Expert'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-600 text-xs font-bold">{m.position || 'Not Set'}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${m.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {m.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(i, 'core'); }} className="p-2.5 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); removeMember(i, 'core'); }} className="p-2.5 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic">No team members registered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional Experts Card */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.065M15 3a9 9 0 11-9 9 9 9 0 019-9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Our Regional Experts</h2>
                  <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-0.5">Manage regional and international expert network</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => openAddModal('regional')} className="bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                  Add Regional Expert
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expert Info</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Position</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {regionalExperts.map((m, i) => (
                    <tr key={i} onClick={() => openEditModal(i, 'regional')} className="group hover:bg-blue-50/30 cursor-pointer transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-blue-200 transition-all relative">
                            {m.image ? <img src={m.image} alt="" className="w-full h-full object-cover" /> : <span className="text-slate-300 font-black">#{(i + 1)}</span>}
                            {uploadProgress[`reg_${i}`] != null && (
                              <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center z-10">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[7px] font-black mt-1 text-blue-600">{uploadProgress[`reg_${i}`]}%</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-slate-900 font-black text-sm">{m.name || 'Anonymous'}</p>
                            <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-0.5 opacity-60">{m.expertise || 'Regional Specialist'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-600 text-xs font-bold">{m.position || 'Not Set'}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${m.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {m.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); openEditModal(i, 'regional'); }} className="p-2.5 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); removeMember(i, 'regional'); }} className="p-2.5 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {regionalExperts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold italic">No regional experts registered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* --- Member Add/Edit Modal --- */}
      <AnimatePresence>
        {isModalOpen && tempMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${modalType === 'core' ? 'bg-purple-600 shadow-purple-200' : 'bg-blue-600 shadow-blue-200'}`}>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editIndex === -1 ? (modalType === 'core' ? 'Onboard New Expert' : 'Add Regional Expert') : `Edit ${tempMember.name}`}</h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-1">Configure Personnel Profile Details</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  {/* Left Column: Image */}
                  <div className="md:col-span-4 space-y-6">
                    <div className="w-full aspect-square rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden relative group">
                      {tempMember.image ? (
                        <div className="relative w-full h-full group/member">
                          <img src={tempMember.image} alt="" className="w-full h-full object-cover" />
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Remove this photo?')) {
                                setTempMember(prev => ({ ...prev, image: '', pendingFile: null }));
                              }
                            }}
                            className="absolute top-4 right-4 p-2.5 bg-red-500/90 backdrop-blur-sm text-white rounded-xl opacity-0 group-hover/member:opacity-100 transition-all z-20 shadow-xl border border-white/30 hover:bg-red-600 active:scale-90"
                            title="Remove Photo"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                          </button>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2"><svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg><span className="text-[10px] font-black uppercase tracking-widest">No Profile Image</span></div>
                      )}
                      <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                        <input type="file" accept="image/*" onChange={(e) => handleFileSelection(e.target.files[0])} className="hidden" />
                      </label>
                    </div>
                    {uploadProgress['member_img'] && <div className="h-1 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress['member_img']}%` }}></div></div>}
                    <input value={tempMember.pendingFile ? tempMember.pendingFile.name : getFileNameFromUrl(tempMember.image)} onChange={(e) => setTempMember(p => ({ ...p, image: e.target.value, pendingFile: null }))} placeholder="Direct Image URL" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none" />
                  </div>

                  {/* Right Column: Fields */}
                  <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input value={tempMember.name} onChange={(e) => setTempMember(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Dr. Jane Smith" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Position / Role</label>
                      <input value={tempMember.position} onChange={(e) => setTempMember(p => ({ ...p, position: e.target.value }))} placeholder="e.g. Chief Medical Advisor" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Experties Area</label>
                      <input value={tempMember.expertise} onChange={(e) => setTempMember(p => ({ ...p, expertise: e.target.value }))} placeholder={modalType === 'core' ? "e.g. European Medical Laws" : "e.g. Regional Specialist"} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                      <input value={tempMember.status} onChange={(e) => setTempMember(p => ({ ...p, status: e.target.value }))} placeholder="e.g. Active" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Biography / Description</label>
                      <textarea value={tempMember.description} onChange={(e) => setTempMember(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Detailed professional overview..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50">
                <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Cancel</button>
                <button 
                  onClick={saveMemberModal} 
                  className={`text-white font-black px-10 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 ${modalType === 'core' ? 'shadow-purple-200' : 'shadow-blue-200'}`}
                  style={{ background: modalType === 'core' ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)' : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}
                >
                  {editIndex === -1 ? 'Confirm Onboarding' : 'Apply Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, index: null, itemName: '' })} 
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={
          <>
            Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteModal.itemName}"</span>?
            <div className="text-slate-400 text-xs mt-2">This will remove them from the registry. You must still click "Save All Profiles" to sync with the database.</div>
          </>
        }
      />
    </AdminLayout>
    </>
  );
};

export default AdminTeam;
