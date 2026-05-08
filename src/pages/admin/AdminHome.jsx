import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getHomeContent, saveHomeContent, getReviews, saveReviews } from '../../firebase/firestore';
import { uploadFile } from '../../firebase/storage';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';
import DeleteModal from '../../components/admin/DeleteModal';

const AdminHome = () => {
  const [searchParams] = useSearchParams();
  const activeSection = searchParams.get('section') || 'hero';
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, index: null, itemName: '' });

  const [form, setForm] = useState({
    // Hero
    heroHeading: '',
    heroSubHeading: '',
    heroCompanyName: '',
    heroDescription: '',
    heroBtn1: '',
    heroBtn2: '',
    whatsappNumber: '',

    // About Us
    aboutHeading: '',
    aboutSubHeading: '',
    aboutDescription: '',
    aboutCard1Heading: '',
    aboutCard1SubHeading: '',
    aboutCard2Heading: '',
    aboutCard2SubHeading: '',
    aboutCard3Heading: '',
    aboutCard3SubHeading: '',
    aboutBrandingText: '',
    aboutMissionHeading: '',
    aboutMissionAuthor: '',
    aboutStat1Count: '',
    aboutStat1Desc: '',
    aboutStat2Count: '',
    aboutStat2Desc: '',
    aboutStat3Count: '',
    aboutStat3Desc: '',
    aboutStat4Count: '',
    aboutStat4Desc: '',

    // Clinical Training
    clinicalTrainingTitle: '',
    clinicalTrainingSubTitle: '',
    clinicalTrainingDesc: '',
    video1Title: '', video1Synopsis: '', video1Url: '',
    video2Title: '', video2Synopsis: '', video2Url: '',
    video3Title: '', video3Synopsis: '', video3Url: '',
    video4Title: '', video4Synopsis: '', video4Url: '',

    // Testimonials
    testimonialsTitle: '',
    testimonialsSubtitle: '',
    testimonialsDescription: '',

    // CTA Banner
    ctaHeading: '',
    ctaDesc: '',
    ctaBtn1: '',
    ctaBtn2: '',
  });

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  
  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [dirtySections, setDirtySections] = useState([]);
  const [initialData, setInitialData] = useState({ form: null, reviews: null });

  useEffect(() => {
    getHomeContent().then((homeData) => {
      if (homeData) {
        setForm((prev) => ({ ...prev, ...homeData }));
        if (homeData.testimonialsItems) {
          setReviews(homeData.testimonialsItems);
        }
      }
      
      // Store initial state for comparison
      setInitialData({
        form: homeData || {},
        reviews: homeData?.testimonialsItems ? JSON.parse(JSON.stringify(homeData.testimonialsItems)) : []
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Check for unsaved changes per section
  useEffect(() => {
    if (!loading && initialData.form) {
      const dirty = [];
      
      // Helper to check if any field with a prefix has changed
      const isPrefixDirty = (prefix) => {
        return Object.keys(form)
          .filter(key => key.startsWith(prefix))
          .some(key => form[key] !== (initialData.form ? initialData.form[key] : ''));
      };

      if (isPrefixDirty('hero') || form.whatsappNumber !== (initialData.form ? initialData.form.whatsappNumber : '')) dirty.push('Hero Section');
      if (isPrefixDirty('about')) dirty.push('About Us');
      if (isPrefixDirty('clinical') || isPrefixDirty('video')) dirty.push('Clinical Training');
      if (isPrefixDirty('cta')) dirty.push('CTA Banner');
      
      // Check Testimonials (both the section settings and the actual reviews)
      const isTestimonialSettingsDirty = isPrefixDirty('testimonials');
      const isReviewsDirty = JSON.stringify(reviews) !== JSON.stringify(initialData.reviews);
      if (isTestimonialSettingsDirty || isReviewsDirty) dirty.push('Testimonials');

      setDirtySections(dirty);
      setHasUnsavedChanges(dirty.length > 0);
    }
  }, [form, reviews, loading, initialData]);

  // Block browser back/refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();

    // Testimonials Validation
    for (let i = 0; i < reviews.length; i++) {
      const rev = reviews[i];
      const name = rev.studentName?.trim();
      const univ = rev.university?.trim();
      const text = rev.reviewText?.trim();
      const rate = rev.rating;

      if (!name || !univ || !text || !rate) {
        toast.error(`Testimonial #${i + 1} is incomplete. Please provide Name, University, Rating, and Message.`, {
          position: 'top-right',
          duration: 4000,
        });
        return;
      }
    }

    setSaving(true);
    try {
      await saveHomeContent({
        ...form,
        testimonialsItems: reviews
      });
      
      toast.success('Home content and testimonials saved!');
      
      // Update initial data after successful save
      setInitialData({
        form: JSON.parse(JSON.stringify(form)),
        reviews: JSON.parse(JSON.stringify(reviews))
      });
      setHasUnsavedChanges(false);
      setDirtySections([]);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addTestimonial = () => {
    setReviews([{ studentName: '', university: '', rating: '', reviewText: '', image: '' }, ...reviews]);
  };

  const removeTestimonial = (index) => {
    setDeleteModal({ 
      isOpen: true, 
      index, 
      itemName: reviews[index].studentName || `Testimonial #${index + 1}` 
    });
  };

  const confirmDeleteTestimonial = () => {
    if (deleteModal.index !== null) {
      const newReviews = [...reviews];
      newReviews.splice(deleteModal.index, 1);
      setReviews(newReviews);
      setDeleteModal({ isOpen: false, index: null, itemName: '' });
    }
  };

  const handleReviewChange = (index, field, value) => {
    const newReviews = [...reviews];
    newReviews[index][field] = value;
    setReviews(newReviews);
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;
    
    const studentName = reviews[index].studentName?.trim();
    if (!studentName) {
      toast.error('Please enter student name first before uploading image.');
      return;
    }

    const extension = file.name.split('.').pop();
    const fileName = `${studentName.replace(/\s+/g, '_')}.${extension}`;
    const path = `testimonial/${fileName}`;

    try {
      const url = await uploadFile(file, path, (progress) => {
        setUploadProgress((prev) => ({ ...prev, [index]: progress }));
      });
      handleReviewChange(index, 'image', url);
      setUploadProgress((prev) => ({ ...prev, [index]: null }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Image upload failed.');
      setUploadProgress((prev) => ({ ...prev, [index]: null }));
    }
  };

  const saveAction = (
    <button
      onClick={handleSave}
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
      <AdminLayout 
        title={`Home / ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}`} 
        isDirty={hasUnsavedChanges}
        dirtySections={dirtySections}
        actions={saveAction}
      >
        <PageTitle title={`Admin | Home / ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}`} />
        <div className="max-w-4xl">
          <form onSubmit={handleSave} className="space-y-8">

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <>
              {activeSection === 'hero' && (
                <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <h2 className="text-slate-900 font-bold text-lg">Hero Configuration</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Badge Text (Top Small)</label>
                      <input name="heroHeading" value={form.heroHeading} onChange={handleChange} placeholder="e.g. Trusted MBBS Abroad Company Since 2017" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Main Title (Big Text)</label>
                      <input name="heroSubHeading" value={form.heroSubHeading} onChange={handleChange} placeholder="e.g. Your Trusted Custodian in MBBS Abroad Journey" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Company Name</label>
                      <input name="heroCompanyName" value={form.heroCompanyName} onChange={handleChange} placeholder="Orion Medical Education" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Description</label>
                      <textarea name="heroDescription" value={form.heroDescription} onChange={handleChange} rows={1} className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium resize-none" />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Button 1 Title</label>
                      <input name="heroBtn1" value={form.heroBtn1} onChange={handleChange} placeholder="Explore Countries" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Button 2 Title</label>
                      <input name="heroBtn2" value={form.heroBtn2} onChange={handleChange} placeholder="Contact Us Now" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">WhatsApp Number (Global)</label>
                      <input name="whatsappNumber" value={form.whatsappNumber} onChange={handleChange} placeholder="e.g. 917738230335" className="w-full bg-blue-50/50 text-blue-900 border border-blue-100 rounded-2xl px-5 py-3.5 text-sm font-bold" />
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'about' && (
                <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                    <h2 className="text-slate-900 font-bold text-lg">About Us Configuration</h2>
                  </div>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Small Label (e.g. ABOUT US)</label>
                        <input name="aboutHeading" value={form.aboutHeading} onChange={handleChange} placeholder="ABOUT US" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Big Heading Text</label>
                        <input name="aboutSubHeading" value={form.aboutSubHeading} onChange={handleChange} placeholder="We are not just consultants..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Paragraph Description</label>
                        <textarea name="aboutDescription" value={form.aboutDescription} onChange={handleChange} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[1, 2, 3].map(num => (
                        <div key={num} className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                          <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3">Card {num}</label>
                          <input name={`aboutCard${num}Heading`} value={form[`aboutCard${num}Heading`]} onChange={handleChange} placeholder="Title" className="w-full mb-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold" />
                          <textarea name={`aboutCard${num}SubHeading`} value={form[`aboutCard${num}SubHeading`]} onChange={handleChange} placeholder="Description" rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-medium resize-none" />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Branding Text</label>
                        <input name="aboutBrandingText" value={form.aboutBrandingText} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                      </div>
                      <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 space-y-4">
                        <label className="block text-blue-600 text-[10px] font-black uppercase tracking-widest">Mission Card</label>
                        <input name="aboutMissionHeading" value={form.aboutMissionHeading} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold" />
                        <input name="aboutMissionAuthor" value={form.aboutMissionAuthor} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(num => (
                          <div key={num} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                            <input name={`aboutStat${num}Count`} value={form[`aboutStat${num}Count`]} onChange={handleChange} className="w-full mb-1 bg-transparent text-blue-600 text-sm font-black" />
                            <input name={`aboutStat${num}Desc`} value={form[`aboutStat${num}Desc`]} onChange={handleChange} className="w-full bg-transparent text-slate-400 text-[10px] font-bold uppercase" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'clinical' && (
                <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                    <h2 className="text-slate-900 font-bold text-lg">Clinical Training Configuration</h2>
                  </div>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Small Label (Badge)</label>
                        <input name="clinicalTrainingTitle" value={form.clinicalTrainingTitle} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Big Title</label>
                        <input name="clinicalTrainingSubTitle" value={form.clinicalTrainingSubTitle} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Section Description</label>
                        <textarea name="clinicalTrainingDesc" value={form.clinicalTrainingDesc} onChange={handleChange} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[1, 2, 3, 4].map(num => (
                        <div key={num} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
                          <label className="block text-slate-400 text-[10px] font-black uppercase tracking-widest">Video Card {num}</label>
                          <input name={`video${num}Title`} value={form[`video${num}Title`]} onChange={handleChange} placeholder="Video Name" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold" />
                          <textarea name={`video${num}Synopsis`} value={form[`video${num}Synopsis`]} onChange={handleChange} placeholder="Video Description" rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-medium resize-none" />
                          <input name={`video${num}Url`} value={form[`video${num}Url`]} onChange={handleChange} placeholder="Paste YouTube Link here (e.g. https://www.youtube.com/watch?v=...)" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] focus:ring-1 focus:ring-blue-500/30" />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'testimonials' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-amber-600 rounded-full" />
                        <h2 className="text-slate-900 font-bold text-lg">Testimonials Configuration</h2>
                      </div>
                      <button
                        type="button"
                        onClick={addTestimonial}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                        Add Testimonial
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Section Heading</label>
                        <input name="testimonialsTitle" value={form.testimonialsTitle} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                      <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Section Sub-Heading</label>
                        <input name="testimonialsSubtitle" value={form.testimonialsSubtitle} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                      <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Description</label>
                        <input name="testimonialsDescription" value={form.testimonialsDescription} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {reviews.map((rev, index) => (
                        <div key={index} className="group relative bg-slate-50/40 border border-slate-200 rounded-3xl p-5 transition-all hover:bg-white hover:shadow-xl hover:border-slate-100">
                          <button
                            type="button"
                            onClick={() => removeTestimonial(index)}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-200 hover:bg-red-600 transition-all hover:scale-110 z-10 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto"
                            title="Remove Testimonial"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                          </button>

                          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                            <div className="lg:col-span-1 flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative shadow-inner group/img">
                                {rev.image ? (
                                  <img src={rev.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                  <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                )}

                                {/* Upload Overlay */}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 cursor-pointer transition-all backdrop-blur-[1px]">
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                  />
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                                </label>

                                {uploadProgress[index] != null && (
                                  <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10">
                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-1" />
                                    <span className="text-[8px] font-bold text-blue-600">{uploadProgress[index]}%</span>
                                  </div>
                                )}
                              </div>

                              <div className="w-full">
                                <label className="block text-slate-400 text-[8px] font-bold uppercase tracking-widest mb-1 text-center">Or Paste Link</label>
                                <input
                                  value={rev.image}
                                  onChange={(e) => handleReviewChange(index, 'image', e.target.value)}
                                  placeholder="Image Link"
                                  className="w-full text-[9px] bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-center truncate"
                                />
                              </div>
                            </div>

                            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Student Name</label>
                                <input value={rev.studentName} onChange={(e) => handleReviewChange(index, 'studentName', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-blue-500/20" />
                              </div>
                              <div>
                                <label className="block text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">University</label>
                                <input value={rev.university} onChange={(e) => handleReviewChange(index, 'university', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-500/20" />
                              </div>
                              <div>
                                <label className="block text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Rating</label>
                                <input type="number" min="1" max="5" value={rev.rating} onChange={(e) => handleReviewChange(index, 'rating', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-blue-600 focus:ring-2 focus:ring-blue-500/20" />
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Feedback Message</label>
                                <textarea value={rev.reviewText} onChange={(e) => handleReviewChange(index, 'reviewText', e.target.value)} rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium resize-none focus:ring-2 focus:ring-blue-500/20" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeSection === 'cta' && (
                <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-6 bg-red-600 rounded-full" />
                    <h2 className="text-slate-900 font-bold text-lg">CTA Banner Configuration</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Banner Heading</label>
                      <input name="ctaHeading" value={form.ctaHeading} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Description</label>
                      <input name="ctaDesc" value={form.ctaDesc} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Button 1 Label</label>
                      <input name="ctaBtn1" value={form.ctaBtn1} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Button 2 Label</label>
                      <input name="ctaBtn2" value={form.ctaBtn2} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium" />
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </form>
      </div>
    </AdminLayout>
      <DeleteModal 
        isOpen={deleteModal.isOpen} 
        onClose={() => setDeleteModal({ isOpen: false, index: null, itemName: '' })} 
        onConfirm={confirmDeleteTestimonial}
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

export default AdminHome;
