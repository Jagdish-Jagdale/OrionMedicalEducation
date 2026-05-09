import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';
import { getProcessAllData, saveProcessAllData } from '../../firebase/firestore';

const AdminProcess = () => {
  const [steps, setSteps] = useState([]);
  const [settings, setSettings] = useState({
    heroBadge: 'Step by Step',
    heroTitle: 'Simple & Transparent Admission Process',
    heroSubtitle: '8 clear milestones — from your first consultation to arriving at your university campus abroad.',
    footerBadge: 'YOUR JOURNEY BEGINS',
    footerTitle: "You've arrived. Your medical journey begins!",
    footerSubtitle: 'We stay with you even after you reach abroad. Your success is our mission.'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'steps'

  useEffect(() => {
    getProcessAllData().then((data) => {
      // Steps
      const initialSteps = Array.from({ length: 8 }, (_, i) => {
        const existing = data.steps?.find(s => s.order === i + 1);
        return existing || { title: '', description: '', order: i + 1 };
      });
      setSteps(initialSteps.sort((a, b) => a.order - b.order));

      // Settings
      if (data.settings) {
        setSettings({ ...settings, ...data.settings });
      }
      setLoading(false);
    }).catch(() => {
      const empty = Array.from({ length: 8 }, (_, i) => ({ title: '', description: '', order: i + 1 }));
      setSteps(empty);
      setLoading(false);
    });
  }, []);

  const handleChange = (i, field, val) => {
    const updated = [...steps];
    updated[i][field] = val;
    setSteps(updated);
  };

  const handleSettingsChange = (field, val) => {
    setSettings(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate milestones
    const incomplete = steps.some(s => !s.title.trim() || !s.description.trim());
    if (incomplete) {
      toast.error('All 8 steps must be completed before saving.');
      return;
    }

    setSaving(true);
    try {
      await saveProcessAllData(steps, settings);
      toast.success('Admission roadmap synced successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync. Please try again.');
    } finally {
      setSaving(false);
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
    <AdminLayout title="Manage Process Page" actions={saveAction}>
      <PageTitle title="Admin | Process" />
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-20">
        {/* Top action bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm sticky top-4 z-30">
          <div className="flex items-center gap-4">
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button 
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Header & Footer
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab('steps')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'steps' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Steps
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-[2.5rem] border border-slate-200 animate-pulse" />)}
          </div>
        ) : (
          <>
            {activeTab === 'steps' ? (
              <div className="grid grid-cols-1 gap-8">
                {steps.map((step, i) => (
                  <div key={i} className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-200 shadow-sm transition-all hover:shadow-lg group relative overflow-hidden">
                    {(!step.title || !step.description) && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
                    )}
                    
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 ${step.title && step.description ? 'bg-emerald-500' : 'bg-slate-200 text-slate-400'} rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-lg relative z-10`}>
                          {step.order}
                        </div>
                        <div>
                          <h3 className="text-slate-900 font-black text-xl tracking-tight">{step.title || `Step ${step.order} Title Required`}</h3>
                          <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-0.5">Mandatory Step {step.order}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Step Display Title</label>
                        <input value={step.title} onChange={(e) => handleChange(i, 'title', e.target.value)} placeholder="e.g. Career Counseling & Profile Assessment" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Detailed Description</label>
                        <textarea value={step.description} onChange={(e) => handleChange(i, 'description', e.target.value)} rows={3} placeholder="Explain the key actions or outcomes..." className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Hero Settings */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Roadmap Header</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Badge</label>
                      <input value={settings.heroBadge} onChange={(e) => handleSettingsChange('heroBadge', e.target.value)} placeholder="Step by Step" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Title</label>
                      <input value={settings.heroTitle} onChange={(e) => handleSettingsChange('heroTitle', e.target.value)} placeholder="Admission Process" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hero Subtitle</label>
                      <textarea value={settings.heroSubtitle} onChange={(e) => handleSettingsChange('heroSubtitle', e.target.value)} rows={2} className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none" />
                    </div>
                  </div>
                </div>

                {/* Footer Settings */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Roadmap Footer</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Footer Badge</label>
                      <input value={settings.footerBadge} onChange={(e) => handleSettingsChange('footerBadge', e.target.value)} placeholder="YOUR JOURNEY BEGINS" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Footer Title</label>
                      <input value={settings.footerTitle} onChange={(e) => handleSettingsChange('footerTitle', e.target.value)} placeholder="You've arrived!" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Footer Subtitle</label>
                      <textarea value={settings.footerSubtitle} onChange={(e) => handleSettingsChange('footerSubtitle', e.target.value)} rows={2} className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 resize-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </form>
    </AdminLayout>
  );
};

export default AdminProcess;
