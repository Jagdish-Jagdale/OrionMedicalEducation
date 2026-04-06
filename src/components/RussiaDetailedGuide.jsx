import React from 'react';
import { motion } from 'framer-motion';
import { russiaOverview } from '../data/russiaData';

const RussiaDetailedGuide = () => {
  return (
    <div className="space-y-16 py-10">
      {/* --- Intro Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-12 shadow-xl border border-slate-100 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl">🇷🇺</span>
            <div>
              <h2 className="text-3xl font-bold text-navy">MBBS in Russia</h2>
              <p className="text-blue-600 font-semibold tracking-wide uppercase text-xs mt-1">Premier Medical Destination</p>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <p className="text-slate-600 leading-relaxed text-lg italic">
                "Russia offers globally-recognized medical degrees with an emphasis on clinical research and advanced technology."
              </p>
              <div className="space-y-4">
                <h4 className="text-sm font-black text-navy uppercase tracking-widest border-b border-slate-100 pb-2">Why Choose Russia?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {russiaOverview.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/20">
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
            
            <div className="bg-gradient-to-br from-navy to-blue-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
               <h3 className="text-xl font-bold mb-4 relative z-10">Global Recognition</h3>
               <p className="text-blue-100 text-sm leading-relaxed mb-6 relative z-10">
                 Degrees from Russian medical universities are recognized by WHO, WDOMS, and medical councils around the world, including the NMC (India). This allows graduates to practice globally after clearing respective licensing exams.
               </p>
               <div className="flex gap-4 relative z-10">
                 <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/20">NMC</div>
                 <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold border border-white/20">WHO</div>
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
          <div className="w-16 sm:w-20 h-1 sm:h-1.5 bg-amber-500 rounded-full" />
        </div>

        <div className="space-y-12">
          {russiaOverview.universities.map((uni, idx) => (
            <motion.div
              key={uni.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-stretch transform transition-all`}
            >
              {/* Image Side */}
              <div className="lg:w-1/3 relative group">
                <div className="absolute inset-0 bg-blue-600 rounded-2xl sm:rounded-[2.5rem] rotate-3 scale-[1.02] -z-10 opacity-10 group-hover:rotate-1 transition-transform duration-500" />
                <div className="h-full min-h-[250px] sm:min-h-[300px] rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl relative">
                  <img 
                    src={uni.image} 
                    alt={uni.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 text-white text-5xl font-black opacity-20 select-none">{String(idx + 1).padStart(2, '0')}</div>
                </div>
              </div>

              {/* Content Side */}
              <div className="lg:w-2/3 flex flex-col justify-center">
                <div className="bg-white rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-lg border border-slate-50 flex flex-col h-full relative overflow-hidden group hover:border-blue-200 hover:shadow-blue-500/5 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg className="w-24 h-24 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-blue-600 transition-colors">{uni.name}</h3>
                  <p className="text-slate-600 text-base leading-relaxed mb-6 font-medium">
                    {uni.description}
                  </p>
                  
                  <div className="mt-auto p-5 bg-slate-50 rounded-2xl border-l-4 border-amber-500 relative">
                     <span className="absolute -top-3 left-4 px-2 bg-amber-500 text-[10px] font-black text-white rounded uppercase tracking-widest">Key Highlight</span>
                     <p className="text-slate-700 text-sm leading-relaxed">
                       {uni.highlight}
                     </p>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> English Medium
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Research Oriented
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

export default RussiaDetailedGuide;
