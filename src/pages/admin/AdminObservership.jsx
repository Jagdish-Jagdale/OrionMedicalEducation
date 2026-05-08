import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getObservership, saveObservership } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';

const AdminObservership = () => {
  const [data, setData] = useState({
    // Section 1: Header
    mainHeading: '',
    mainSubheading: '',
    mainDescription: '',
    
    // Section 2: Intro Card
    introTitle: '',
    introDescription: '',
    
    // Section 3: Points Card (3 items)
    pointsTitle: '',
    points: [
      { pointText: '', description: '' },
      { pointText: '', description: '' },
      { pointText: '', description: '' },
    ],
    
    // Section 4: Grid Card (6 items)
    gridTitle: '',
    gridDescription: '',
    gridItems: Array(6).fill(0).map(() => ({ title: '', description: '' })),
    
    // Section 5: Bottom Cards (3 items)
    bottomTitle: '',
    bottomItems: Array(3).fill(0).map(() => ({ title: '', description: '' })),
    
    // Section 6: Final Card
    finalTitle: '',
    finalDescription: '',
    finalButtonLabel: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getObservership();
        if (result) {
          // Merge with initial state to ensure all fields exist
          setData(prev => ({ ...prev, ...result }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, val) => {
    setData(prev => ({ ...prev, [field]: val }));
  };

  const handleNestedChange = (listName, index, field, val) => {
    const updatedList = [...data[listName]];
    updatedList[index][field] = val;
    setData(prev => ({ ...prev, [listName]: updatedList }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveObservership(data);
      toast.success('Observership content updated!');
    } catch {
      toast.error('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Manage Observership">
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const saveAction = (
    <button
      onClick={handleSave}
      disabled={saving}
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
    <AdminLayout title="Manage Observership Page" actions={saveAction}>
      <PageTitle title="Admin | Observership" />
      <form onSubmit={handleSave} className="space-y-10 max-w-6xl pb-20">

        {/* 1. Header Section */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-6">Section 1: Page Header</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Main Heading</label>
              <input value={data.mainHeading} onChange={(e) => handleChange('mainHeading', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div className="md:col-span-1">
              <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Subheading</label>
              <input value={data.mainSubheading} onChange={(e) => handleChange('mainSubheading', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Main Description</label>
              <textarea value={data.mainDescription} onChange={(e) => handleChange('mainDescription', e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" />
            </div>
          </div>
        </section>

        {/* 2. Intro Card */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-6">Section 2: Introduction Card</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Card Title</label>
              <input value={data.introTitle} onChange={(e) => handleChange('introTitle', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Card Description</label>
              <textarea value={data.introDescription} onChange={(e) => handleChange('introDescription', e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" />
            </div>
          </div>
        </section>

        {/* 3. Points Card (3 Items) */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-6">Section 3: Process Steps</h3>
          <div className="mb-6">
            <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Section Title</label>
            <input value={data.pointsTitle} onChange={(e) => handleChange('pointsTitle', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.points.map((point, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <span className="text-blue-600 font-black text-lg mb-4 block">0{i+1}</span>
                <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Point {i+1} Text</label>
                <input value={point.pointText} onChange={(e) => handleNestedChange('points', i, 'pointText', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 mb-4 focus:ring-2 focus:ring-blue-500/20 outline-none" />
                <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Description</label>
                <textarea value={point.description} onChange={(e) => handleNestedChange('points', i, 'description', e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. Grid Card (6 Items) */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-6">Section 4: Highlights Grid</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Grid Main Title</label>
              <input value={data.gridTitle} onChange={(e) => handleChange('gridTitle', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Grid Main Description</label>
              <textarea value={data.gridDescription} onChange={(e) => handleChange('gridDescription', e.target.value)} rows={1} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.gridItems.map((item, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Item {i+1} Title</label>
                <input value={item.title} onChange={(e) => handleNestedChange('gridItems', i, 'title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 mb-4 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold" />
                <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Item {i+1} Description</label>
                <textarea value={item.description} onChange={(e) => handleNestedChange('gridItems', i, 'description', e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" />
              </div>
            ))}
          </div>
        </section>

        {/* 5. Bottom Items (3 Cards) */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-6">Section 5: Feature Cards</h3>
          <div className="mb-6">
            <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Section Title</label>
            <input value={data.bottomTitle} onChange={(e) => handleChange('bottomTitle', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.bottomItems.map((item, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Card {i+1} Title</label>
                <input value={item.title} onChange={(e) => handleNestedChange('bottomItems', i, 'title', e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 mb-4 focus:ring-2 focus:ring-blue-500/20 outline-none font-bold" />
                <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Card {i+1} Description</label>
                <textarea value={item.description} onChange={(e) => handleNestedChange('bottomItems', i, 'description', e.target.value)} rows={3} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" />
              </div>
            ))}
          </div>
        </section>

        {/* 6. Final Card */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h3 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-6">Section 6: Final Call-to-Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Final Title</label>
              <input value={data.finalTitle} onChange={(e) => handleChange('finalTitle', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
            <div>
              <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Button Label</label>
              <input value={data.finalButtonLabel} onChange={(e) => handleChange('finalButtonLabel', e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 text-[10px] font-black uppercase mb-2">Final Description</label>
            <textarea value={data.finalDescription} onChange={(e) => handleChange('finalDescription', e.target.value)} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" />
          </div>
        </section>

      </form>
    </AdminLayout>
  );
};

export default AdminObservership;
