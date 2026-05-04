import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1424]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-navy rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm animate-pulse">Initializing...</p>
        </div>
      </div>
    );
  }

  if (user) {
    // If user is already logged in, redirect them to the dashboard
    return <Navigate to="/admin/home" replace />;
  }

  return children;
};

export default PublicRoute;
