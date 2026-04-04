import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const emptyStep = { stepNumber: '', title: '', description: '', icon: '' };

const AdminProcess = () => {
  const [steps, setSteps] = useState([emptyStep]);

  const handleChange = (i, field, val) => {
    const updated = [...steps];
    updated[i][field] = val;
    setSteps(updated);
  };

  const addStep = () => setSteps([...steps, { ...emptyStep, stepNumber: String(steps.length + 1) }]);
  const removeStep = (i) => setSteps(steps.filter((_, idx) => idx !== i));

  const handleSave = (e) => {
    e.preventDefault();
    alert('Process steps saved! (Wire to Firestore as needed)');
  };

  return (
    <AdminLayout title="Manage Admission Process">
      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {steps.map((step, i) => (
          <div key={i} className="bg-[#1e2d45] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Step {i + 1}</h3>
              {steps.length > 1 && (
                <button type="button" onClick={() => removeStep(i)} className="text-red-400 hover:text-red-300 text-xs transition-colors">Remove</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Step Number</label>
                <input value={step.stepNumber} onChange={(e) => handleChange(i, 'stepNumber', e.target.value)} placeholder="e.g. 01" className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Title</label>
                <input value={step.title} onChange={(e) => handleChange(i, 'title', e.target.value)} placeholder="e.g. Initial Consultation" className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-400 text-sm mb-1">Description</label>
                <textarea value={step.description} onChange={(e) => handleChange(i, 'description', e.target.value)} rows={3} placeholder="Explain what happens in this step..." className="w-full bg-[#0f172a] text-white border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition resize-none" />
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="button" onClick={addStep} className="border border-white/10 text-slate-300 hover:border-blue-500 hover:text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            + Add Step
          </button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors">
            Save All
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminProcess;
