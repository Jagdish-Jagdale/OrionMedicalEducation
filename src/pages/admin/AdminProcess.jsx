import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getProcess, saveProcess } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';

const emptyStep = { stepNumber: '', title: '', description: '', icon: '' };

const AdminProcess = () => {
  const [steps, setSteps] = useState([emptyStep]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProcess().then((data) => {
      if (data && data.length > 0) setSteps(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChange = (i, field, val) => {
    const updated = [...steps];
    updated[i][field] = val;
    setSteps(updated);
  };

  const addStep = () => setSteps([...steps, { ...emptyStep, stepNumber: String(steps.length + 1) }]);
  const removeStep = (i) => setSteps(steps.filter((_, idx) => idx !== i));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProcess(steps);
      toast.success('Admission process saved to Firestore!');
    } catch {
      toast.error('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Manage Admission Process">
      <PageTitle title="Admin | Process" />
      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        {/* Top action bar */}
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={addStep} className="flex items-center gap-2 bg-white border border-slate-200 hover:border-emerald-500 text-slate-900 hover:text-emerald-500 font-bold px-5 py-2.5 rounded-2xl text-sm transition-all shadow-sm hover:shadow-xl active:scale-95">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
            Add Next Step
          </button>
          <button type="submit" disabled={saving || loading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-8 py-2.5 rounded-2xl text-sm transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 active:scale-95 flex items-center gap-2">
            {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {saving ? 'Saving...' : 'Save Entire Roadmap'}
          </button>
        </div>

        {loading ? (
          <div className="h-48 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm transition-all hover:shadow-lg group relative">
                {i !== steps.length - 1 && (
                  <div className="absolute left-10 md:left-14 top-[84px] bottom-[-32px] w-0.5 bg-slate-100 hidden md:block" />
                )}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-100 relative z-10">
                      {step.stepNumber || (i + 1)}
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-bold text-lg">{step.title || 'New Process Step'}</h3>
                      <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-0.5">Workflow Milestone</p>
                    </div>
                  </div>
                  {steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(i)} className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-4">
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Step Display Title</label>
                    <input value={step.title} onChange={(e) => handleChange(i, 'title', e.target.value)} placeholder="e.g. Free Counseling & University Selection" className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 text-xs font-bold mb-2 uppercase tracking-widest">Detailed Description</label>
                    <textarea value={step.description} onChange={(e) => handleChange(i, 'description', e.target.value)} rows={4} placeholder="Summarize the key actions or outcomes for this stage..." className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
    </AdminLayout>
  );
};

export default AdminProcess;
