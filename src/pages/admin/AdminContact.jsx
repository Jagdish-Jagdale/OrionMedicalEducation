import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getContactPageData, saveContactPageData } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import PageTitle from '../../components/PageTitle';

const AdminContact = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Page Settings State
  const [settings, setSettings] = useState({
    header: '',
    subheader: '',
    description: '',
    // Card 1
    officeTitle: '',
    address: '',
    officeTagline: '',
    // Card 2
    phoneTitle: '',
    phone1: '',
    phone2: '',
    phoneTagline: '',
    // Card 3
    emailTitle: '',
    email1: '',
    email2: '',
    emailTagline: '',
    // Card 4
    websiteTitle: '',
    websiteLink: '',
    websiteTagline: '',
    // Social
    youtube: '',
    instagram: '',
    facebook: '',
    // Authorized Partner Card
    partnerTitle: '',
    partnerDescription: '',
    // WhatsApp
    whatsappTitle: '',
    whatsappDescription: '',
    whatsappButtonLabel: '',
    whatsappPhone: '',
    // Phone CTA
    ctaTitle: '',
    ctaButtonLabel: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const pageData = await getContactPageData();
      if (pageData) {
        // Migration: if whatsappPhone is empty but ctaPhone exists, use it
        const initialData = { ...pageData };
        if (!initialData.whatsappPhone && initialData.ctaPhone) {
          initialData.whatsappPhone = initialData.ctaPhone;
        }
        setSettings(prev => ({ ...prev, ...initialData }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await saveContactPageData(settings);
      toast.success('Contact settings saved!');
    } catch (err) {
      toast.error('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Contact Page Editor">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const saveAction = (
    <button
      onClick={handleSaveSettings}
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
    <AdminLayout title="Contact Page Editor" actions={saveAction}>
      <PageTitle title="Admin | Contact Editor" />

      <div className="space-y-8 pb-32">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 border-b pb-4">Main Page Header</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Heading</label>
              <input
                type="text"
                value={settings.header}
                onChange={e => setSettings({ ...settings, header: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-slate-700"
                placeholder="e.g. Contact Us"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subheading</label>
              <input
                type="text"
                value={settings.subheader}
                onChange={e => setSettings({ ...settings, subheader: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none font-bold text-slate-700"
                placeholder="e.g. Get in touch"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
              <textarea
                value={settings.description}
                onChange={e => setSettings({ ...settings, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-5 py-4 h-32 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium text-slate-600 leading-relaxed"
                placeholder="Header description..."
              />
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Office */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">1</span>
              Office Address Card
            </h4>
            <input
              type="text"
              placeholder="Card Title (e.g. Main Office)"
              value={settings.officeTitle}
              onChange={e => setSettings({ ...settings, officeTitle: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold"
            />
            <textarea
              placeholder="Address"
              value={settings.address}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm h-24"
            />
            <input
              type="text"
              placeholder="Tagline"
              value={settings.officeTagline}
              onChange={e => setSettings({ ...settings, officeTagline: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
            />
          </div>

          {/* Card 2: Phone */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">2</span>
              Phone Contacts Card
            </h4>
            <input
              type="text"
              placeholder="Card Title (e.g. Call Us)"
              value={settings.phoneTitle}
              onChange={e => setSettings({ ...settings, phoneTitle: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Number 1"
                value={settings.phone1}
                onChange={e => setSettings({ ...settings, phone1: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
              />
              <input
                type="text"
                placeholder="Number 2"
                value={settings.phone2}
                onChange={e => setSettings({ ...settings, phone2: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="Tagline"
              value={settings.phoneTagline}
              onChange={e => setSettings({ ...settings, phoneTagline: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
            />
          </div>

          {/* Card 3: Email */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">3</span>
              Email Support Card
            </h4>
            <input
              type="text"
              placeholder="Card Title (e.g. Email Us)"
              value={settings.emailTitle}
              onChange={e => setSettings({ ...settings, emailTitle: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Email 1"
                value={settings.email1}
                onChange={e => setSettings({ ...settings, email1: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
              />
              <input
                type="text"
                placeholder="Email 2"
                value={settings.email2}
                onChange={e => setSettings({ ...settings, email2: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="Tagline"
              value={settings.emailTagline}
              onChange={e => setSettings({ ...settings, emailTagline: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
            />
          </div>

          {/* Card 4: Website */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">4</span>
              Website/Online Card
            </h4>
            <input
              type="text"
              placeholder="Card Title (e.g. Visit Website)"
              value={settings.websiteTitle}
              onChange={e => setSettings({ ...settings, websiteTitle: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold"
            />
            <input
              type="text"
              placeholder="Website Link"
              value={settings.websiteLink}
              onChange={e => setSettings({ ...settings, websiteLink: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
            />
            <input
              type="text"
              placeholder="Tagline"
              value={settings.websiteTagline}
              onChange={e => setSettings({ ...settings, websiteTagline: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
            />
          </div>
        </div>

        {/* Social Network Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 border-b pb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">YouTube Link</label>
              <input
                type="text"
                value={settings.youtube}
                onChange={e => setSettings({ ...settings, youtube: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Instagram Link</label>
              <input
                type="text"
                value={settings.instagram}
                onChange={e => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Facebook Link</label>
              <input
                type="text"
                value={settings.facebook}
                onChange={e => setSettings({ ...settings, facebook: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Authorized Partner Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 border-b pb-4 text-amber-600">Authorized Partner Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Card Title</label>
              <input
                type="text"
                value={settings.partnerTitle}
                onChange={e => setSettings({ ...settings, partnerTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
                placeholder="e.g. 100% Authorized Partner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Card Description</label>
              <textarea
                value={settings.partnerDescription}
                onChange={e => setSettings({ ...settings, partnerDescription: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm h-24"
                placeholder="Partner card description..."
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="text-xl font-black text-green-600">WhatsApp Section</h3>
            <Link to="/admin?section=hero" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 underline transition-colors">
              Manage Number in Home Settings
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">WhatsApp Title</label>
              <input
                type="text"
                value={settings.whatsappTitle}
                onChange={e => setSettings({ ...settings, whatsappTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Button Label</label>
              <input
                type="text"
                value={settings.whatsappButtonLabel}
                onChange={e => setSettings({ ...settings, whatsappButtonLabel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
              <textarea
                value={settings.whatsappDescription}
                onChange={e => setSettings({ ...settings, whatsappDescription: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm h-20"
              />
            </div>
          </div>
        </div>

        {/* Bottom Call Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 border-b pb-4 text-blue-600">Bottom Call Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</label>
              <input
                type="text"
                value={settings.ctaTitle}
                onChange={e => setSettings({ ...settings, ctaTitle: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Button Label</label>
              <input
                type="text"
                value={settings.ctaButtonLabel}
                onChange={e => setSettings({ ...settings, ctaButtonLabel: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContact;
