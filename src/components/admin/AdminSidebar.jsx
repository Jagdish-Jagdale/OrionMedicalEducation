import React from 'react';
import { NavLink, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import orionLogo from '../../assets/orionologo.png';
import LogoutModal from './LogoutModal';

const navItems = [
  {
    label: 'Home',
    to: '/admin/home',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    subItems: [
      { id: 'hero', label: 'Hero Section' },
      { id: 'about', label: 'About Us' },
      { id: 'clinical', label: 'Clinical Training' },
      { id: 'testimonials', label: 'Testimonials' },
      { id: 'cta', label: 'CTA Banner' },
    ]
  },
  {
    label: 'Countries',
    to: '/admin/countries',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Team',
    to: '/admin/team',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Process',
    to: '/admin/process',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Reviews',
    to: '/admin/reviews',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Observership',
    to: '/admin/observership',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Contact',
    to: '/admin/contact',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    subItems: [
      { id: 'page', label: 'Contact Page', to: '/admin/contact' },
      { id: 'messages', label: 'Messages', to: '/admin/messages' },
    ]
  },
];

const AdminSidebar = ({ isMobileOpen, setMobileOpen, collapsed, setCollapsed, isDirty, dirtySections }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeSection = searchParams.get('section') || 'hero';

  const handleNavClick = (e, to) => {
    if (isDirty) {
      e.preventDefault();
      const sectionsList = dirtySections?.length > 0
        ? ` (${dirtySections.join(', ')})`
        : '';

      toast.error(`Unsaved changes in${sectionsList}. Please save or discard before leaving.`, {
        position: 'top-right',
        duration: 5000,
        id: 'unsaved-warning',
        style: {
          fontSize: '12px',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '12px 16px',
          maxWidth: '320px',
          lineHeight: '1.4'
        }
      });
      return false;
    }
    if (isMobileOpen) setMobileOpen(false);
  };

  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand */}
      <div className={`pb-2 ${collapsed ? 'px-2' : 'px-4'}`}>
        <div className="flex flex-col items-center py-5 gap-2">
          <div className={`bg-white rounded-xl flex items-center justify-center shadow-sm p-2 border border-slate-50 ${collapsed ? 'w-10 h-10' : 'w-full h-14'}`}>
            <img src={orionLogo} alt="Orion" className="h-full object-contain" />
          </div>
          {!collapsed && (
            <div className="text-center mt-1">
              <div className="font-bold text-slate-900 text-sm leading-tight">Orion Medical Education</div>
              <div className="text-blue-600 text-[10px] font-bold uppercase tracking-widest mt-0.5">Admin Panel</div>
            </div>
          )}
        </div>
        <hr className="border-slate-100" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.to} className="space-y-1">
              <NavLink
                to={item.to}
                onClick={(e) => handleNavClick(e, item.to)}
                className={() =>
                  `flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all group duration-200
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200'
                    : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                  } ${collapsed ? 'justify-center px-0' : ''}`
                }
                title={collapsed ? item.label : ''}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {hasSubItems && !collapsed && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                )}
              </NavLink>

              {/* Accordion sub-menu */}
              {hasSubItems && isActive && !collapsed && (
                <div className="pl-12 pr-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  {item.subItems.map(sub => {
                    const isSubActive = sub.to ? location.pathname === sub.to : activeSection === sub.id;
                    const subTo = sub.to || `${item.to}?section=${sub.id}`;
                    return (
                      <NavLink
                        key={sub.id}
                        to={subTo}
                        onClick={(e) => handleNavClick(e, subTo)}
                        className={`block px-4 py-2 rounded-xl text-xs font-bold transition-all
                          ${isSubActive
                            ? 'text-blue-600 bg-blue-50/50'
                            : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'
                          }`}
                      >
                        {sub.label}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 mb-2">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 bg-red-50/80 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-red-200 ${collapsed ? 'justify-center px-0' : ''}`}
          title={collapsed ? 'Logout' : ''}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogout} 
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block fixed left-0 top-0 h-screen transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-56'}`}>
        {SidebarContent}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm z-50"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"
          >
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </aside>

      {/* Mobile Drawer */}
      <div className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <aside className={`absolute left-0 top-0 h-full w-72 bg-white transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {SidebarContent}
        </aside>
      </div>
    </>
  );
};

export default AdminSidebar;
