import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminCountries, saveAdminCountries } from '../../firebase/firestore';
import { uploadFile } from '../../firebase/storage';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';
import DeleteModal from '../../components/admin/DeleteModal';
import { motion, AnimatePresence } from 'framer-motion';

const emptyUniversity = { 
  name: '', 
  image: '', 
  description: '', 
  highlightText: '', 
  points: ['', '', ''] 
};

const emptyCountry = { 
  name: '', 
  flag: '', 
  title: '', 
  subtitle: '', 
  description: '', 
  whyChooseUs: ['', '', ''], 
  globalRecognitionDescription: '', 
  globalRecognition: ['', '', ''], 
  universities: [] 
};

const AdminCountries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [initialEntries, setInitialEntries] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, countryIndex: null, uniIndex: null, itemName: '' });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [tempCountry, setTempCountry] = useState(null);

  useEffect(() => {
    getAdminCountries().then((data) => {
      const sanitized = data && data.length > 0 ? data : [];
      setEntries(sanitized);
      setInitialEntries(JSON.parse(JSON.stringify(sanitized)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && initialEntries) {
      setHasChanges(JSON.stringify(entries) !== JSON.stringify(initialEntries));
    }
  }, [entries, loading, initialEntries]);

  // Modal Actions
  const openEditModal = (index) => {
    setEditIndex(index);
    setTempCountry(JSON.parse(JSON.stringify(entries[index])));
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditIndex(-1);
    setTempCountry(JSON.parse(JSON.stringify(emptyCountry)));
    setIsModalOpen(true);
  };

  const saveModalToState = () => {
    const updated = [...entries];
    if (editIndex === -1) {
      updated.push(tempCountry);
    } else {
      updated[editIndex] = tempCountry;
    }
    setEntries(updated);
    setIsModalOpen(false);
    toast.success(editIndex === -1 ? 'Country added to list!' : 'Changes kept!');
  };

  const handleTempChange = (field, val) => {
    setTempCountry(prev => ({ ...prev, [field]: val }));
  };

  const handleTempArrayChange = (field, idx, val) => {
    const updated = [...tempCountry[field]];
    updated[idx] = val;
    setTempCountry(prev => ({ ...prev, [field]: updated }));
  };

  const addPointToTemp = (field) => {
    setTempCountry(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removePointFromTemp = (field, idx) => {
    setTempCountry(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  const handleUniChange = (uniIdx, field, val) => {
    const unis = [...tempCountry.universities];
    unis[uniIdx][field] = val;
    setTempCountry(prev => ({ ...prev, universities: unis }));
  };

  const addUniversity = () => {
    setTempCountry(prev => ({ 
      ...prev, 
      universities: [...(prev.universities || []), JSON.parse(JSON.stringify(emptyUniversity))] 
    }));
  };

  const removeUniversityLocal = (uniIdx) => {
    setTempCountry(prev => ({ 
      ...prev, 
      universities: prev.universities.filter((_, i) => i !== uniIdx) 
    }));
  };

  const handleImageUpload = async (file, pathPrefix, onComplete, progressKey) => {
    if (!file) return;
    const path = `${pathPrefix}/${Date.now()}_${file.name}`;
    try {
      const url = await uploadFile(file, path, (progress) => {
        setUploadProgress((prev) => ({ ...prev, [progressKey]: progress }));
      });
      onComplete(url);
      setUploadProgress((prev) => ({ ...prev, [progressKey]: null }));
      toast.success('Image uploaded!');
    } catch {
      toast.error('Image upload failed.');
      setUploadProgress((prev) => ({ ...prev, [progressKey]: null }));
    }
  };

  const removeEntry = (i) => {
    setDeleteModal({ isOpen: true, countryIndex: i, uniIndex: null, itemName: entries[i].name || `Country #${i + 1}` });
  };

  const confirmDelete = () => {
    const { countryIndex } = deleteModal;
    setEntries(entries.filter((_, idx) => idx !== countryIndex));
    setDeleteModal({ isOpen: false, countryIndex: null, uniIndex: null, itemName: '' });
  };

  const handleFinalSave = async () => {
    setSaving(true);
    try {
      await saveAdminCountries(entries);
      setInitialEntries(JSON.parse(JSON.stringify(entries)));
      setHasChanges(false);
      toast.success('All data synced to Database!');
    } catch {
      toast.error('Failed to sync. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminLayout title="Destination Management" isDirty={hasChanges}>
        <PageTitle title="Admin | Countries" />
        
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Countries</h2>
              <p className="text-slate-500 text-xs font-medium">Manage destinations and university details</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-600 text-slate-900 hover:text-blue-600 font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-sm hover:shadow-xl active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                Add New Country
              </button>
              <button 
                onClick={handleFinalSave}
                disabled={saving || loading || !hasChanges}
                className="disabled:opacity-50 disabled:cursor-not-allowed text-white font-black px-8 py-3 rounded-2xl text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}
              >
                {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {saving ? 'Syncing...' : 'Save All Changes'}
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Country Info</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Headline</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Unis</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-10"><div className="h-12 bg-slate-100 rounded-2xl w-full" /></td>
                      </tr>
                    ))
                  ) : entries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <p className="text-slate-400 font-bold">No countries found. Click "Add New Country" to start.</p>
                      </td>
                    </tr>
                  ) : entries.map((country, i) => (
                    <tr 
                      key={i} 
                      onClick={() => openEditModal(i)}
                      className="group hover:bg-blue-50/30 cursor-pointer transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                            {country.flag ? <img src={country.flag} alt="" className="w-full h-full object-cover" /> : <span className="text-slate-300 font-black">#{(i+1)}</span>}
                          </div>
                          <div>
                            <p className="text-slate-900 font-black text-sm">{country.name || 'Untitled Country'}</p>
                            <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mt-0.5 opacity-60">Configured</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-slate-600 text-xs font-bold truncate max-w-xs">{country.title || 'No title set'}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                          {country.universities?.length || 0} Universities
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditModal(i); }}
                            className="p-2.5 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeEntry(i); }}
                            className="p-2.5 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </AdminLayout>

      {/* --- Country Edit Modal --- */}
      <AnimatePresence>
        {isModalOpen && tempCountry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-200">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editIndex === -1 ? 'Add New Client' : `Edit ${tempCountry.name}`}</h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-1">Configure Destination Details</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-12">
                
                {/* Top Row: Flag & Country Identity */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  <div className="md:col-span-4 lg:col-span-3">
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                        {tempCountry.flag ? (
                          <img src={tempCountry.flag} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                        )}
                        <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'flags', (url) => handleTempChange('flag', url), 'modal_flag')} className="hidden" />
                        </label>
                      </div>
                      <div className="w-full space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center block">Flag Image URL</label>
                        <input value={tempCountry.flag} onChange={(e) => handleTempChange('flag', e.target.value)} placeholder="URL..." className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold outline-none focus:border-blue-500" />
                        {uploadProgress['modal_flag'] && <div className="h-1 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress['modal_flag']}%` }}></div></div>}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Country Name *</label>
                      <input value={tempCountry.name} onChange={(e) => handleTempChange('name', e.target.value)} placeholder="e.g. Russia" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Title</label>
                      <input value={tempCountry.title} onChange={(e) => handleTempChange('title', e.target.value)} placeholder="e.g. Study MBBS in Russia" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subtitle</label>
                      <input value={tempCountry.subtitle} onChange={(e) => handleTempChange('subtitle', e.target.value)} placeholder="e.g. World Class Medical Education" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Country Description</label>
                      <textarea value={tempCountry.description} onChange={(e) => handleTempChange('description', e.target.value)} rows={3} placeholder="Tell about the country's education..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none" />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-50" />

                {/* 3. Global Recognition */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Global Recognition Overview</label>
                    <textarea value={tempCountry.globalRecognitionDescription} onChange={(e) => handleTempChange('globalRecognitionDescription', e.target.value)} rows={3} placeholder="Intro text for recognition section..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recognition Point {idx+1}</label>
                        <textarea value={tempCountry.globalRecognition?.[idx] || ''} onChange={(e) => handleTempArrayChange('globalRecognition', idx, e.target.value)} rows={3} placeholder="..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-500 transition-all resize-none" />
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-50" />

                {/* 4. Why Choose Us */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Why Choose Us / Key Benefits</label>
                    <button onClick={() => addPointToTemp('whyChooseUs')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-lg transition-all">+ Add Benefit Point</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tempCountry.whyChooseUs?.map((point, pIdx) => (
                      <div key={pIdx} className="relative group">
                        <input value={point} onChange={(e) => handleTempArrayChange('whyChooseUs', pIdx, e.target.value)} placeholder={`Benefit ${pIdx + 1}`} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-xs font-bold outline-none focus:border-blue-500 transition-all pr-12" />
                        <button onClick={() => removePointFromTemp('whyChooseUs', pIdx)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="border-slate-50" />

                {/* 5. Universities Section */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs shadow-lg shadow-blue-100">🎓</span> Universities Registry
                      </h3>
                      <p className="text-slate-400 text-[10px] font-medium mt-1">Manage individual medical institutions in this country.</p>
                    </div>
                    <button onClick={addUniversity} className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-95 flex items-center gap-2">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                      Register New Uni
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {tempCountry.universities?.map((uni, uIdx) => (
                      <div key={uIdx} className="bg-slate-50 rounded-[2rem] p-6 sm:p-8 border border-slate-100 relative group/uni">
                        <button 
                          onClick={() => removeUniversityLocal(uIdx)}
                          className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/uni:opacity-100 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                          {/* Uni Left: Meta */}
                          <div className="md:col-span-3 space-y-4">
                            <div className="w-full h-40 rounded-2xl bg-white border border-slate-200 overflow-hidden relative group/img">
                              {uni.image ? (
                                <img src={uni.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                                  <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                                </div>
                              )}
                              <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0], 'universities', (url) => handleUniChange(uIdx, 'image', url), `uni_${uIdx}_img`)} className="hidden" />
                              </label>
                            </div>
                            {uploadProgress[`uni_${uIdx}_img`] && <div className="h-1 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress[`uni_${uIdx}_img`]}%` }}></div></div>}
                            <input value={uni.image} onChange={(e) => handleUniChange(uIdx, 'image', e.target.value)} placeholder="Direct Image URL" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none" />
                          </div>

                          {/* Uni Right: Info */}
                          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">University Name</label>
                              <input value={uni.name} onChange={(e) => handleUniChange(uIdx, 'name', e.target.value)} placeholder="e.g. Kazan Federal University" className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-xs font-bold outline-none focus:border-blue-500 transition-all" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Highlight Badge</label>
                              <input value={uni.highlightText} onChange={(e) => handleUniChange(uIdx, 'highlightText', e.target.value)} placeholder="e.g. 150+ Years Old" className="w-full bg-blue-50 text-blue-700 border border-blue-100 rounded-xl px-5 py-3 text-xs font-black outline-none transition-all placeholder:text-blue-300" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                              <textarea value={uni.description} onChange={(e) => handleUniChange(uIdx, 'description', e.target.value)} rows={3} placeholder="Detailed intro about the campus, history..." className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-xs font-bold outline-none focus:border-blue-500 transition-all resize-none" />
                            </div>
                            
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[0, 1, 2].map((pIdx) => (
                                <div key={pIdx} className="space-y-1.5">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">USP {pIdx+1}</label>
                                  <input 
                                    value={uni.points?.[pIdx] || ''} 
                                    onChange={(e) => {
                                      const ps = [...uni.points];
                                      ps[pIdx] = e.target.value;
                                      handleUniChange(uIdx, 'points', ps);
                                    }} 
                                    placeholder="Key benefit..." 
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none focus:border-blue-500" 
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!tempCountry.universities || tempCountry.universities.length === 0) && (
                      <div className="text-center py-10 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 text-xs font-bold">No universities registered for this country.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveModalToState}
                  className="text-white font-black px-10 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 hover:-translate-y-0.5 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}
                >
                  {editIndex === -1 ? 'Create Country Entry' : 'Update & Keep Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, countryIndex: null, uniIndex: null, itemName: '' })} 
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={
          <>
            Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteModal.itemName}"</span>?
            <div className="text-slate-400 text-xs mt-2">This will remove it from the list. You must still click "Save All Changes" to sync with the database.</div>
          </>
        }
      />
    </>
  );
};

export default AdminCountries;
