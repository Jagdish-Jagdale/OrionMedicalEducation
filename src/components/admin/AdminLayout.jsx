import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0d1424]">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <div
        className="flex-1 flex flex-col transition-all duration-300"
        style={{ marginLeft: collapsed ? '72px' : '256px' }}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <h1 className="text-white font-semibold text-lg">{title}</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
