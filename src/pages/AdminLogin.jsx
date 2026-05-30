import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import loginBg from '../assets/adminloginbg.jpg';
import logo from '../assets/orionologo.png';
import PageTitle from '../components/PageTitle';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard automatically if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/admin/home');
    }
  }, [user, navigate]);

  if (user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
        <PageTitle title="Admin Login" />
        {/* Background Image with Black Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginBg})` }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 bg-white rounded-[2rem] shadow-2xl p-10 max-w-md w-full text-center border border-white/10">
          <div className="w-20 h-20 mx-auto mb-6">
            <img src={logo} alt="Orion Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy mb-2">Welcome, Admin</h2>
          <p className="text-slate-500 text-sm mb-8 font-medium">{user.email}</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/admin/home')}
              className="w-full bg-navy hover:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all text-sm shadow-xl shadow-navy/20"
            >
              Go to Dashboard
            </button>
            <button
              onClick={async () => {
                await logout();
                toast.success('Logged out successfully');
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl transition-all text-sm border border-slate-200"
            >
              Log Out / Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Logged in successfully!');
      navigate('/admin/home');
    } else {
      toast.error('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <PageTitle title="Admin Login" />
      {/* Background Image with Black Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 bg-white rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] p-8 sm:p-12 max-w-md w-full border border-white/20"
      >
        <div className="text-center mb-10">
          <div className="w-24 h-16 mx-auto mb-6 flex items-center justify-center">
            <img src={logo} alt="Orion Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-navy tracking-tight">Admin Login</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide uppercase">Orion Medical Education</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-medium transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-400 mb-2 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-5 py-4 pr-16 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-sm font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 hover:text-navy transition-colors uppercase tracking-widest px-2 py-1"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy hover:bg-blue-900 disabled:opacity-70 text-white font-bold py-4 rounded-2xl transition-all text-sm flex items-center justify-center gap-2 shadow-xl shadow-navy/30 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Verifying...</span>
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <Link
            to="/"
            className="text-slate-400 hover:text-navy text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group"
          >
            <svg className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Website
          </Link>
        </div>


      </motion.div>
    </div>
  );
};

export default AdminLogin;
