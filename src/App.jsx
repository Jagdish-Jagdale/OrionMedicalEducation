import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Countries = lazy(() => import('./pages/Countries'));
const UniversityDetails = lazy(() => import('./pages/UniversityDetails'));
const Team = lazy(() => import('./pages/Team'));
const Process = lazy(() => import('./pages/Process'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Observership = lazy(() => import('./pages/Observership'));
const Contact = lazy(() => import('./pages/Contact'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminHome = lazy(() => import('./pages/admin/AdminHome'));
const AdminCountries = lazy(() => import('./pages/admin/AdminCountries'));
const AdminTeam = lazy(() => import('./pages/admin/AdminTeam'));
const AdminProcess = lazy(() => import('./pages/admin/AdminProcess'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminObservership = lazy(() => import('./pages/admin/AdminObservership'));
const AdminContact = lazy(() => import('./pages/admin/AdminContact'));

// Full-page loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-navy rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8M8 12h8" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Layout with Navbar + Footer
const Layout = ({ children, showSplash }) => (
  <>
    <Navbar showSplash={showSplash} />
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

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if splash has already been shown in this session
    const hasShown = sessionStorage.getItem('splashShown');
    // Check if we are on an admin route
    const isAdmin = window.location.pathname.startsWith('/admin');
    return !hasShown && !isAdmin;
  });

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splashShown', 'true');
      }, 5500); // 5.5 seconds splash

      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      <Toaster position="top-right" reverseOrder={false} />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main site routes with Navbar + Footer */}
            <Route path="/" element={<Layout showSplash={showSplash}><Home /></Layout>} />
            <Route path="/countries" element={<Layout showSplash={showSplash}><Countries /></Layout>} />
            <Route path="/university/:slug" element={<Layout showSplash={showSplash}><UniversityDetails /></Layout>} />
            <Route path="/team" element={<Layout showSplash={showSplash}><Team /></Layout>} />
            <Route path="/process" element={<Layout showSplash={showSplash}><Process /></Layout>} />
            <Route path="/reviews" element={<Layout showSplash={showSplash}><Reviews /></Layout>} />
            <Route path="/observership" element={<Layout showSplash={showSplash}><Observership /></Layout>} />
            <Route path="/contact" element={<Layout showSplash={showSplash}><Contact /></Layout>} />

            {/* Admin routes (minimal layout – sidebar built into each page) */}
            <Route path="/admin/login" element={<MinimalLayout><AdminLogin /></MinimalLayout>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><MinimalLayout><AdminDashboard /></MinimalLayout></ProtectedRoute>} />
            <Route path="/admin/home" element={<ProtectedRoute><MinimalLayout><AdminHome /></MinimalLayout></ProtectedRoute>} />
            <Route path="/admin/countries" element={<ProtectedRoute><MinimalLayout><AdminCountries /></MinimalLayout></ProtectedRoute>} />
            <Route path="/admin/team" element={<ProtectedRoute><MinimalLayout><AdminTeam /></MinimalLayout></ProtectedRoute>} />
            <Route path="/admin/process" element={<ProtectedRoute><MinimalLayout><AdminProcess /></MinimalLayout></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute><MinimalLayout><AdminReviews /></MinimalLayout></ProtectedRoute>} />
            <Route path="/admin/observership" element={<ProtectedRoute><MinimalLayout><AdminObservership /></MinimalLayout></ProtectedRoute>} />
            <Route path="/admin/contact" element={<ProtectedRoute><MinimalLayout><AdminContact /></MinimalLayout></ProtectedRoute>} />

            {/* 404 fallback */}
            <Route path="*" element={
              <Layout showSplash={showSplash}>
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
      </Router>
    </>
  );
};

export default App;

