import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import CursorPlane from './components/CursorPlane';
import BackgroundMusic from './components/BackgroundMusic';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Countries = lazy(() => import('./pages/Countries'));
const UniversityDetails = lazy(() => import('./pages/UniversityDetails'));
const Team = lazy(() => import('./pages/Team'));
const Process = lazy(() => import('./pages/Process'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Observership = lazy(() => import('./pages/Observership'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminHome = lazy(() => import('./pages/admin/AdminHome'));
const AdminCountries = lazy(() => import('./pages/admin/AdminCountries'));
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam'));
const AdminProcess = lazy(() => import('./pages/admin/AdminProcess'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminObservership = lazy(() => import('./pages/admin/AdminObservership'));
const AdminContact = lazy(() => import('./pages/admin/AdminContact'));

// Full-page loading fallback
import PageLoader from './components/PageLoader';

// Full-page loading fallback - removed inline version in favor of component

// Layout with Navbar + Footer
const Layout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

// Layout without footer (for admin/utility pages)
const MinimalLayout = ({ children }) => (
  <>
    <main>{children}</main>
  </>
);

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) {
      document.body.classList.add('admin-panel');
    } else {
      document.body.classList.remove('admin-panel');
    }
  }, [isAdmin]);

  return (
    <>
      {!isAdmin && <CursorPlane />}
      <BackgroundMusic />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Main site routes with Navbar + Footer */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/countries" element={<Layout><Countries /></Layout>} />
          <Route path="/university/:slug" element={<Layout><UniversityDetails /></Layout>} />
          <Route path="/team" element={<Layout><Team /></Layout>} />
          <Route path="/process" element={<Layout><Process /></Layout>} />
          <Route path="/reviews" element={<Layout><Reviews /></Layout>} />
          <Route path="/observership" element={<Layout><Observership /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />

          {/* Admin routes (minimal layout – sidebar built into each page) */}
          <Route path="/admin/login" element={<PublicRoute><MinimalLayout><AdminLogin /></MinimalLayout></PublicRoute>} />
          
          {/* Redirect /admin to /admin/home for security and navigation consistency */}
          <Route path="/admin" element={<Navigate to="/admin/home" replace />} />
          
          <Route path="/admin/home" element={<ProtectedRoute><MinimalLayout><AdminHome /></MinimalLayout></ProtectedRoute>} />
          <Route path="/admin/countries" element={<ProtectedRoute><MinimalLayout><AdminCountries /></MinimalLayout></ProtectedRoute>} />
          <Route path="/admin/team" element={<ProtectedRoute><MinimalLayout><AdminTeam /></MinimalLayout></ProtectedRoute>} />
          <Route path="/admin/process" element={<ProtectedRoute><MinimalLayout><AdminProcess /></MinimalLayout></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<ProtectedRoute><MinimalLayout><AdminReviews /></MinimalLayout></ProtectedRoute>} />
          <Route path="/admin/observership" element={<ProtectedRoute><MinimalLayout><AdminObservership /></MinimalLayout></ProtectedRoute>} />
          <Route path="/admin/contact" element={<ProtectedRoute><MinimalLayout><AdminContact /></MinimalLayout></ProtectedRoute>} />

          {/* 404 fallback */}
          <Route path="*" element={
            <Layout>
              <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-20">
                <div className="text-center">
                  <div className="text-8xl font-bold text-blue-100 mb-4">404</div>
                  <h1 className="text-2xl font-bold text-navy mb-2">Page Not Found</h1>
                  <p className="text-slate-500 mb-6">The page you're looking for doesn't exist.</p>
                  <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors text-sm">
                    Go Home
                  </a>
                </div>
              </div>
            </Layout>
          } />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </>
  );
};

export default App;

