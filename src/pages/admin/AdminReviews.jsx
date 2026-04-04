import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const emptyReview = { studentName: '', country: '', university: '', rating: '5', reviewText: '', batch: '', image: '' };

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
    alert('Reviews saved! (Wire to Firestore as needed)');
  };

  return (
    <AdminLayout title="Manage Reviews">
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {reviews.map((r, i) => (
          <div key={i} className="bg-[#1e2d45] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Review {i + 1}</h3>
              {reviews.length > 1 && (
                <button type="button" onClick={() => removeReview(i)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Student Name', field: 'studentName', placeholder: 'e.g. Priya Sharma' },
                { label: 'Country', field: 'country', placeholder: 'e.g. Russia' },
                { label: 'University', field: 'university', placeholder: 'e.g. Kazan Federal University' },
                { label: 'Batch Year', field: 'batch', placeholder: 'e.g. 2023' },
                { label: 'Photo URL', field: 'image', placeholder: 'https://...' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-slate-400 text-sm mb-1">{label}</label>
                  <input value={r[field]} onChange={(e) => handleChange(i, field, e.target.value)} placeholder={placeholder} className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition" />
                </div>
              ))}
              <div>
                <label className="block text-slate-400 text-sm mb-1">Rating (1–5)</label>
                <select value={r.rating} onChange={(e) => handleChange(i, 'rating', e.target.value)} className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-1">Review Text</label>
                <textarea value={r.reviewText} onChange={(e) => handleChange(i, 'reviewText', e.target.value)} rows={4} placeholder="Student's review..." className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition resize-none" />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="button" onClick={addReview} className="border border-white/10 text-slate-300 hover:border-blue-500 hover:text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            + Add Review
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Save All
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminReviews;
