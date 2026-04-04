import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, color, bgColor }) => (
  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${bgColor} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-slate-900 text-3xl font-black">{value}</p>
      </div>
    </div>
  </div>
);

const sections = [
  { label: 'Countries', value: '4', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" strokeLinecap="round"/></svg> },
  { label: 'Team Members', value: '—', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round"/><circle cx="9" cy="7" r="4"/></svg> },
  { label: 'Reviews', value: '—', color: 'text-amber-600', bgColor: 'bg-amber-50', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.52 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.1c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round"/></svg> },
  { label: 'Contacts', value: '—', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg> },
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
  <AdminLayout title="Dashboard Overview">
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Shortcuts */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
          <h2 className="text-slate-900 font-bold text-lg uppercase tracking-tight">Quick Access</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {quickLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-3xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-900 font-bold text-sm tracking-tight group-hover:text-blue-600 transition-colors uppercase">{link.label}</p>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  </AdminLayout>
);

export default AdminDashboard;
