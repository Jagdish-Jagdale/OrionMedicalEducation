import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import airplaneImg from '../assets/splash/airoplane.png';
import orionLogo from '../assets/orionfullrmbg.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import WelcomeBanner from '../components/WelcomeBanner';
import PageTitle from '../components/PageTitle';
import StatCounter from '../components/StatCounter';

import heroVideo from '../assets/Make_flags_wave_202604281710.mp4';
import { subscribeToHomeContent, subscribeToReviews, getHomeContentFromCache } from '../firebase/firestore';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const slideUp = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const HeroSkeleton = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(to left, #112e51, #2052c1)' }}>
    <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 sm:py-32 grid lg:grid-cols-2 gap-12 items-center w-full">
      <div className="space-y-6 animate-pulse">
        <div className="h-20 w-48 bg-white/10 rounded-2xl" />
        <div className="h-10 w-32 bg-amber-400/20 rounded-full" />
        <div className="space-y-3">
          <div className="h-16 w-full bg-white/10 rounded-2xl" />
          <div className="h-16 w-3/4 bg-white/10 rounded-2xl" />
        </div>
        <div className="h-24 w-full bg-white/5 rounded-2xl" />
        <div className="flex gap-4">
          <div className="h-14 w-40 bg-white/20 rounded-full" />
          <div className="h-14 w-40 bg-green-500/20 rounded-full" />
        </div>
      </div>
      <div className="aspect-video bg-white/10 rounded-[2rem] animate-pulse" />
    </div>
  </section>
);

const ReviewCard = ({ rev }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div ref={cardRef} className="bg-white rounded-2xl p-6 md:p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full relative group/card flex flex-col min-h-[250px]">
      <div className="absolute top-6 right-6 w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center group-hover/card:bg-amber-100 transition-colors">
        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 32 32">
          <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
        </svg>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="w-16 h-14 overflow-hidden border-2 border-slate-50 shadow-sm bg-slate-50 rounded-lg">
          {rev.image ? (
            <img src={rev.image} alt={rev.studentName} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-navy text-lg leading-tight">{rev.studentName || rev.name}</h4>
          <p className="text-slate-400 text-xs font-semibold">{rev.university}</p>
        </div>
      </div>

      <div className="flex gap-1 text-amber-400 mb-4">
        {[...Array(Number(rev.rating || 5))].map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <div className="flex-grow">
        <p className={`text-slate-600 italic text-base leading-relaxed ${!isExpanded ? "line-clamp-3" : ""}`}>
          "{rev.reviewText || rev.text}"
        </p>
        {(rev.reviewText || rev.text)?.length > 120 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-xs font-bold mt-2 hover:text-blue-700 transition-colors uppercase tracking-wider text-left border-none bg-transparent p-0 cursor-pointer"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
};

const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }
  return `https://${url}`;
};

// ─── Precomputed 60-point sine-curve keyframes for buttery smooth plane arcrr ───
const PLANE_N = 60;
const PLANE_TIMES = Array.from({ length: PLANE_N + 1 }, (_, i) => i / PLANE_N);
const PLANE_LEFT = Array.from({ length: PLANE_N + 1 }, (_, i) => `${2 + (i / PLANE_N) * 89}%`);
const PLANE_Y = Array.from({ length: PLANE_N + 1 }, (_, i) => {
  const t = i / PLANE_N;
  return -120 * Math.sin(t * Math.PI); // single arc height for all screen sizes
});
const PLANE_ROTATE = Array.from({ length: PLANE_N + 1 }, (_, i) => {
  const t = i / PLANE_N;
  return -28 * Math.sin(2 * t * Math.PI);
});

const Home = () => {
  const [content, setContent] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    // 1. Try to load from cache immediately for fast Hero display
    getHomeContentFromCache().then(cachedData => {
      if (cachedData) {
        setContent(cachedData);
        if (cachedData.testimonialsItems) {
          setReviews(cachedData.testimonialsItems);
        }
      }
    });

    // 2. Subscribe to real-time updates
    const unsubscribeContent = subscribeToHomeContent((data) => {
      setContent(data);
      if (data?.testimonialsItems) {
        setReviews(data.testimonialsItems);
      }
      // Once we have data, wait a tiny bit then show the rest of the page
      setTimeout(() => setShowRest(true), 100);
    });

    return () => {
      unsubscribeContent();
    };
  }, []);

  const waNumber = content?.whatsappNumber;

  const hero = {
    badge: content?.heroHeading,
    heading: content?.heroSubHeading,
    company: content?.heroCompanyName,
    desc: content?.heroDescription,
    btn1: content?.heroBtn1,
    btn2: content?.heroBtn2
  };

  const about = {
    badge: content?.aboutHeading,
    mainTitle: content?.aboutSubHeading,
    desc: content?.aboutDescription,
    brandingText: content?.aboutBrandingText,
    mission: content?.aboutMissionHeading,
    missionAuthor: content?.aboutMissionAuthor
  };

  const focusCards = [
    { title: content?.aboutCard1Heading, desc: content?.aboutCard1SubHeading, icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
    { title: content?.aboutCard2Heading, desc: content?.aboutCard2SubHeading, icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
    { title: content?.aboutCard3Heading, desc: content?.aboutCard3SubHeading, icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>) }
  ].filter(c => c.title);

  const stats = [
    { value: content?.aboutStat1Count, label: content?.aboutStat1Desc },
    { value: content?.aboutStat2Count, label: content?.aboutStat2Desc },
    { value: content?.aboutStat3Count, label: content?.aboutStat3Desc },
    { value: content?.aboutStat4Count, label: content?.aboutStat4Desc },
  ];

  const clinical = {
    badge: content?.clinicalTrainingTitle,
    mainTitle: content?.clinicalTrainingSubTitle,
    desc: content?.clinicalTrainingDesc
  };

  const videos = [
    { title: content?.video1Title, synopsis: content?.video1Synopsis, url: content?.video1Url },
    { title: content?.video2Title, synopsis: content?.video2Synopsis, url: content?.video2Url },
    { title: content?.video3Title, synopsis: content?.video3Synopsis, url: content?.video3Url },
    { title: content?.video4Title, synopsis: content?.video4Synopsis, url: content?.video4Url },
  ].filter(v => v.title);

  const testimonials = {
    title: content?.testimonialsTitle,
    subtitle: content?.testimonialsSubtitle,
    description: content?.testimonialsDescription
  };

  const cta = {
    heading: content?.ctaHeading,
    desc: content?.ctaDesc,
    btn1: content?.ctaBtn1,
    btn2: content?.ctaBtn2
  };

  return (
    <div className="font-sans">
      <PageTitle title="Home" />
      <WelcomeBanner />

      {!content ? (
        <HeroSkeleton />
      ) : (
        <>
          {/* ── Hero Section ────────────────────────────────── */}
          <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(to left, #112e51, #2052c1)' }}>
            <div className="absolute top-0 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]" />




            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-28 sm:py-32 grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="text-center lg:text-left"
              >
                <motion.div variants={slideUp} className="mb-4 sm:mb-8 flex justify-center lg:justify-start">
                  <img
                    src={orionLogo}
                    alt="Orion Medical Education"
                    className="h-16 sm:h-20 w-auto object-contain brightness-0 invert"
                    fetchPriority="high"
                  />
                </motion.div>
                {hero.badge && (
                  <motion.div variants={slideUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-amber-400 text-[10px] sm:text-xs font-bold px-4 py-2 rounded-full border border-white/20 mb-6">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    {hero.badge}
                  </motion.div>
                )}
                <motion.h1 variants={slideUp} className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">{hero.heading}</motion.h1>
                {hero.company && <motion.p variants={slideUp} className="mt-4 text-lg sm:text-xl font-bold text-amber-400">{hero.company}</motion.p>}
                {hero.desc && <motion.p variants={slideUp} className="mt-6 text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">{hero.desc}</motion.p>}
                <motion.div variants={slideUp} className="mt-8 flex flex-row gap-3 justify-center lg:justify-start">
                  {hero.btn1 && <Link to="/countries" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 sm:px-8 py-3 sm:py-4 rounded-full transition-all text-xs sm:text-sm shadow-xl shadow-blue-900/30 flex-1 sm:flex-none">{hero.btn1}</Link>}
                  {hero.btn2 && <a href={ensureAbsoluteUrl(waNumber ? `https://wa.me/${waNumber}` : '')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-5 sm:px-8 py-3 sm:py-4 rounded-full transition-all text-xs sm:text-sm shadow-xl shadow-green-500/30 flex-1 sm:flex-none">{hero.btn2}</a>}
                </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5 }} className="relative w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
                <video
                  src={heroVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                />
              </motion.div>
            </div>

            {/* Hero Bottom Structure - MBBS on left, ABROAD on right, Flying Plane between */}
            <div className="absolute bottom-0 inset-x-0 z-20 px-6 sm:px-12 lg:px-[12%]">
              <div className="relative w-full flex items-end justify-between pb-6">
                {/* MBBS Text */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="text-base sm:text-xl lg:text-3xl font-black text-white italic tracking-tighter uppercase select-none opacity-40 hover:opacity-100 transition-opacity"
                >
                  MBBS
                </motion.div>

                {/* ABROAD Text */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="text-base sm:text-xl lg:text-3xl font-black text-white italic tracking-tighter uppercase select-none opacity-40 hover:opacity-100 transition-opacity"
                >
                  ABROAD
                </motion.div>
              </div>

              {/* Flying Airplane - Framer Motion smooth arc between MBBS and ABROAD */}
              <div className="absolute inset-x-0 bottom-[72px] sm:bottom-[108px] z-30 pointer-events-none overflow-visible px-6 sm:px-12 lg:px-[12%]">
                <div className="relative w-full h-0">
                  <motion.img
                    src={airplaneImg}
                    alt="airplane"
                    initial={{ left: "0%", y: 0, rotate: 0 }}
                    animate={{
                      left: PLANE_LEFT,
                      y: PLANE_Y,
                      rotate: PLANE_ROTATE,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 12,
                      ease: "linear",
                      times: PLANE_TIMES,
                      repeatDelay: 2.5,
                    }}
                    className="w-10 sm:w-12 lg:w-16 h-auto object-contain"
                    style={{
                      position: 'absolute',
                      transform: 'translateY(-50%)',
                      filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.9)) drop-shadow(0 0 16px rgba(255,255,255,0.5))',
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {showRest && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {/* --- About Section --------------------------------- */}
              <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, margin: "-100px" }}
                    className="text-center max-w-3xl mx-auto mb-16"
                  >
                    {about.badge && <motion.span variants={slideUp} className="inline-block text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">{about.badge}</motion.span>}
                    {about.mainTitle && (
                      <motion.h2 variants={slideUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-tight">
                        {about.mainTitle.includes(' — ') ? (
                          <>
                            {about.mainTitle.split(' — ')[0]} — <span className="text-amber-500">{about.mainTitle.split(' — ')[1]}</span>
                          </>
                        ) : about.mainTitle}
                      </motion.h2>
                    )}
                    {about.desc && <motion.p variants={slideUp} className="mt-4 text-slate-500 leading-relaxed">{about.desc}</motion.p>}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative py-10 px-6 sm:px-12 rounded-[3.5rem] overflow-hidden mb-20 shadow-2xl border border-white/10 group/container min-h-[350px] flex items-center justify-center"
                    style={{ background: 'linear-gradient(to left, #112e51, #2052c1)' }}
                  >
                    {/* Background decoration */}
                    <div className="absolute inset-0 pointer-events-none z-[1]">
                      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-full blur-[120px] -mr-20 -mt-20" />
                      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-white/5 rounded-full blur-[120px] -ml-20 -mb-20" />
                      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1.5px, transparent 0)', backgroundSize: '32px 32px' }} />
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10" style={{ perspective: '1200px' }}>
                      {focusCards.map((card, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          whileHover={{
                            y: -15,
                            scale: 1.04,
                            rotateX: 4,
                            rotateY: -2,
                            z: 40
                          }}
                          viewport={{ once: true }}
                          transition={{
                            initial: { delay: i * 0.15, duration: 0.8 },
                            default: { type: 'spring', stiffness: 400, damping: 30 }
                          }}
                          className="group relative bg-gradient-to-br from-white/30 to-white/5 backdrop-blur-2xl rounded-3xl py-5 px-6 border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden cursor-pointer max-w-[340px] mx-auto"
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* Inner glow for glass depth */}
                          <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none" />

                          {/* Diagonal Shine Effect */}
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 -left-[150%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-0 group-hover:duration-[1500ms] ease-in-out" />
                          </div>

                          <div
                            className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 shadow-[inset_0_0_12px_rgba(255,255,255,0.3)] border border-white/40 group-hover:scale-110 transition-transform relative z-10"
                            style={{ transform: 'translateZ(25px)' }}
                          >
                            {card.icon}
                          </div>

                          <h3
                            className="font-bold text-white text-xl mb-3 relative z-10 tracking-tight"
                            style={{ transform: 'translateZ(15px)' }}
                          >
                            {card.title}
                          </h3>

                          <p
                            className="text-white/80 text-sm leading-relaxed font-medium relative z-10"
                            style={{ transform: 'translateZ(10px)' }}
                          >
                            {card.desc}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Branding Text & Mission Card */}
                  <div className="mb-20 space-y-16">
                    {about.brandingText && (
                      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center px-4">
                        <h3 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#1e3a8a] leading-tight max-w-3xl mx-auto">
                          {about.brandingText}
                        </h3>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-amber-500 mx-auto mt-6 rounded-full" />
                      </motion.div>
                    )}

                    {about.mission && (
                      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="relative bg-gradient-to-r from-[#112e51] to-[#2052c1] rounded-[2rem] p-8 md:p-10 text-center overflow-hidden shadow-2xl mx-auto max-w-7xl"
                      >
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                        <div className="relative z-10">
                          <span className="text-amber-400 text-5xl font-serif leading-none block mb-4">“</span>
                          <p className="text-lg md:text-2xl font-extrabold text-white leading-relaxed mb-6 max-w-5xl mx-auto tracking-tight">
                            "{about.mission.split('successful reality').map((part, i) => (
                              <React.Fragment key={i}>
                                {i > 0 && <span className="text-[#ffc107]">successful reality</span>}
                                {part}
                              </React.Fragment>
                            ))}"
                          </p>
                          <div className="flex items-center justify-center gap-2 text-white/60">
                            <span className="text-sm font-medium tracking-wide">
                              {about.missionAuthor && `— ${about.missionAuthor}`}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {stats.filter(s => s.value).map((stat, i) => (
                      <StatCounter
                        key={i}
                        value={stat.value}
                        label={stat.label}
                        delay={i * 0.1}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* --- Clinical Training Section ─────────────────────── */}
              <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">
                    {clinical.badge && <span className="inline-block text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">{clinical.badge}</span>}
                    {clinical.mainTitle && (
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-tight">
                        {clinical.mainTitle.includes(' ') ? (
                          <>
                            {clinical.mainTitle.split(' ').slice(0, -2).join(' ')} <span className="text-amber-500">{clinical.mainTitle.split(' ').slice(-2).join(' ')}</span>
                          </>
                        ) : clinical.mainTitle}
                      </h2>
                    )}
                    {clinical.desc && <p className="mt-4 text-slate-500 leading-relaxed">{clinical.desc}</p>}
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {videos.map((video, i) => {
                      const youtubeId = getYoutubeId(video.url);
                      return (
                        <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                          className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
                        >
                          <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                            {youtubeId ? (
                              <img
                                src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 .6-.03 1.29-.1 2.09-.06.8-.15 1.43-.28 1.9-.13.47-.32.83-.56 1.07-.23.24-.6.43-1.07.56-.47.13-1.1.22-1.9.28-.8.07-1.49.1-2.09.1L12 18c-.6 0-1.29-.03-2.09-.1-.8-.06-1.43-.15-1.9-.28-.47-.13-.83-.32-1.07-.56-.24-.23-.43-.6-.56-1.07-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L6 12c0-.6.03-1.29.1-2.09.06-.8.15-1.43.28-1.9.13-.47.32-.83.56-1.07.23-.24.6-.43 1.07-.56.47-.13 1.1-.22 1.9-.28.8-.07 1.49-.1 2.09-.1L12 6c.6 0 1.29.03 2.09.1.8.06 1.43.15 1.9.28.47.13.83.32 1.07.56.24.23.43.6.56 1.07z" /></svg>
                              </div>
                            )}
                            <a href={ensureAbsoluteUrl(video.url)} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-all">
                              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:bg-blue-600 transition-all">
                                <svg className="w-8 h-8 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                              </div>
                            </a>
                          </div>
                          <div className="p-6 flex-grow">
                            <h3 className="font-bold text-navy text-lg mb-3 leading-tight group-hover:text-blue-600 transition-colors">{video.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{video.synopsis}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* --- Testimonials Section (Slider) ─────────────────────── */}
              <section className="py-24 bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center max-w-2xl mx-auto mb-16">
                    {testimonials.title && <h2 className="text-4xl sm:text-5xl font-black text-navy leading-tight tracking-tight mb-4">{testimonials.title}</h2>}
                    {testimonials.subtitle && <p className="text-slate-500 text-lg">{testimonials.subtitle}</p>}
                    {testimonials.description && (
                      <p className="mt-2 text-slate-400 text-sm italic">{testimonials.description}</p>
                    )}
                  </motion.div>
                  <div className="relative group">
                    {reviews.length > 0 ? (
                      <Swiper
                        modules={[Autoplay, Pagination, Navigation]} spaceBetween={30} slidesPerView={1} loop={reviews.length > 3}
                        speed={1200}
                        autoplay={{ delay: 5000, disableOnInteraction: false }} pagination={{ clickable: true, dynamicBullets: true }}
                        navigation={{ prevEl: '.review-prev', nextEl: '.review-next' }}
                        breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                        className="pb-16 px-4"
                      >
                        {reviews.map((rev, i) => (
                          <SwiperSlide key={i} className="!h-auto flex">
                            <div className="h-full pt-4 pb-12 w-full flex flex-col">
                              <ReviewCard rev={rev} />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (<div className="text-center py-20 text-slate-400 font-medium">Loading testimonials...</div>)}
                    <div className="hidden lg:flex justify-between absolute top-1/2 -translate-y-1/2 -left-12 -right-12 pointer-events-none px-4">
                      <button className="review-prev pointer-events-auto w-12 h-12 rounded-2xl bg-white shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center text-slate-400 border border-slate-100"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                      <button className="review-next pointer-events-auto w-12 h-12 rounded-2xl bg-white shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center text-slate-400 border border-slate-100"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
                    </div>
                  </div>
                </div>
              </section>

              {/* --- CTA Banner ─────────────────────────────────── */}
              <section className="py-16 bg-amber-50 border-y border-amber-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    {cta.heading && <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">{cta.heading}</h2>}
                    {cta.desc && <p className="text-slate-600 mb-8">{cta.desc}</p>}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      {cta.btn1 && <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-full transition-all text-sm">{cta.btn1}</Link>}
                      {cta.btn2 && <Link to="/countries" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-full transition-all text-sm shadow-lg shadow-blue-900/20">{cta.btn2}</Link>}
                    </div>
                  </motion.div>
                </div>
              </section>

            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
