import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCountries, getUniversitiesByCountry } from '../firebase/firestore';
import CountryCard from '../components/CountryCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Globe3D from '../components/Globe3D';
import RussiaDetailedGuide from '../components/RussiaDetailedGuide';
import KyrgyzstanDetailedGuide from '../components/KyrgyzstanDetailedGuide';
import GeorgiaDetailedGuide from '../components/GeorgiaDetailedGuide';
import UzbekistanDetailedGuide from '../components/UzbekistanDetailedGuide';

// Import Flag Images
import georgiaFlag from '../assets/flags/georgiaflag.png';
import russiaFlag from '../assets/flags/russiaflag.png';
import kyrgyzstanFlag from '../assets/flags/kyrgyzstanflag.png';
import uzbekistanFlag from '../assets/flags/uzbekistanflag.png';
import kazakhstanFlag from '../assets/flags/kazakhstanflag.png';

const countryMeta = [
  { key: 'georgia', label: 'GEORGIA', slug: 'georgia', flag: georgiaFlag, pos: { top: '24%', left: '70%', dtTop: '18%', dtLeft: '82%' } },
  { key: 'uzbekistan', label: 'UZBEKISTAN', slug: 'uzbekistan', flag: uzbekistanFlag, pos: { top: '92%', left: '50%', dtTop: '97%', dtLeft: '50%' } },
  { key: 'kazakhstan', label: 'KAZAKHSTAN', slug: 'kazakhstan', flag: kazakhstanFlag, pos: { top: '76%', left: '70%', dtTop: '82%', dtLeft: '82%' } },
  { key: 'russia', label: 'RUSSIA', slug: 'russia', flag: russiaFlag, pos: { top: '24%', left: '30%', dtTop: '18%', dtLeft: '18%' } },
  { key: 'kyrgyzstan', label: 'KYRGYZSTAN', slug: 'kyrgyzstan', flag: kyrgyzstanFlag, pos: { top: '76%', left: '30%', dtTop: '82%', dtLeft: '18%' } },
];

const Countries = () => {
  const [countries, setCountries] = useState([]);
  const [universitiesMap, setUniversitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState('russia');
  const [isGlobeLoaded, setIsGlobeLoaded] = useState(false);
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024); // Use 1024 for tablet/mobile spread

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="min-h-screen bg-white pt-15 sm:pt-20">
      {/* ── INTERACTIVE 3D GLOBE SECTION ─────────────────── */}
      <div className="relative h-[50vh] sm:h-[85vh] pt-10 sm:pt-0 flex items-center justify-center overflow-hidden border-b border-slate-50 bg-[#fbfcfd]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e3a5f 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative w-full max-w-7xl h-full flex items-center justify-center">

          {/* SVG Connecting Lines Layer - Precision 100x100 Grid */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="line-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.08" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            {countryMeta.map((country, i) => {
              const finalLeft = isMobile ? country.pos.left : country.pos.dtLeft;
              const finalTop = isMobile ? country.pos.top : country.pos.dtTop;

              const x2_raw = parseFloat(finalLeft);
              const y2_raw = parseFloat(finalTop);
              const isLeft = x2_raw < 50;

              // REFINED GEOMETRY: Calculate exact starting point on globe surface
              const globe_radius = isMobile ? 18.2 : 24.5;
              const x_offset_raw = isMobile ? 7 : 14;
              const isVerticalStraight = Math.abs(x2_raw - 50) < 2; // Top or Bottom center
              const isHorizontalStraight = Math.abs(y2_raw - 50) < 2; // Left or Right center

              const x_start = isVerticalStraight ? 50 : (isLeft
                ? 50 - x_offset_raw
                : 50 + x_offset_raw);

              const dx_anchor = x_start - 50;
              const dy_anchor = Math.abs(dx_anchor) >= globe_radius ? 0 : Math.sqrt(Math.pow(globe_radius, 2) - Math.pow(dx_anchor, 2));

              const isTop = y2_raw < 50;
              const y_start = isHorizontalStraight ? 50 : (isTop ? 50 - dy_anchor : 50 + dy_anchor);

              const dy_total = y2_raw - y_start;
              const leanFactor = isMobile ? 0.18 : 0.35;
              const dx_lean = x2_raw === x_start ? 0 : (x2_raw < x_start ? -1 : 1) * (Math.abs(dy_total) * leanFactor);
              const x_mid = x_start + dx_lean;

              // Generalized Responsive Offsets for "Straight" connections
              let x_start_final = x_start;
              let y_start_final = y_start;
              let x_end_final = x2_raw;

              if (isVerticalStraight) {
                const vertOffset = isMobile ? 0.2 : 7.80;
                y_start_final = isTop ? y_start - vertOffset : y_start + vertOffset;
                // Tiny balanced offset to prevent browser rendering glitch on vertical lines
                x_start_final += 0.05;
                x_end_final -= 0.05;
              } else if (isHorizontalStraight) {
                const horizOffset = isMobile ? 1.5 : 6.8;
                x_start_final = isLeft ? x_start - horizOffset : x_start + horizOffset;
              }

              const y2 = y2_raw;
              const d = (isVerticalStraight || isHorizontalStraight)
                ? `M ${x_start_final} ${y_start_final} L ${x_end_final} ${y2}`
                : `M ${x_start} ${y_start} L ${x_mid} ${y2} L ${x2_raw} ${y2}`;

              return (
                <g key={`line-group-${country.slug}`}>
                  {/* Anchor Point on Globe */}
                  <motion.circle
                    cx={x_start_final}
                    cy={y_start_final}
                    r={0.18}
                    fill="#3b82f6"
                    initial={{ scale: 0 }}
                    animate={isGlobeLoaded ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  />

                  <motion.path
                    d={d}
                    fill="none"
                    stroke={selectedCountry === country.slug ? '#2563eb' : 'url(#line-grad)'}
                    strokeWidth={(isVerticalStraight || isHorizontalStraight) ? (isMobile ? 0.8 : 1.4) : (isMobile ? 0.22 : 0.35)}
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={isGlobeLoaded ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  />

                  {/* Corner Node */}
                  <motion.circle
                    cx={x_mid}
                    cy={y2}
                    r={0.12}
                    fill="#3b82f6"
                    opacity={0.6}
                    initial={{ scale: 0 }}
                    animate={isGlobeLoaded ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  />
                </g>
              );
            })}
          </svg>

          {/* --- Central 3D Globe --- */}
          <div className="relative z-20 w-[56%] sm:w-[54%] aspect-square flex items-center justify-center">
            <Suspense fallback={<div className="w-40 h-40 rounded-full bg-slate-50 animate-pulse" />}>
              <div className="w-full h-full max-h-[85vh]">
                <Globe3D onLoad={() => setIsGlobeLoaded(true)} />
              </div>
            </Suspense>
          </div>

          {/* --- Orbital Country Navigation Labels --- */}
          {countryMeta.map((meta, i) => {
            const isLeft = parseFloat(meta.pos.left) < 50;
            const isTop = parseFloat(meta.pos.top) < 50;

            return (
              <motion.div
                key={meta.slug}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isGlobeLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
                className="absolute z-40"
                style={{
                  top: isMobile ? meta.pos.top : meta.pos.dtTop,
                  left: isMobile ? meta.pos.left : meta.pos.dtLeft,
                }}
              >
                <div className="relative w-0 h-0">
                  {/* Unified Fusion Container - Forces Dot and Card onto the same vertical axis */}
                  <div
                    className={`absolute top-0 flex items-center pointer-events-none -translate-y-1/2 ${meta.slug === 'uzbekistan' ? 'flex-col -translate-x-1/2' : (isLeft ? 'flex-row-reverse right-0' : 'flex-row left-0')}`}
                    style={{ zIndex: 50 }}
                  >
                    {/* Visual Pinpoint Dot - THE ANCHOR */}
                    <div className={`relative w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full border-2 sm:border-[3px] border-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] flex-shrink-0 z-50`}>
                      <div className="absolute inset-[-4px] rounded-full border border-blue-200/50 animate-ping opacity-20" />
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${selectedCountry === meta.slug ? 'bg-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.6)]' : 'bg-blue-300'}`} />
                    </div>

                    {/* The Card Button - Fused directly with zero gap using negative horizontal offset */}
                    <div
                      className="relative pointer-events-none"
                      style={{
                        width: isMobile ? '72px' : '210px',
                        [meta.slug === 'uzbekistan' ? 'marginTop' : (isLeft ? 'marginRight' : 'marginLeft')]: isMobile ? '-2px' : (meta.slug === 'uzbekistan' ? '-8px' : '-12px')
                      }}
                    >
                      <motion.button
                        onClick={() => handleCountrySelection(meta.slug)}
                        className={`relative w-full pointer-events-auto
                          bg-white/95 backdrop-blur-md px-2 sm:px-6 py-1.5 sm:py-4 rounded-lg sm:rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.18)] border transition-all duration-300 group active:scale-95 whitespace-nowrap
                          ${selectedCountry === meta.slug ? 'border-blue-600 shadow-blue-500/25 scale-105' : 'border-slate-100 hover:border-blue-400'}`}
                      >
                        <h3 className={`w-full font-black transition-colors uppercase flex items-center justify-center gap-1 sm:gap-3 tracking-[0.1em] sm:tracking-[0.2em] text-[6.2px] sm:text-[14px] ${selectedCountry === meta.slug ? 'text-blue-600' : 'text-navy group-hover:text-blue-600'}`}>
                          <div className="w-4 h-2.5 sm:w-10 sm:h-6 rounded-[1px] sm:rounded-sm overflow-hidden border border-slate-100 flex-shrink-0 shadow-sm">
                            <img src={meta.flag} alt={meta.label} className="w-full h-full object-cover" />
                          </div>
                          {meta.label}
                        </h3>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── COUNTRY INFORMATION PORTAL (Filtered) ──────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:py-20 bg-slate-50/50 min-h-[80vh]">
        <motion.div
          id="guides-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-16 scroll-mt-32"
        >
          <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">Selected Destination Portal</span>
          <h2 className="text-3xl font-bold text-navy mt-2">Detailed Destination Guides</h2>
        </motion.div>

        <div className="space-y-6 sm:space-y-10">
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
                ) : meta.slug === 'russia' ? (
                  <RussiaDetailedGuide />
                ) : meta.slug === 'kyrgyzstan' ? (
                  <KyrgyzstanDetailedGuide />
                ) : meta.slug === 'georgia' ? (
                  <GeorgiaDetailedGuide />
                ) : meta.slug === 'uzbekistan' ? (
                  <UzbekistanDetailedGuide />
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
