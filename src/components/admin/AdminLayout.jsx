import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, title, isDirty, dirtySections, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Component */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobileOpen={isMobileOpen}
        setMobileOpen={setMobileOpen}
        isDirty={isDirty}
        dirtySections={dirtySections}
        onNavigate={onNavigate}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? 'lg:ml-20' : 'lg:ml-56'
        }`}
      >
        {/* Top bar & Mobile Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-all border border-slate-200 shadow-sm"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="text-slate-900 font-bold text-xl tracking-tight">{title}</h1>
          </div>

          <div className="flex items-center gap-3 invisible">
            {/* User section removed per request */}
          </div>
        </header>

        {/* Page Content Rendering */}
        <main className="flex-1 p-4 md:p-8 animate-in fade-in duration-500 flex justify-center">
          <div className="w-full max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
