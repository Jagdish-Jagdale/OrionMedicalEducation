import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';

const emptyReview = { studentName: '', university: '', country: '', reviewText: '', rating: '5', image: '' };

const AdminReviews = () => {
  const [reviews, setReviews] = useState([emptyReview]);

  const handleChange = (i, field, val) => {
    const updated = [...reviews];
    updated[i][field] = val;
    setReviews(updated);
  };

  const addReview = () => setReviews([...reviews, { ...emptyReview }]);
  const removeReview = (i) => setReviews(reviews.filter((_, idx) => idx !== i));

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Reviews moderated successfully!');
  };

  return (
    <AdminLayout title="Manage Student Reviews">
      <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
        <div className="grid grid-cols-1 gap-8">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm transition-all hover:shadow-lg group">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-amber-100">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-lg">{rev.studentName || 'Anonymous Student'}</h3>
                    <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest mt-0.5">Testimonial Entry</p>
                  </div>
                </div>
                {reviews.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeReview(i)} 
                    className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: "Student Name", field: "studentName", placeholder: "e.g. Amit Kumar" },
                  { label: "University", field: "university", placeholder: "e.g. Kazan Federal University" },
                  { label: "Country", field: "country", placeholder: "e.g. Russia" },
                  { label: "Rating (1-5)", field: "rating", placeholder: "5" },
                  { label: "Profile Image URL", field: "image", placeholder: "Public direct image link" },
                ].map(({ label, field, placeholder }) => (
                  <div key={field}>
                    <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">{label}</label>
                    <input 
                      value={rev[field]} 
                      onChange={(e) => handleChange(i, field, e.target.value)} 
                      placeholder={placeholder} 
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                  </div>
                ))}
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Review Content</label>
                  <textarea 
                    value={rev.reviewText} 
                    onChange={(e) => handleChange(i, 'reviewText', e.target.value)} 
                    rows={4} 
                    placeholder="Write the student's testimonial here..." 
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
            onClick={addReview} 
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-amber-500 text-slate-900 hover:text-amber-500 font-bold px-8 py-4 rounded-2xl text-sm transition-all shadow-sm hover:shadow-xl active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            Add Another Review
          </button>
          <button 
            type="submit" 
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 rounded-2xl text-sm transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:scale-95"
          >
            Save Testimonials
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminReviews;
