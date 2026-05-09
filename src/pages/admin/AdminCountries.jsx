import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminCountries, saveAdminCountries } from '../../firebase/firestore';
import { uploadFile, deleteFileByUrl, getFileNameFromUrl } from '../../firebase/storage';
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
  whyChooseUs: ['', '', '', '', ''],
  recognitionTitle: 'Global Recognition',
  globalRecognitionDescription: '',
  globalRecognition: ['', '', ''],
  services: [
    { title: '', description: '' },
    { title: '', description: '' },
    { title: '', description: '' }
  ],
  universitiesTitle: 'Top Medical Institutions',
  countryCardPosition: '',
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
  const [isServicesOpen, setIsServicesOpen] = useState(false);

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
    setIsServicesOpen(false);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditIndex(-1);
    setTempCountry(JSON.parse(JSON.stringify(emptyCountry)));
    setIsServicesOpen(false);
    setIsModalOpen(true);
  };

  const saveModalToState = async () => {
    // 1. Validation
    if (!tempCountry.name?.trim()) return toast.error('Country Name is mandatory');
    if (!tempCountry.flag?.trim()) return toast.error('Country Flag is mandatory');
    if (!tempCountry.title?.trim()) return toast.error('Hero Title is mandatory');
    if (!tempCountry.subtitle?.trim()) return toast.error('Subtitle is mandatory');
    if (!tempCountry.description?.trim()) return toast.error('Description is mandatory');
    // Country Card Position is now optional (allows hiding from Countries page globe)
    // if (!tempCountry.countryCardPosition) return toast.error('Country Card Position is mandatory');

    // Universities Validation
    if (tempCountry.universities?.length > 0) {
      for (let i = 0; i < tempCountry.universities.length; i++) {
        const uni = tempCountry.universities[i];
        const num = (i + 1).toString().padStart(2, '0');
        if (!uni.name?.trim()) return toast.error(`University ${num}: Name is mandatory`);
        if (!uni.image?.trim()) return toast.error(`University ${num}: Image is mandatory`);
        if (!uni.description?.trim()) return toast.error(`University ${num}: Information is mandatory`);
        if (!uni.highlightText?.trim()) return toast.error(`University ${num}: Highlight is mandatory`);
        if (!uni.points || uni.points.some(p => !p?.trim())) return toast.error(`University ${num}: All 3 points are mandatory`);
      }
    }

    // Services Validation
    if (tempCountry.services?.some(s => !s.title?.trim() || !s.description?.trim())) {
      return toast.error('All 3 Service titles and descriptions are mandatory');
    }

    // Why Choose Us
    if (tempCountry.whyChooseUs?.some(p => !p?.trim())) {
      return toast.error('All 5 Why Choose Us points are mandatory');
    }

    // Clean up redundant fields
    const {
      countrycardpostion,
      countryCardPositionClasses,
      flagPosition,
      flagPositionClasses,
      ...cleanedCountry
    } = tempCountry;

    const updated = [...entries];
    if (editIndex === -1) {
      updated.push(cleanedCountry);
    } else {
      updated[editIndex] = cleanedCountry;
    }

    setSaving(true);

    try {
      let finalFlag = tempCountry.flag;
      if (tempCountry.flagPendingFile) {
        finalFlag = await uploadFile(
          tempCountry.flagPendingFile,
          `flags/${Date.now()}_${tempCountry.flagPendingFile.name}`,
          (p) => setUploadProgress(prev => ({ ...prev, modal_flag: p }))
        );
      }

      const finalUnis = await Promise.all((tempCountry.universities || []).map(async (uni, idx) => {
        if (uni.pendingFile) {
          const url = await uploadFile(
            uni.pendingFile,
            `universities/${Date.now()}_${uni.pendingFile.name}`,
            (p) => setUploadProgress(prev => ({ ...prev, [`uni_${idx}_img`]: p }))
          );
          const { pendingFile, ...rest } = uni;
          return { ...rest, image: url };
        }
        return uni;
      }));

      const cleanedTemp = { 
        ...tempCountry, 
        flag: finalFlag, 
        universities: finalUnis 
      };
      delete cleanedTemp.flagPendingFile;

      // Clean up redundant fields
      const {
        countrycardpostion,
        countryCardPositionClasses,
        flagPosition,
        flagPositionClasses,
        ...cleanedCountry
      } = cleanedTemp;

      const updated = [...entries];
      if (editIndex === -1) {
        updated.push(cleanedCountry);
      } else {
        updated[editIndex] = cleanedCountry;
      }

      // Cleanup old images from Storage
      if (editIndex !== -1) {
        const oldCountry = entries[editIndex];
        const oldImages = [
          oldCountry.flag,
          ...(oldCountry.universities || []).map(u => u.image)
        ].filter(url => url && typeof url === 'string' && url.includes('firebasestorage'));

        const newImages = [
          cleanedCountry.flag,
          ...(cleanedCountry.universities || []).map(u => u.image)
        ];

        const toDelete = oldImages.filter(url => !newImages.includes(url));
        await Promise.all(toDelete.map(url => deleteFileByUrl(url)));
      }

      await saveAdminCountries(updated);
      setEntries(updated);
      setInitialEntries(JSON.parse(JSON.stringify(updated)));
      setHasChanges(false);
      setUploadProgress({});
      setIsModalOpen(false);
      toast.success(editIndex === -1 ? 'Country created and synced!' : 'Changes synced to database!');
    } catch (err) {
      console.error('Immediate Sync Error:', err);
      toast.error('Failed to sync changes to database. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTempChange = (field, val) => {
    setTempCountry(prev => ({ 
      ...prev, 
      [field]: val,
      ...(field === 'flag' ? { flagPendingFile: null } : {})
    }));
  };

  const handleTempArrayChange = (field, idx, val) => {
    const updated = [...tempCountry[field]];
    updated[idx] = val;
    setTempCountry(prev => ({ ...prev, [field]: updated }));
  };

  const addPointToTemp = (field) => {
    if (field === 'whyChooseUs' && (tempCountry.whyChooseUs?.length || 0) >= 6) {
      toast.error('Maximum 6 "Why Choose Us" points allowed.');
      return;
    }
    setTempCountry(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
  };

  const removePointFromTemp = (field, idx) => {
    setTempCountry(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));
  };

  const handleUniChange = (uniIdx, field, val) => {
    const unis = [...tempCountry.universities];
    unis[uniIdx][field] = val;
    if (field === 'image') unis[uniIdx].pendingFile = null;
    setTempCountry(prev => ({ ...prev, universities: unis }));
  };

  const addUniversity = () => {
    setTempCountry(prev => ({
      ...prev,
      universities: [...(prev.universities || []), JSON.parse(JSON.stringify(emptyUniversity))]
    }));
  };

  const removeUniversityLocal = (uniIdx) => {
    setDeleteModal({
      isOpen: true,
      countryIndex: null,
      uniIndex: uniIdx,
      itemName: tempCountry.universities[uniIdx].name || `University #${uniIdx + 1}`
    });
  };

  const handleFileSelection = (file, field, uniIdx = null) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    if (uniIdx !== null) {
      const unis = [...tempCountry.universities];
      unis[uniIdx].image = previewUrl;
      unis[uniIdx].pendingFile = file;
      setTempCountry(prev => ({ ...prev, universities: unis }));
    } else {
      setTempCountry(prev => ({
        ...prev,
        [field]: previewUrl,
        [`${field}PendingFile`]: file
      }));
    }
  };

  const removeEntry = (i) => {
    setDeleteModal({ isOpen: true, countryIndex: i, uniIndex: null, itemName: entries[i].name || `Country #${i + 1}` });
  };

  const confirmDelete = () => {
    if (deleteModal.countryIndex !== null) {
      setEntries(entries.filter((_, idx) => idx !== deleteModal.countryIndex));
    } else if (deleteModal.uniIndex !== null) {
      setTempCountry(prev => ({
        ...prev,
        universities: prev.universities.filter((_, i) => i !== deleteModal.uniIndex)
      }));
    }
    setDeleteModal({ isOpen: false, countryIndex: null, uniIndex: null, itemName: '' });
  };

  const handleFinalSave = async () => {
    if (entries.length === 0) {
      const confirmWipe = window.confirm('Warning: Your country list is empty. Saving will delete all countries from the database. Proceed?');
      if (!confirmWipe) return;
    }
    setSaving(true);
    try {
      // Cleanup old images from Storage (for deleted countries)
      const oldImages = initialEntries.flatMap(c => [
        c.flag,
        ...(c.universities || []).map(u => u.image)
      ]).filter(url => url && typeof url === 'string' && url.includes('firebasestorage'));

      const newImages = entries.flatMap(c => [
        c.flag,
        ...(c.universities || []).map(u => u.image)
      ]);

      const toDelete = oldImages.filter(url => !newImages.includes(url));
      await Promise.all(toDelete.map(url => deleteFileByUrl(url)));

      await saveAdminCountries(entries);
      setInitialEntries(JSON.parse(JSON.stringify(entries)));
      setHasChanges(false);
      setUploadProgress({});
      toast.success('All data synced to Database!');
    } catch (err) {
      console.error('Final Save sync error:', err);
      toast.error('Failed to sync. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const saveAction = (
    <button
      onClick={handleFinalSave}
      disabled={saving || loading || !hasChanges}
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
      <AdminLayout title="Manage Countries Page" isDirty={hasChanges} actions={saveAction}>
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
                disabled={entries.length >= 5}
                className={`flex items-center gap-2 font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-sm active:scale-95 border ${entries.length >= 5
                    ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                    : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-blue-600 text-slate-900 hover:text-blue-600 hover:shadow-xl'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                {entries.length >= 5 ? 'Country Limit Reached (5)' : 'Add New Country'}
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-20">SR NO</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Country</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Card Position</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Headline</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Unis</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={6} className="px-8 py-10"><div className="h-12 bg-slate-100 rounded-2xl w-full" /></td>
                      </tr>
                    ))
                  ) : entries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
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
                        <span className="text-[10px] font-black text-slate-400">{(i + 1).toString().padStart(2, '0')}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                            {country.flag ? <img src={country.flag} alt="" className="w-full h-full object-cover" /> : <span className="text-slate-300 font-black">#{(i + 1)}</span>}
                          </div>
                          <div>
                            <p className="text-slate-900 font-black text-sm">{country.name || 'Untitled Country'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest border border-slate-200/50">
                          {country.countryCardPosition || 'Default'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-slate-600 text-xs font-bold truncate max-w-xs">{country.title || 'No title set'}</p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase border border-blue-100/50 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                          {country.universities?.length || 0}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditModal(i); }}
                            className="p-2.5 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeEntry(i); }}
                            className="p-2.5 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-90"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
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
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editIndex === -1 ? 'Add New Country' : `Edit ${tempCountry.name}`}</h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-1">Configure Destination Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 rounded-2xl hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-12">

                {/* 1. Identity & Hero Card */}
                <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    <div className="md:col-span-4 lg:col-span-3">
                      <div className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-4 shadow-sm">
                        <div className="w-20 h-20 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                          {tempCountry.flag ? (
                            <div className="relative w-full h-full group/flag">
                              <img src={tempCountry.flag} alt="" className="w-full h-full object-cover" />
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Remove country flag?')) {
                                    setTempCountry(prev => ({ ...prev, flag: '', flagPendingFile: null }));
                                  }
                                }}
                                className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover/flag:opacity-100 transition-opacity z-20 shadow-lg border border-white/20"
                                title="Remove Flag"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                              </button>
                            </div>
                          ) : (
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                          )}
                          <label className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                            <input type="file" accept="image/*" onChange={(e) => handleFileSelection(e.target.files[0], 'flag')} className="hidden" />
                          </label>
                        </div>
                        <div className="w-full space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center block">Flag Image URL *</label>
                          <input value={tempCountry.flagPendingFile ? tempCountry.flagPendingFile.name : getFileNameFromUrl(tempCountry.flag)} onChange={(e) => handleTempChange('flag', e.target.value)} placeholder="URL..." className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-bold outline-none focus:border-blue-500" />
                          {uploadProgress['modal_flag'] && <div className="h-1 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress['modal_flag']}%` }}></div></div>}
                        </div>

                        <div className="w-full space-y-1.5 pt-2 border-t border-slate-100">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center block">Country Card Position *</label>
                          <select
                            value={tempCountry.countryCardPosition || ''}
                            onChange={(e) => {
                              const label = e.target.value;
                              setTempCountry(prev => ({
                                ...prev,
                                countryCardPosition: label
                              }));
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-[10px] font-black uppercase tracking-wider outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50 transition-all"
                          >
                            {(() => {
                              const usedPositions = entries
                                .filter((_, idx) => idx !== editIndex)
                                .map(c => (c.countryCardPosition || c.countrycardpostion || '').toLowerCase())
                                .filter(Boolean);

                              return [
                                { val: '', label: 'Select Location' },
                                { val: 'top left', label: 'Top Left' },
                                { val: 'top right', label: 'Top Right' },
                                { val: 'bottom', label: 'Bottom' },
                                { val: 'bottom left', label: 'Bottom Left' },
                                { val: 'bottom right', label: 'Bottom Right' }
                              ]
                                .map(pos => (
                                  <option
                                    key={pos.val}
                                    value={pos.val}
                                    disabled={pos.val !== '' && usedPositions.includes(pos.val.toLowerCase())}
                                  >
                                    {pos.label}
                                  </option>
                                ));
                            })()}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-8 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Country Name *</label>
                        <input value={tempCountry.name} onChange={(e) => handleTempChange('name', e.target.value)} placeholder="e.g. Russia" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Title *</label>
                        <input value={tempCountry.title} onChange={(e) => handleTempChange('title', e.target.value)} placeholder="e.g. Study MBBS in Russia" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subtitle *</label>
                        <input value={tempCountry.subtitle} onChange={(e) => handleTempChange('subtitle', e.target.value)} placeholder="e.g. World Class Medical Education" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Country Description *</label>
                        <textarea value={tempCountry.description} onChange={(e) => handleTempChange('description', e.target.value)} rows={3} placeholder="Tell about the country's education..." className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Why Choose Us within first card */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Why Choose Us Section *</label>
                      <button 
                        onClick={() => addPointToTemp('whyChooseUs')} 
                        className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${tempCountry.whyChooseUs?.length >= 6 ? 'text-slate-300 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-50'}`}
                        disabled={tempCountry.whyChooseUs?.length >= 6}
                      >
                        + Add Point
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tempCountry.whyChooseUs?.map((point, pIdx) => (
                        <div key={pIdx} className="relative group">
                          <input value={point} onChange={(e) => handleTempArrayChange('whyChooseUs', pIdx, e.target.value)} placeholder={`Point ${pIdx + 1}`} className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 text-xs font-bold outline-none focus:border-blue-500 transition-all pr-12" />
                          <button onClick={() => removePointFromTemp('whyChooseUs', pIdx)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Services Registry Card */}
                <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-300">
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="w-full p-8 flex items-center justify-between hover:bg-slate-100/50 transition-colors"
                  >
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight text-left">Our Services</h3>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5 text-left">Define your destination-specific support</p>
                    </div>
                    <div className={`p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                          {[0, 1, 2].map((idx) => (
                            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 space-y-4 shadow-sm hover:shadow-md transition-all group">
                              <div className="border-b border-slate-50 pb-3">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service {idx + 1}</span>
                              </div>
                              <div className="space-y-4">
                                <div className="space-y-1.5">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Title *</label>
                                  <input
                                    value={tempCountry.services?.[idx]?.title || ''}
                                    onChange={(e) => {
                                      const srvs = [...(tempCountry.services || [{ title: '', description: '' }, { title: '', description: '' }, { title: '', description: '' }])];
                                      srvs[idx] = { ...srvs[idx], title: e.target.value };
                                      handleTempChange('services', srvs);
                                    }}
                                    placeholder="e.g. Visa Support"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Description *</label>
                                  <textarea
                                    value={tempCountry.services?.[idx]?.description || ''}
                                    onChange={(e) => {
                                      const srvs = [...(tempCountry.services || [{ title: '', description: '' }, { title: '', description: '' }, { title: '', description: '' }])];
                                      srvs[idx] = { ...srvs[idx], description: e.target.value };
                                      handleTempChange('services', srvs);
                                    }}
                                    rows={3}
                                    placeholder="Explain the service..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-medium outline-none focus:bg-white focus:border-blue-500 transition-all resize-none leading-relaxed"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Secondary Information Card */}
                <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Section Title *</label>
                      <input value={tempCountry.recognitionTitle || ''} onChange={(e) => handleTempChange('recognitionTitle', e.target.value)} placeholder="e.g. Global Recognition" className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Section Description *</label>
                      <textarea value={tempCountry.globalRecognitionDescription} onChange={(e) => handleTempChange('globalRecognitionDescription', e.target.value)} rows={1} placeholder="Intro text for this section..." className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[0, 1, 2].map((idx) => (
                      <div key={idx} className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Point {idx + 1} *</label>
                        <input value={tempCountry.globalRecognition?.[idx] || ''} onChange={(e) => handleTempArrayChange('globalRecognition', idx, e.target.value)} placeholder="..." className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-blue-500 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Universities Registry Card */}
                <div className="bg-white rounded-[2rem] p-8 border-2 border-slate-100 space-y-8 shadow-sm">
                  <div className="flex flex-col gap-4 pb-6 border-b border-slate-50">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">University Section Title *</label>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="flex-1 w-full">
                        <input
                          value={tempCountry.universitiesTitle || ''}
                          onChange={(e) => handleTempChange('universitiesTitle', e.target.value)}
                          placeholder="e.g. Universities Registry"
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-lg font-black tracking-tight focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                        />
                      </div>
                      <button onClick={addUniversity} className="whitespace-nowrap bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.1em] px-8 py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                        Add University
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-12">
                    {tempCountry.universities?.map((uni, uIdx) => (
                      <div key={uIdx} className="bg-slate-50 rounded-[2.5rem] p-8 sm:p-10 border border-slate-200 relative group/uni shadow-sm hover:shadow-md transition-shadow">
                        <button
                          onClick={() => removeUniversityLocal(uIdx)}
                          className="absolute -top-4 -right-4 z-20 p-3 bg-white border border-slate-100 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl shadow-xl transition-all active:scale-90"
                          title="Delete University"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                        </button>

                        <div className="flex flex-col gap-8">
                          {/* Top: Full Width Image Section */}
                          <div className="relative w-full h-64 bg-white rounded-3xl border-2 border-dashed border-slate-200 overflow-hidden group/img">
                            {uni.image ? (
                              <div className="relative w-full h-full group/img">
                                <img src={uni.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('Remove university cover image?')) {
                                      handleUniChange(uIdx, 'image', '');
                                    }
                                  }}
                                  className="absolute top-4 right-4 p-2.5 bg-red-500/90 backdrop-blur-sm text-white rounded-xl opacity-0 group-hover/img:opacity-100 transition-all z-20 shadow-xl border border-white/30 hover:bg-red-600 active:scale-90"
                                  title="Remove University Image"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                                </button>
                              </div>
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2 bg-slate-50/50">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2-2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Upload University Cover</span>
                              </div>
                            )}

                            {/* Numbering - Top Left */}
                            <div className="absolute top-6 left-8 pointer-events-none">
                              <span className="text-3xl font-black text-white/80 tracking-tighter drop-shadow-md">
                                {(uIdx + 1).toString().padStart(2, '0')}
                              </span>
                            </div>

                            {/* URL Overlay - Top Right */}
                            <div className="absolute top-4 right-4 w-72 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl opacity-0 group-hover/img:opacity-100 transition-all z-10">
                              <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">University Image URL</label>
                              <div className="flex gap-2">
                                <input
                                  value={uni.pendingFile ? uni.pendingFile.name : getFileNameFromUrl(uni.image)}
                                  onChange={(e) => handleUniChange(uIdx, 'image', e.target.value)}
                                  placeholder="Paste URL..."
                                  className="flex-1 bg-white border border-slate-100 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-blue-500 shadow-inner"
                                />
                                <label className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                                  <input type="file" accept="image/*" onChange={(e) => handleFileSelection(e.target.files[0], 'image', uIdx)} className="hidden" />
                                </label>
                              </div>
                              {uploadProgress[`uni_${uIdx}_img`] && <div className="mt-2 h-1 bg-blue-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress[`uni_${uIdx}_img`]}%` }}></div></div>}
                            </div>
                          </div>

                          {/* Below: Fields Stacking */}
                            <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Name of University *</label>
                              <input value={uni.name} onChange={(e) => handleUniChange(uIdx, 'name', e.target.value)} placeholder="e.g. Kazan Federal University" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-500 transition-all shadow-sm" />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Information *</label>
                              <textarea value={uni.description} onChange={(e) => handleUniChange(uIdx, 'description', e.target.value)} rows={4} placeholder="Detailed intro about campus life, academics..." className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-500 transition-all resize-none shadow-sm" />
                            </div>

                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">University Highlight *</label>
                              <textarea value={uni.highlightText} onChange={(e) => handleUniChange(uIdx, 'highlightText', e.target.value)} rows={2} placeholder="e.g. 150+ Years Old medical tradition..." className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-500 transition-all resize-none shadow-sm" />
                            </div>

                            {/* Points in one row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[0, 1, 2].map((pIdx) => (
                                <div key={pIdx} className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Point {pIdx + 1} *</label>
                                  <input
                                    value={uni.points?.[pIdx] || ''}
                                    onChange={(e) => {
                                      const ps = [...uni.points];
                                      ps[pIdx] = e.target.value;
                                      handleUniChange(uIdx, 'points', ps);
                                    }}
                                    placeholder="Key benefit..."
                                    className="w-full bg-white border border-slate-200 rounded-xl px-5 py-4 text-xs font-bold outline-none focus:border-blue-500 transition-all shadow-sm"
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
                  disabled={saving}
                  className="disabled:opacity-50 disabled:cursor-not-allowed text-white font-black px-10 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)' }}
                >
                  {saving && <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  {saving ? 'Syncing with DB...' : (editIndex === -1 ? 'Create & Sync to Database' : 'Update & Sync to Database')}
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
