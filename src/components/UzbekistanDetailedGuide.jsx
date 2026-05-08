import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { uzbekistanOverview } from '../data/uzbekistanData';
import { getHomeContent } from '../firebase/firestore';
import uzbekistanFlag from '../assets/flags/uzbekistanflag.png';

const UzbekistanDetailedGuide = () => {
  const [waNumber, setWaNumber] = useState('');

  useEffect(() => {
    getHomeContent().then((data) => {
      if (data && data.whatsappNumber) {
        setWaNumber(data.whatsappNumber.replace(/\s+/g, ''));
      }
    });
  }, []);

  return (
    <div className="space-y-10 sm:space-y-16 pt-2 pb-10 sm:py-10">
      {/* --- Intro Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-12 shadow-xl border border-slate-100 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50/50 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-navy flex items-center gap-4">
              MBBS in Uzbekistan
              <img 
                src={uzbekistanFlag} 
                alt="Uzbekistan Flag" 
                className="w-12 h-8 object-cover rounded-md shadow-md border border-slate-100" 
              />
            </h2>
            <p className="text-cyan-600 font-semibold tracking-wide uppercase text-xs mt-2">Budget-Friendly, Globally Recognized</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-slate-600 leading-relaxed text-lg italic">
                "Uzbekistan offers high-quality medical education with a focus on practical skills and a supportive environment for international students."
              </p>
              <div className="space-y-4">
                <h4 className="text-sm font-black text-navy uppercase tracking-widest border-b border-slate-100 pb-2">Why Choose Uzbekistan?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {uzbekistanOverview.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-cyan-50/50 rounded-xl border border-cyan-100/50">
                      <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-600/20">
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

            <div className="relative p-2 sm:p-4 rounded-2xl sm:rounded-3xl overflow-hidden group shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(8,145,178,0.4)]">
              {/* Background colored container */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 opacity-100 group-hover:scale-110 transition-transform duration-700" />
              
              {/* Background dots decoration */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />

              <div className="relative z-10 bg-white/20 backdrop-blur-2xl rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/30 shadow-2xl overflow-hidden group-hover:scale-[1.02] group-hover:-translate-y-2 group-hover:border-white/60 transition-all duration-500">
                {/* Inner glow for glass depth */}
                <div className="absolute inset-0 border border-white/20 rounded-xl sm:rounded-2xl pointer-events-none" />
                
                {/* Subtle diagonal shine - Increased visibility */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 -left-[150%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-0 group-hover:duration-[1000ms] ease-in-out" />
                </div>

                <h3 className="text-xl font-bold mb-4 text-white relative z-10">International Standards</h3>
                <p className="text-white/90 text-sm leading-relaxed mb-6 relative z-10">
                  Degrees are fully recognized by WHO and NMC (India), ensuring graduates are eligible for global licensing exams like NEXT, USMLE, and PLAB.
                </p>
                <div className="flex gap-4 relative z-10">
                  <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold border border-white/30 text-white backdrop-blur-md">WHO</div>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold border border-white/30 text-white backdrop-blur-md">NMC</div>
                  <div className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold border border-white/30 text-white backdrop-blur-md">UNESCO</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Universities Section --- */}
      <div>
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-navy text-center mb-2 tracking-tight">Top Medical Institutions</h2>
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-cyan-500 rounded-full" />
        </div>

        <div className="space-y-12">
          {uzbekistanOverview.universities.map((uni, idx) => (
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
                <div className="bg-white rounded-lg sm:rounded-xl p-6 sm:p-10 shadow-lg border border-slate-50 flex flex-col h-full relative overflow-hidden group hover:border-cyan-200 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg className="w-24 h-24 text-navy" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-cyan-600 transition-colors uppercase tracking-tight">{idx + 1}. {uni.name}</h3>
                  <p className="text-slate-600 text-base leading-relaxed mb-8 font-medium">
                    {uni.description}
                  </p>

                  <div className="p-6 bg-cyan-50/50 rounded-lg border-l-4 border-amber-500 relative mb-8">
                    <span className="absolute -top-3 left-4 px-3 py-0.5 bg-amber-500 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-amber-500/20">University Highlight</span>
                    <p className="text-slate-700 text-sm leading-relaxed italic">
                      "{uni.highlight}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-100 flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> English Medium
                      </span>
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100 flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Research Oriented
                      </span>
                      <span className="px-4 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-[10px] font-bold border border-cyan-100 flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Government Inst.
                      </span>
                    </div>

                    <a
                      href={`https://wa.me/${waNumber}?text=Hi, I am interested in ${uni.name}, Uzbekistan.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-green-200 active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp Enquiry
                    </a>
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

export default UzbekistanDetailedGuide;

