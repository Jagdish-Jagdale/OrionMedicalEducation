import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getReviews, saveReviews } from '../../firebase/firestore';
import { uploadFile } from '../../firebase/storage';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';
import DeleteModal from '../../components/admin/DeleteModal';

const emptyReview = { studentName: '', university: '', country: '', reviewText: '', rating: '5', image: '' };

const AdminReviews = () => {
  const [reviews, setReviews] = useState([emptyReview]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [initialReviews, setInitialReviews] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, index: null, itemName: '' });

  useEffect(() => {
    getReviews().then((data) => {
      if (data && data.length > 0) setReviews(data);
      setInitialReviews(data ? JSON.parse(JSON.stringify(data)) : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Track changes
  useEffect(() => {
    if (!loading && initialReviews) {
      setHasChanges(JSON.stringify(reviews) !== JSON.stringify(initialReviews));
    }
  }, [reviews, loading, initialReviews]);

  // Block browser back/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleChange = (i, field, val) => {
    const updated = [...reviews];
    updated[i][field] = val;
    setReviews(updated);
  };

  const handleImageUpload = async (i, file) => {
    if (!file) return;
    const path = `reviews/${Date.now()}_${file.name}`;
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

  const addReview = () => setReviews([...reviews, { ...emptyReview }]);

  const removeReview = (i) => {
    setDeleteModal({ isOpen: true, index: i, itemName: reviews[i].studentName || `Review #${i + 1}` });
  };

  const confirmDeleteReview = () => {
    if (deleteModal.index !== null) {
      setReviews(reviews.filter((_, idx) => idx !== deleteModal.index));
      setDeleteModal({ isOpen: false, index: null, itemName: '' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validation
    for (let i = 0; i < reviews.length; i++) {
      const rev = reviews[i];
      if (!rev.studentName?.trim() || !rev.university?.trim() || !rev.reviewText?.trim() || !rev.rating) {
        toast.error(`Review #${i + 1} is incomplete. Name, University, Rating, and Content are required.`, {
          position: 'top-right',
          duration: 4000
        });
        return;
      }
    }

    setSaving(true);
    try {
      await saveReviews(reviews);
      toast.success('Reviews saved to Firestore!');
      setInitialReviews(JSON.parse(JSON.stringify(reviews)));
      setHasChanges(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminLayout title="Manage Parent Student Reviews" isDirty={hasChanges}>
        <PageTitle title="Admin | Reviews" />
        <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={addReview} className="flex items-center gap-2 bg-white border border-slate-200 hover:border-amber-500 text-slate-900 hover:text-amber-500 font-bold px-5 py-2.5 rounded-2xl text-sm transition-all shadow-sm hover:shadow-xl active:scale-95">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
              Add Review
            </button>
            <button type="submit" disabled={saving || loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-8 py-2.5 rounded-2xl text-sm transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
              {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
              {saving ? 'Saving...' : 'Save Testimonials'}
            </button>
          </div>

          {loading ? (
            <div className="h-48 bg-white rounded-3xl border border-slate-200 animate-pulse" />
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {reviews.map((rev, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm transition-all hover:shadow-lg group">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-amber-100 overflow-hidden">
                        {rev.image ? <img src={rev.image} alt={rev.studentName} className="w-full h-full object-cover" /> : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-slate-900 font-bold text-lg">{rev.studentName || 'Anonymous Student'}</h3>
                        <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest mt-0.5">Testimonial Entry</p>
                      </div>
                    </div>
                    {reviews.length > 1 && (
                      <button type="button" onClick={() => removeReview(i)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { label: "Student Name", field: "studentName", placeholder: "e.g. Amit Kumar" },
                      { label: "University", field: "university", placeholder: "e.g. Kazan Federal University" },
                      { label: "Country", field: "country", placeholder: "e.g. Russia" },
                      { label: "Rating (1-5)", field: "rating", placeholder: "5" },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field}>
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">{label}</label>
                        <input value={rev[field]} onChange={(e) => handleChange(i, field, e.target.value)} placeholder={placeholder} className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                      </div>
                    ))}

                    {/* Image Upload */}
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Profile Image</label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(i, e.target.files[0])}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 transition-all cursor-pointer"
                        />
                        <div className="flex items-center gap-3">
                          <div className="h-px bg-slate-100 flex-1" />
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">OR</span>
                          <div className="h-px bg-slate-100 flex-1" />
                        </div>
                        <input
                          value={rev.image}
                          onChange={(e) => handleChange(i, 'image', e.target.value)}
                          placeholder="Paste Image Link"
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                      {uploadProgress[i] != null && <div className="text-xs font-bold text-blue-600 mt-2 flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Uploading: {uploadProgress[i]}%
                      </div>}
                      {rev.image && !uploadProgress[i] && <p className="text-xs text-green-600 mt-2 font-bold flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                        Image Set
                      </p>}
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Review Content</label>
                      <textarea value={rev.reviewText} onChange={(e) => handleChange(i, 'reviewText', e.target.value)} rows={4} placeholder="Write the student's testimonial here..." className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </AdminLayout>
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, index: null, itemName: '' })}
        onConfirm={confirmDeleteReview}
        title="Confirm Deletion"
        message={
          <>
            Are you sure you want to delete this item <span className="font-bold text-slate-900">"{deleteModal.itemName}"</span>?
            <div className="text-slate-400 text-xs mt-2">This action cannot be undone.</div>
          </>
        }
      />
    </>
  );
};

export default AdminReviews;
