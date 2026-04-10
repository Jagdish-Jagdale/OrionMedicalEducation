import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import CursorPlane from './components/CursorPlane';
import orionLogo from './assets/orionlogo.png';

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
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex items-center justify-center bg-white"
  >
    <div className="flex flex-col items-center gap-6">
      {/* Circular Loader */}
      <div className="flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="text-blue-600 w-16 h-16"
        >
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2a10 10 0 0 1 10 10" opacity="0.1" />
            <path d="M12 2a10 10 0 0 1 10 10" />
          </svg>
        </motion.div>
      </div>

      {/* Brand Text */}
      <div className="text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-[#1e3a5f] tracking-tight"
        >
          Orion Medical
        </motion.h2>
        <div className="flex justify-center gap-1.5 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

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

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <CursorPlane />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
      </Router>
    </>
  );
};

export default App;

