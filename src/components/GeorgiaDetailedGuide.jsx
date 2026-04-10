import React from 'react';
import { motion } from 'framer-motion';
import { georgiaOverview } from '../data/georgiaData';
import georgiaFlag from '../assets/flags/georgiaflag.png';

const GeorgiaDetailedGuide = () => {
  return (
    <div className="space-y-10 sm:space-y-16 pt-2 pb-10 sm:py-10">
      {/* --- Intro Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-12 shadow-xl border border-slate-100 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/30 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={georgiaFlag} 
              alt="Georgia Flag" 
              className="w-16 h-10 object-cover rounded-lg shadow-lg border border-slate-100" 
            />
            <div>
              <h2 className="text-3xl font-bold text-navy">MBBS in Georgia</h2>
              <p className="text-red-700 font-semibold tracking-wide uppercase text-xs mt-1">European Excellence in Medical Training</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-slate-600 leading-relaxed text-lg italic">
                "Georgia offers a unique blend of European standards, modern clinical training, and a globally recognized degree, making it a premier destination for aspiring doctors."
              </p>
              <div className="space-y-4">
                <h4 className="text-sm font-black text-navy uppercase tracking-widest border-b border-slate-100 pb-2">Why Choose Georgia?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {georgiaOverview.benefits.map((benefit, i) => (
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

            <div className="bg-gradient-to-br from-[#800] to-[#b00] rounded-lg sm:rounded-xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
              <h3 className="text-xl font-bold mb-4 relative z-10">Global Recognition</h3>
              <p className="text-red-100 text-sm leading-relaxed mb-6 relative z-10">
                Medical degrees from Georgia are recognized by WHO, NMC (India), and listed in WDOMS. This ensures eligibility for NEXT, USMLE, PLAB, and other global licensing exams.
              </p>
              <div className="flex gap-4 relative z-10">
                <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/20">WHO</div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/20">NMC</div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/20">WDOMS</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Universities Section --- */}
      <div>
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-navy text-center mb-2 tracking-tight">Top Medical Institutions</h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-red-600 rounded-full" />
        </div>

        <div className="space-y-12">
          {georgiaOverview.universities.map((uni, idx) => (
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

                  <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-red-700 transition-colors uppercase tracking-tight">{uni.name}</h3>
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
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> European Standards
                    </span>
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold border border-amber-100 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> WDOMS Listed
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

export default GeorgiaDetailedGuide;
