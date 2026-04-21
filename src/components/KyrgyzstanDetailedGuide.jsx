import React from 'react';
import { motion } from 'framer-motion';
import { kyrgyzstanOverview } from '../data/kyrgyzstanData';
import kyrgyzstanFlag from '../assets/flags/kyrgyzstanflag.png';

const KyrgyzstanDetailedGuide = () => {
  return (
    <div className="space-y-10 sm:space-y-16 pt-2 pb-10 sm:py-10">
      {/* --- Intro Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-12 shadow-xl border border-slate-100 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/50 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-navy flex items-center gap-4">
              MBBS in Kyrgyzstan
              <img 
                src={kyrgyzstanFlag} 
                alt="Kyrgyzstan Flag" 
                className="w-12 h-8 object-cover rounded-md shadow-md border border-slate-100" 
              />
            </h2>
            <p className="text-red-600 font-semibold tracking-wide uppercase text-xs mt-2">Quality Education, Affordable Costs</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-slate-600 leading-relaxed text-lg italic">
                "Kyrgyzstan has emerged as a top destination for Indian students, offering NMC & WHO recognized degrees with a high success rate in licensing exams."
              </p>
              <div className="space-y-4">
                <h4 className="text-sm font-black text-navy uppercase tracking-widest border-b border-slate-100 pb-2">Why Choose Kyrgyzstan?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {kyrgyzstanOverview.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                      <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-600/20">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-slate-700 text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-navy to-[#1a365d] rounded-lg sm:rounded-xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <h3 className="text-xl font-bold mb-4 relative z-10">Our Exclusive Support</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6 relative z-10">
                We are the official South India representatives for IEU and AMU. Beyond admissions, we provide specialized support to ensure our students' academic and personal well-being.
              </p>
              <div className="space-y-3 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center mt-0.5"><svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"/></svg></div>
                  <span className="text-xs font-medium text-blue-50">Maharashtrian Student Community</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center mt-0.5"><svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2 2H4V5z" clipRule="evenodd"/></svg></div>
                  <span className="text-xs font-medium text-blue-50">FMGE / NExT Coaching Classes</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center mt-0.5"><svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg></div>
                  <span className="text-xs font-medium text-blue-50">Dedicated Hostels & Indian Mess</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Support Services Details --- */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center group hover:border-amber-200 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h4 className="font-bold text-navy mb-2">Dedicated Hostels</h4>
          <p className="text-slate-500 text-sm leading-relaxed">{kyrgyzstanOverview.supportServices.hostel}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center group hover:border-blue-200 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.246.477 4 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4 1.253" /></svg>
          </div>
          <h4 className="font-bold text-navy mb-2">Indian Mess</h4>
          <p className="text-slate-500 text-sm leading-relaxed">{kyrgyzstanOverview.supportServices.mess}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center group hover:border-green-200 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h4 className="font-bold text-navy mb-2">FMGE Coaching</h4>
          <p className="text-slate-500 text-sm leading-relaxed">{kyrgyzstanOverview.supportServices.coaching}</p>
        </motion.div>
      </div>

      {/* --- Universities Section --- */}
      <div>
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-navy text-center mb-2 tracking-tight">Top Medical Institutions</h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-red-600 rounded-full" />
        </div>

        <div className="space-y-12">
          {kyrgyzstanOverview.universities.map((uni, idx) => (
            <motion.div
              key={uni.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col gap-6 transform transition-all"
            >
              {/* Image Top */}
              <div className="w-full relative group">
                <div className="h-64 sm:h-80 md:h-96 rounded-lg sm:rounded-xl overflow-hidden shadow-xl relative">
                  <img
                    src={uni.image}
                    alt={uni.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-40" />
                  <div className="absolute bottom-6 left-6 text-white text-4xl font-black opacity-30 select-none">{String(idx + 1).padStart(2, '0')}</div>
                </div>
              </div>

              {/* Content Bottom */}
              <div className="w-full">
                <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-10 shadow-lg border border-slate-50 flex flex-col h-full relative overflow-hidden group hover:border-red-200 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg className="w-24 h-24 text-red-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-red-600 transition-colors uppercase tracking-tight">{idx + 1}. {uni.name}</h3>
                  <p className="text-slate-600 text-base leading-relaxed mb-8 font-medium">
                    {uni.description}
                  </p>

                  <div className="p-6 bg-red-50/50 rounded-lg border-l-4 border-amber-500 relative mb-8">
                    <span className="absolute -top-3 left-4 px-3 py-0.5 bg-amber-500 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20">University Highlight</span>
                    <p className="text-slate-700 text-sm leading-relaxed italic">
                      "{uni.highlight}"
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-100 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> English Medium
                    </span>
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> NMC recognized
                    </span>
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold border border-amber-100 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> WHO Approved
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KyrgyzstanDetailedGuide;
