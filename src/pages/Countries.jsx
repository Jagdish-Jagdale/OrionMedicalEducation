import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCountries, getUniversitiesByCountry } from '../firebase/firestore';
import CountryCard from '../components/CountryCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const countryMeta = [
  { key: 'georgia', label: 'MBBS in Georgia', slug: 'georgia', flag: '🇬🇪', pos: { top: '20%', left: '20%' } },
  { key: 'russia', label: 'MBBS in Russia', slug: 'russia', flag: '🇷🇺', pos: { top: '20%', left: '80%' } },
  { key: 'kyrgyzstan', label: 'MBBS in Kyrgyzstan', slug: 'kyrgyzstan', flag: '🇰🇬', pos: { top: '80%', left: '20%' } },
  { key: 'uzbekistan', label: 'MBBS in Uzbekistan', slug: 'uzbekistan', flag: '🇺🇿', pos: { top: '80%', left: '80%' } },
];

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [universitiesMap, setUniversitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const countriesData = await getCountries();
      setCountries(countriesData);

      const uniMap = {};
      await Promise.all(
        countriesData.map(async (country) => {
          const unis = await getUniversitiesByCountry(country.id);
          uniMap[country.id] = unis;
        })
      );
      setUniversitiesMap(uniMap);
    } catch (err) {
      setError('Failed to load country details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const scrollToCountry = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* ── INTERACTIVE GLOBE SECTION ───────────────────── */}
      <div className="relative h-[85vh] flex items-center justify-center overflow-hidden border-b border-slate-50">
        {/* Subtle architectural grid bg */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e3a5f 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative w-full max-w-7xl h-full flex items-center justify-center">
          
          {/* SVG Connecting Lines Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 lg:block hidden">
            <defs>
              <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {countryMeta.map((country) => (
              <motion.line
                key={`line-${country.slug}`}
                x1="50%"
                y1="50%"
                x2={country.pos.left}
                y2={country.pos.top}
                stroke="url(#line-grad)"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            ))}
          </svg>

          {/* --- Central Rotating High-Contrast Globe --- */}
          <div className="relative z-20">
            {/* Ambient Lighting */}
            <div className="absolute -inset-24 bg-blue-50/60 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-[420px] md:h-[420px] rounded-full bg-white shadow-[inset_-30px_-30px_70px_rgba(30,58,95,0.15),0_20px_50px_rgba(0,0,0,0.08),0_0_80px_rgba(37,99,235,0.05)] border border-slate-100 overflow-hidden group"
            >
              {/* Higher Contrast Rotating Map */}
              <motion.div
                animate={{ backgroundPositionX: ['0%', '-200%'] }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 opacity-[0.25] brightness-90 contrast-125"
                style={{
                  backgroundImage: `url('https://www.transparenttextures.com/patterns/world-map.png')`,
                  backgroundSize: '200% 100%',
                  backgroundRepeat: 'repeat-x',
                  filter: 'invert(0.8) hue-rotate(200deg) sepia(0.2)',
                }}
              />
              
              {/* Glass Reflection Sphere */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_60%)] pointer-events-none" />
              <div className="absolute inset-0 border-[10px] border-white/40 blur-[5px] rounded-full pointer-events-none" />
              
              {/* Central Pinpoint Marker Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
                <svg className="w-1/3 h-1/3 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v20M2 12h20" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>

            {/* Orbiting Orbital Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-10 border border-dashed border-blue-400/20 rounded-full pointer-events-none lg:block hidden"
            />
          </div>

          {/* --- Orbital Country Navigation Labels --- */}
          {countryMeta.map((meta, i) => (
            <motion.button
              key={meta.slug}
              onClick={() => scrollToCountry(meta.slug)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
              className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 group sm:block ${i > 1 ? 'mt-4 sm:mt-0' : ''}`}
              style={{ top: meta.pos.top, left: meta.pos.left }}
            >
              <div className="bg-white px-5 py-3.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 min-w-[200px] text-center relative group">
                {/* Visual Pinpoint Node */}
                <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 bg-white rounded-full border border-blue-100 flex items-center justify-center shadow-sm group-hover:scale-125 transition-all">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                </div>

                <div className="text-xl mb-1">{meta.flag}</div>
                <h3 className="font-bold text-navy group-hover:text-blue-600 transition-colors uppercase tracking-widest text-[10px] mb-1">
                  {meta.label}
                </h3>
                <div className="h-0.5 bg-slate-100 w-full rounded-full overflow-hidden mt-2">
                   <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    className="h-full bg-blue-600 origin-left" 
                    transition={{ duration: 1, delay: 1.2 + i * 0.1 }}
                   />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── COUNTRY INFORMATION LIST ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-50/50">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">In-Depth Guides</span>
          <h2 className="text-3xl font-bold text-navy mt-2">Detailed Destination Portals</h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LoadingSkeleton count={4} type="card" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-slate-500 mb-4">{error}</p>
            <button onClick={fetchData} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700">Try Again</button>
          </div>
        ) : (
          <div className="space-y-24">
            {countryMeta.map((meta) => {
              const country = countries.find(c => c.slug === meta.slug || c.name.toLowerCase() === meta.slug);
              if (!country) return null;
              const universities = universitiesMap[country.id] || [];
              return (
                <section key={meta.slug} id={meta.slug} className="scroll-mt-32">
                  <CountryCard country={country} universities={universities} />
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Countries;
