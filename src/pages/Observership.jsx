import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getObservership } from '../firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import PageTitle from '../components/PageTitle';

const Observership = () => {
   const { data: observership, loading } = useFirestore(getObservership);
   const [waNumber, setWaNumber] = useState('');

   useEffect(() => {
     import('../firebase/firestore').then(({ getHomeContent }) => {
       getHomeContent().then((data) => {
         if (data && data.whatsappNumber) {
           const cleanNum = data.whatsappNumber.replace(/\D/g, '');
           setWaNumber(cleanNum.length === 10 ? `91${cleanNum}` : cleanNum);
         }
       });
     });
   }, []);

  const backgroundDots = React.useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e0f2fe] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const content = observership || {};
  const sectionIcons = ['🏥', '🔬', '🏅', '📋', '🤝', '🌍'];

  return (
    <div className="min-h-screen bg-[#e0f2fe] pt-20 relative overflow-hidden font-sans">
      <div className="absolute inset-0 pointer-events-none z-0">
        {backgroundDots.map((dot) => (
          <div key={dot.id} className="absolute bg-blue-400 rounded-full" style={{ top: dot.top, left: dot.left, width: `${dot.size}px`, height: `${dot.size}px`, opacity: dot.opacity }} />
        ))}
      </div>
      
      <PageTitle title="Observership" />

      {/* Header Banner - Standardized to Team Style */}
      <div className="relative py-16 sm:py-24 px-6 text-center overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
           <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]" />
           <div className="absolute inset-0 opacity-100" style={{ background: 'linear-gradient(110deg, #2563eb 0%, #1e3a5f 65%, #1e3a5f 100%)' }} />
           {/* Dot Pattern Overlay */}
           <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1.5px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
          {content.mainHeading && (
            <div className="flex justify-center mb-6">
               <span className="inline-block text-amber-400 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] border border-white/20 bg-white/10 px-6 py-2.5 rounded-full backdrop-blur-md shadow-2xl">
                  {content.mainHeading}
               </span>
            </div>
          )}
          
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-6 leading-tight tracking-normal">
            {content.mainSubheading?.includes(':') ? (
              <>
                {content.mainSubheading.split(':')[0]}:<br />
                <span className="text-white opacity-90">{content.mainSubheading.split(':')[1]}</span>
              </>
            ) : (
              content.mainSubheading
            )}
          </h1>
          
          <p className="text-blue-100/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
            {content.mainDescription}
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 relative z-10">
        {content.introTitle && (
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-slate-100">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-4">{content.introTitle}</h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              {content.introDescription}
            </p>
          </motion.section>
        )}

        {content.points?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f] text-center mb-8">{content.pointsTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.points.map((point, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl">
                  <div className="text-4xl mb-4">{sectionIcons[i % 3]}</div>
                  <h3 className="font-bold text-[#1e3a5f] text-lg mb-2 group-hover:text-blue-700 transition-colors">{point.pointText}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{point.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {content.gridItems?.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-[#1e3a5f] to-blue-700 rounded-3xl p-8 sm:p-12 text-white">
            <h2 className="text-2xl font-bold mb-2">{content.gridTitle}</h2>
            <p className="text-blue-200 text-sm mb-8">{content.gridDescription}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.gridItems.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    <p className="text-blue-200 text-xs mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {content.bottomItems?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[#1e3a5f] text-center mb-8">{content.bottomTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.bottomItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center bg-white rounded-2xl p-6 shadow-md border border-slate-100">
                  <div className="text-4xl mb-4">{sectionIcons[(i % 3) + 3]}</div>
                  <h3 className="font-bold text-[#1e3a5f] mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {content.finalTitle && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center bg-amber-50 border border-amber-200 rounded-3xl p-10">
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-3">{content.finalTitle}</h2>
            <p className="text-slate-500 text-sm mb-6">{content.finalDescription}</p>
            <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-full transition-all text-xs sm:text-sm shadow-lg shadow-green-100 hover:scale-105 active:scale-95">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              {content.finalButtonLabel}
            </a>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Observership;
