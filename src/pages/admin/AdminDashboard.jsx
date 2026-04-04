import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-[#1e2d45] rounded-2xl p-5 border border-white/5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-white text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const sections = [
  { label: 'Countries', value: '4', color: 'bg-blue-600/20 text-blue-400', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20" strokeLinecap="round"/></svg> },
  { label: 'Team Members', value: '—', color: 'bg-purple-600/20 text-purple-400', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round"/><circle cx="9" cy="7" r="4"/></svg> },
  { label: 'Reviews', value: '—', color: 'bg-amber-600/20 text-amber-400', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.52 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round"/></svg> },
  { label: 'Contacts', value: '—', color: 'bg-green-600/20 text-green-400', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg> },
];

const quickLinks = [
  { label: 'Manage Home Content', to: '/admin/home', desc: 'Edit hero, features, stats' },
  { label: 'Manage Countries', to: '/admin/countries', desc: 'Add / edit country info' },
  { label: 'Manage Team', to: '/admin/team', desc: 'Add team members' },
  { label: 'Manage Process', to: '/admin/process', desc: 'Edit admission steps' },
  { label: 'Manage Reviews', to: '/admin/reviews', desc: 'Moderate student reviews' },
  { label: 'Manage Observership', to: '/admin/observership', desc: 'Edit observership programs' },
  { label: 'Manage Contact', to: '/admin/contact', desc: 'View contact submissions' },
];

const AdminDashboard = () => (
  <AdminLayout title="Dashboard">
    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {sections.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>

    {/* Quick access */}
    <div>
      <h2 className="text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Access</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <a
            key={link.to}
            href={link.to}
            className="bg-[#1e2d45] hover:bg-[#253654] border border-white/5 rounded-2xl p-5 transition-colors group"
          >
            <p className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">{link.label}</p>
            <p className="text-slate-500 text-xs mt-1">{link.desc}</p>
          </a>
        ))}
      </div>
    </div>
  </AdminLayout>
);

export default AdminDashboard;
