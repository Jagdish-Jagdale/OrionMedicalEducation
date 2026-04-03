import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCountries, getUniversitiesByCountry } from '../firebase/firestore';
import CountryCard from '../components/CountryCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Globe3D from '../components/Globe3D';

const countryMeta = [
  { key: 'georgia', label: 'MBBS in Georgia', slug: 'georgia', flag: '🇬🇪', pos: { top: '20%', left: '20%' } },
  { key: 'russia', label: 'MBBS in Russia', slug: 'russia', flag: '🇷🇺', pos: { top: '20%', left: '80%' } },
  { key: 'kyrgyzstan', label: 'MBBS in Kyrgyzstan', slug: 'kyrgyzstan', flag: '🇰🇬', pos: { top: '85%', left: '25%' } },
  { key: 'uzbekistan', label: 'MBBS in Uzbekistan', slug: 'uzbekistan', flag: '🇺🇿', pos: { top: '85%', left: '75%' } },
];

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [universitiesMap, setUniversitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for selected country - Defaults to first country (e.g. Russia)
  const [selectedCountry, setSelectedCountry] = useState('russia');
  
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

  const handleCountrySelection = (slug) => {
    setSelectedCountry(slug);
    
    // Scroll specifically to the "In-Depth Guides" section header
    const el = document.getElementById('guides-section');
    if (el) {
      const navOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* ── INTERACTIVE 3D GLOBE SECTION ─────────────────── */}
      <div className="relative h-[85vh] flex items-center justify-center overflow-hidden border-b border-slate-50 bg-[#fbfcfd]">
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
                stroke={selectedCountry === country.slug ? '#2563eb' : 'url(#line-grad)'}
                strokeWidth={selectedCountry === country.slug ? '2' : '1'}
                strokeDasharray="4,4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            ))}
          </svg>

          {/* --- Central 3D Revolving Globe --- */}
          <div className="relative z-20 w-full h-full flex items-center justify-center">
            <Suspense fallback={<div className="w-56 h-56 rounded-full bg-slate-50 animate-pulse" />}>
              <div className="w-full h-full max-h-[85vh]">
                <Globe3D />
              </div>
            </Suspense>
          </div>

          {/* --- Orbital Country Navigation Labels --- */}
          {countryMeta.map((meta, i) => (
            <motion.button
              key={meta.slug}
              id={`node-${meta.slug}`}
              onClick={() => handleCountrySelection(meta.slug)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + i * 0.15 }}
              className="absolute z-40 -translate-x-1/2 -translate-y-1/2 group sm:block cursor-pointer active:scale-95 transition-all"
              style={{ top: meta.pos.top, left: meta.pos.left }}
            >
              <div className={`bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.08)] border transition-all duration-300 min-w-[200px] text-center relative group ${selectedCountry === meta.slug ? 'border-blue-600 shadow-blue-500/20' : 'border-white hover:border-blue-300'}`}>
                <div className={`absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 bg-white rounded-full border border-blue-100 flex items-center justify-center shadow-sm group-hover:scale-125 transition-all ${selectedCountry === meta.slug ? 'scale-125 border-blue-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full ${selectedCountry === meta.slug ? 'bg-blue-600' : 'bg-blue-300 animate-pulse'}`} />
                </div>
                <div className="text-xl mb-1">{meta.flag}</div>
                <h3 className={`font-bold transition-colors uppercase tracking-widest text-[11px] mb-1 ${selectedCountry === meta.slug ? 'text-blue-600' : 'text-navy group-hover:text-blue-500'}`}>
                  {meta.label}
                </h3>
                <div className="h-0.5 bg-slate-100 w-full rounded-full overflow-hidden mt-2">
                   <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className={`h-full origin-left ${selectedCountry === meta.slug ? 'bg-blue-600' : 'bg-blue-200'}`} transition={{ duration: 1, delay: 1.2 + i * 0.1 }} />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── COUNTRY INFORMATION PORTAL (Filtered) ──────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-slate-50/50 min-h-[80vh]">
        <motion.div 
          id="guides-section"
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="text-center mb-16 scroll-mt-32"
        >
          <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">Selected Destination Portal</span>
          <h2 className="text-3xl font-bold text-navy mt-2">Detailed Destination Guides</h2>
        </motion.div>

        <div className="space-y-10">
          {countryMeta.filter(m => m.slug === selectedCountry).map((meta) => {
            const country = countries.find(c => c.slug === meta.slug || (c.name && c.name.toLowerCase() === meta.slug));
            const universities = country ? universitiesMap[country.id] || [] : [];
            
            return (
              <motion.section 
                 key={meta.slug} 
                 id={meta.slug} 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="min-h-[500px]"
              >
                {loading ? (
                  <div className="space-y-6">
                    <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-md" />
                    <LoadingSkeleton count={3} type="card" />
                  </div>
                ) : error ? (
                   <div className="p-8 bg-white rounded-3xl border border-red-50 text-red-500 italic">Information for {meta.label} is currently unavailable.</div>
                ) : country ? (
                  <CountryCard country={country} universities={universities} />
                ) : (
                   <div className="p-8 bg-white rounded-3xl border border-blue-50 text-slate-400 italic">Synchronizing world data for {meta.label}...</div>
                )}
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Countries;
