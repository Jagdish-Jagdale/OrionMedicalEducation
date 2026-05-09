import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReviews, saveReviews, getReviewsHeader, saveReviewsHeader } from '../../firebase/firestore';
import { uploadFile, deleteFileByUrl, getFileNameFromUrl } from '../../firebase/storage';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';
import DeleteModal from '../../components/admin/DeleteModal';

const emptyReview = { 
  parent: { name: '', review: '', image: '' },
  student: { name: '', review: '', image: '' },
};

const ReviewModal = ({ isOpen, onClose, review, onSave, index, uploadFile }) => {
  const [formData, setFormData] = useState(emptyReview);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    if (review) setFormData(JSON.parse(JSON.stringify(review)));
    else setFormData(emptyReview);
  }, [review, isOpen]);

  const handleChange = (section, field, val) => {
    setFormData(prev => ({
      ...prev,
      [section]: { 
        ...prev[section], 
        [field]: val,
        ...(field === 'image' ? { pendingFile: null } : {})
      }
    }));
  };

  const handleFileSelection = (section, file) => {
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], image: previewUrl, pendingFile: file }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative z-10 flex flex-col">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {index !== null ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">Dual Parent-Student Review Format</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Parent Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Parent Details</h4>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Parent Name</label>
                <input value={formData.parent.name} onChange={(e) => handleChange('parent', 'name', e.target.value)} placeholder="e.g. Mr. Rajesh Kumar" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Parent Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0 relative group/img">
                    {formData.parent.image ? (
                      <div className="relative w-full h-full">
                        <img src={formData.parent.image} className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Remove parent photo?')) {
                              handleChange('parent', 'image', '');
                            }
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity z-20 shadow-lg border border-white/20"
                          title="Remove Photo"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input type="file" accept="image/*" onChange={(e) => handleFileSelection('parent', e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
                    <input value={formData.parent.pendingFile ? formData.parent.pendingFile.name : getFileNameFromUrl(formData.parent.image)} onChange={(e) => handleChange('parent', 'image', e.target.value)} placeholder="Or paste image URL..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-bold focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Parent's Review Text</label>
                <textarea value={formData.parent.review} onChange={(e) => handleChange('parent', 'review', e.target.value)} rows={4} className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all resize-none" />
              </div>
            </div>
          </div>

          {/* Student Section */}
          <div className="space-y-8 relative">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Student Details</h4>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Student Name</label>
                <input value={formData.student.name} onChange={(e) => handleChange('student', 'name', e.target.value)} placeholder="e.g. Aryan Kumar" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Student Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0 relative group/img">
                    {formData.student.image ? (
                      <div className="relative w-full h-full">
                        <img src={formData.student.image} className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Remove student photo?')) {
                              handleChange('student', 'image', '');
                            }
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity z-20 shadow-lg border border-white/20"
                          title="Remove Photo"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input type="file" accept="image/*" onChange={(e) => handleFileSelection('student', e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                    <input value={formData.student.pendingFile ? formData.student.pendingFile.name : getFileNameFromUrl(formData.student.image)} onChange={(e) => handleChange('student', 'image', e.target.value)} placeholder="Or paste image URL..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-bold focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Student's Review Text</label>
                <textarea value={formData.student.review} onChange={(e) => handleChange('student', 'review', e.target.value)} rows={4} className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all resize-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 rounded-b-[2.5rem] flex items-center justify-end gap-4 sticky bottom-0">
          <button onClick={onClose} className="px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-500 hover:bg-white hover:text-slate-900 transition-all">
            Cancel
          </button>
          <button 
            onClick={() => {
              if(!formData.parent.name || !formData.student.name) {
                toast.error('Names are mandatory.');
                return;
              }
              onSave(formData);
            }} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-blue-100 hover:-translate-y-1 active:scale-95"
          >
            {index !== null ? 'Update Review' : 'Add to Collection'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [header, setHeader] = useState({ badge: 'Real Feedback', title: 'Parent & Student Reviews', footerText: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, index: null, itemName: '' });
  const [modal, setModal] = useState({ isOpen: false, review: null, index: null });
  const [uploadProgress, setUploadProgress] = useState({});
  const [initialReviews, setInitialReviews] = useState([]);
  const isFirstLoad = React.useRef(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsData, headerData] = await Promise.all([
          getReviews(),
          getReviewsHeader()
        ]);
        
        const processed = reviewsData.map(rev => ({
          ...emptyReview,
          ...rev,
          parent: rev.parent || { name: rev.studentName || '', review: rev.reviewText || '', image: rev.image || '' },
          student: rev.student || { name: '', review: '', image: '' }
        }));
        
        setReviews(processed);
        setInitialReviews(JSON.parse(JSON.stringify(processed)));
        if (headerData) {
          setHeader({
            badge: headerData.badge || 'Real Feedback',
            title: headerData.title || 'Parent & Student Reviews',
            footerText: headerData.footerText || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Centralized Change Detection
  useEffect(() => {
    if (loading) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setIsDirty(true);
  }, [header, reviews, loading]);

  const addOrUpdateReview = (formData) => {
    const updated = [...reviews];
    if (modal.index !== null) {
      updated[modal.index] = formData;
    } else {
      updated.unshift(formData);
    }
    setReviews(updated);
    setModal({ isOpen: false, review: null, index: null });
    toast.success(modal.index !== null ? 'Entry updated' : 'Entry added');
  };

  const removeReview = (i) => {
    setDeleteModal({ isOpen: true, index: i, itemName: reviews[i].parent.name || reviews[i].student.name || `Review #${i + 1}` });
  };

  const confirmDeleteReview = () => {
    if (deleteModal.index !== null) {
      setReviews(reviews.filter((_, idx) => idx !== deleteModal.index));
      setDeleteModal({ isOpen: false, index: null, itemName: '' });
      toast.success('Entry removed');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Upload pending images
      const finalReviews = await Promise.all(reviews.map(async (rev, idx) => {
        let finalParent = rev.parent;
        let finalStudent = rev.student;

        if (rev.parent.pendingFile) {
          const url = await uploadFile(
            rev.parent.pendingFile, 
            `reviews/parents/${Date.now()}_${rev.parent.pendingFile.name}`, 
            (p) => setUploadProgress(prev => ({ ...prev, [`p_${idx}`]: p }))
          );
          const { pendingFile, ...rest } = rev.parent;
          finalParent = { ...rest, image: url };
        }

        if (rev.student.pendingFile) {
          const url = await uploadFile(
            rev.student.pendingFile, 
            `reviews/students/${Date.now()}_${rev.student.pendingFile.name}`, 
            (p) => setUploadProgress(prev => ({ ...prev, [`s_${idx}`]: p }))
          );
          const { pendingFile, ...rest } = rev.student;
          finalStudent = { ...rest, image: url };
        }

        return { ...rev, parent: finalParent, student: finalStudent };
      }));

      await Promise.all([
        saveReviews(finalReviews),
        saveReviewsHeader(header)
      ]);
      
      // Cleanup old images from Storage
      const oldImages = initialReviews.flatMap(r => [r.parent.image, r.student.image]).filter(url => url && typeof url === 'string' && url.includes('firebasestorage'));
      const newImages = finalReviews.flatMap(r => [r.parent.image, r.student.image]);
      const toDelete = oldImages.filter(url => !newImages.includes(url));
      await Promise.all(toDelete.map(url => deleteFileByUrl(url)));

      setReviews(finalReviews);
      setInitialReviews(JSON.parse(JSON.stringify(finalReviews)));
      toast.success('Reviews and Header updated successfully!');
      setIsDirty(false);
      // Reset the gate so further changes can be detected
      isFirstLoad.current = false; 
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reviews.slice(indexOfFirstItem, indexOfLastItem);

  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const handleHeaderChange = (field, value) => {
    setHeader(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const saveAction = (
    <button
      onClick={handleSave}
      disabled={saving || loading || !isDirty}
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
      <AdminLayout title="Manage Reviews Page" isDirty={isDirty} actions={saveAction}>
        <PageTitle title="Admin | Reviews" />
        <div className="max-w-7xl mx-auto pb-20">
          
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10 bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex-1 w-full space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Section Header Branding</h2>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Customize public page titles</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Badge</label>
                  <input 
                    value={header.badge} 
                    onChange={(e) => handleHeaderChange('badge', e.target.value)} 
                    placeholder="e.g. Real Feedback" 
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-amber-500 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Section Title</label>
                  <input 
                    value={header.title} 
                    onChange={(e) => handleHeaderChange('title', e.target.value)} 
                    placeholder="e.g. Parent & Student Reviews" 
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-amber-500 transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CTA Footer Text</label>
                  <input 
                    value={header.footerText} 
                    onChange={(e) => handleHeaderChange('footerText', e.target.value)} 
                    placeholder="e.g. Sync into the Network" 
                    className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:border-amber-500 transition-all" 
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col items-center gap-4 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-10">
              <button onClick={() => setModal({ isOpen: true, review: null, index: null })} className="flex-1 lg:w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-blue-500 text-slate-900 hover:text-blue-500 font-bold px-6 py-4 rounded-2xl text-sm transition-all shadow-sm hover:shadow-xl active:scale-95 whitespace-nowrap">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                Add Testimonial
              </button>
            </div>
          </div>

          {/* Table View */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-blue-600 font-black text-xs uppercase tracking-widest animate-pulse">Fetching records...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900">No Testimonials Found</h3>
                <p className="text-slate-500 text-sm mt-2">Start by adding your first parent-student review pair.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Sr. No.</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Feedback Preview</th>
                      <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentItems.map((rev, i) => {
                      const actualIndex = indexOfFirstItem + i;
                      return (
                        <tr key={actualIndex} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6 text-sm font-black text-slate-400">
                            {(actualIndex + 1).toString().padStart(2, '0')}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-slate-100">
                                {rev.parent.image ? <img src={rev.parent.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>}
                              </div>
                              <div>
                                <div className="text-sm font-black text-slate-900 leading-none">{rev.parent.name}</div>
                                <div className="text-[9px] font-black text-blue-500 uppercase tracking-wider mt-1.5">Parent</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-slate-100">
                                {rev.student.image ? <img src={rev.student.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>}
                              </div>
                              <div>
                                <div className="text-sm font-black text-slate-900 leading-none">{rev.student.name}</div>
                                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-wider mt-1.5">Student</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 max-w-md">
                            <div className="text-xs text-slate-500 line-clamp-2 italic leading-relaxed">
                              "{rev.parent.review || rev.student.review}"
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setModal({ isOpen: true, review: rev, index: actualIndex })} className="p-2.5 rounded-xl text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                              </button>
                              <button onClick={() => removeReview(actualIndex)} className="p-2.5 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {reviews.length > itemsPerPage && (
              <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, reviews.length)} of {reviews.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={goToPrevPage} 
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all border border-transparent hover:border-slate-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                  </button>
                  <div className="px-4 py-2 bg-white rounded-xl text-xs font-black text-blue-600 border border-slate-200 shadow-sm">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button 
                    onClick={goToNextPage} 
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all border border-transparent hover:border-slate-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"/></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>

      <ReviewModal 
        isOpen={modal.isOpen} 
        onClose={() => setModal({ isOpen: false, review: null, index: null })}
        review={modal.review}
        index={modal.index}
        onSave={addOrUpdateReview}
        uploadFile={uploadFile}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, index: null, itemName: '' })}
        onConfirm={confirmDeleteReview}
        title="Remove Review Entry"
        message={
          <>
            Are you sure you want to remove the testimonial for <span className="font-bold text-slate-900">"{deleteModal.itemName}"</span>?
            <div className="text-slate-400 text-xs mt-2 uppercase font-black tracking-tighter italic">This will permanently delete both parent and student feedback from your collection.</div>
          </>
        }
      />
    </>
  );
};

export default AdminReviews;
