import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import studentsImg from '../assets/splash/students.png';
import universityImg from '../assets/splash/university.png';
import doctorImg from '../assets/splash/doctor.png';
import abroadImg from '../assets/splash/abroad.png';
import orionLogo from '../assets/orionlogo.png';
import introMusic from '../assets/splash/intro.mp3';
import splashBg from '../assets/splash/bg.png';

const SplashScreen = () => {
  const audioRef = useRef(null);

  // Precision calculation for the logo's exit "landing" point
  const exitDimensions = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isLarge = typeof window !== 'undefined' && window.innerWidth >= 1024;
    
    // Navbar measurements from Navbar.jsx (h-16 on mobile, h-20 on desktop)
    const navbarHeight = isMobile ? 64 : 80;
    // Navbar container padding (px-4 = 16px, px-6 = 24px, px-8 = 32px)
    const padding = isMobile ? 16 : (isLarge ? 32 : 24);
    const maxContentWidth = 1280;
    
    // Calculate where the Navbar logo's horizontal center is (48px wide, so +24 for center)
    const targetX = Math.max(padding, (window.innerWidth - maxContentWidth) / 2 + padding) + 24;
    // Navbar logo's vertical center (approx middle of navbar height)
    const targetY = navbarHeight / 2;
    
    // Current screen center where Splash logo starts
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    return {
      x: targetX - centerX,
      y: targetY - centerY,
      // Target Navbar logo is 48px (w-12). Splash logo is 320px (md) or 160px (mobile).
      scale: isMobile ? (48 / 160) : (48 / 320)
    };
  }, []);

  useEffect(() => {
    // Hide scrollbar while splash is active
    document.body.style.overflow = 'hidden';
    
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.log("Audio playback failed:", err);
        });
      }
    };

    // Attempt initial autoplay
    playAudio();

    // Interaction bridge for browsers
    const handleInteraction = () => {
      playAudio();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      // Restore scrollbar when splash is finished
      document.body.style.overflow = 'auto';
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, delay: 1.5 }}
      className="fixed inset-0 z-[100] bg-[#020617] flex items-center justify-center overflow-hidden"
    >
      {/* Cinematic Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={splashBg} 
          alt="Medical Education Global" 
          className="w-full h-full object-cover opacity-30 select-none pointer-events-none" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/95 via-[#020617]/80 to-[#020617]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15)_0%,transparent_70%)]" />
      </div>

      {/* Hidden Audio Element for intro.mp3 */}
      <audio 
        ref={audioRef} 
        src={introMusic} 
        autoPlay 
      />

      {/* --- Responsive Corner Arcs --- */}
      
      {/* Top Left Arc - PHASE 1: Moves towards center on exit */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ x: '50vw', y: '50vh', scale: 0, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[320px] md:h-[320px] overflow-hidden rounded-br-full border-r border-b border-white/5 shadow-2xl origin-top-left z-10"
      >
        <img src={doctorImg} alt="Doctor" className="w-full h-full object-cover brightness-[0.8] contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 to-transparent" />
      </motion.div>

      {/* Top Right Arc - PHASE 1: Moves towards center on exit */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ x: '-50vw', y: '50vh', scale: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 right-0 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[320px] md:h-[320px] overflow-hidden rounded-bl-full border-l border-b border-white/5 shadow-2xl origin-top-right z-10"
      >
        <img src={universityImg} alt="University" className="w-full h-full object-cover brightness-[0.8] contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-950/60 to-transparent" />
      </motion.div>

      {/* Bottom Left Arc - PHASE 1: Moves towards center on exit */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ x: '50vw', y: '-50vh', scale: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-0 left-0 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[320px] md:h-[320px] overflow-hidden rounded-tr-full border-r border-t border-white/5 shadow-2xl origin-bottom-left z-10"
      >
        <img src={studentsImg} alt="Students" className="w-full h-full object-cover brightness-[0.8] contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/60 to-transparent" />
      </motion.div>

      {/* Bottom Right Arc - PHASE 1: Moves towards center on exit */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ x: '-50vw', y: '-50vh', scale: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-0 right-0 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] md:w-[320px] md:h-[320px] overflow-hidden rounded-tl-full border-l border-t border-white/5 shadow-2xl origin-bottom-right z-10"
      >
        <img src={abroadImg} alt="Abroad" className="w-full h-full object-cover brightness-[0.8] contrast-125" />
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-950/60 to-transparent" />
      </motion.div>

      {/* --- Center Logo Section --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ 
          x: exitDimensions.x, 
          y: exitDimensions.y, 
          scale: exitDimensions.scale, 
          opacity: 1, // Keep visible for seamless handoff
        }}
        transition={{ 
          duration: 1.2, 
          delay: 0.9, 
          ease: [0.71, 0, 0.33, 1]
        }}
        className="relative z-20 flex items-center justify-center p-0"
      >
        {/* Subtle Outer Glow */}
        <motion.div 
          exit={{ opacity: 0, transition: { delay: 0.9 } }}
          className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-blue-500/20 blur-[80px] rounded-full animate-pulse" 
        />
        
        <div className="relative">
          {/* Logo Container - Fully Responsive Sizing */}
          <motion.div
            animate={{ 
              y: [0, -12, 0],
              transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 flex items-center justify-center p-3 transition-transform"
          >
            <img 
              src={orionLogo} 
              alt="Orion Medical" 
              className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" 
            />
          </motion.div>
          
          {/* Subtle Rotating Orbits - Fades out on phase 2 */}
          <motion.div 
            exit={{ opacity: 0, transition: { delay: 0.9 } }}
            animate={{ 
              rotate: 360,
              transition: { duration: 25, repeat: Infinity, ease: "linear" }
            }}
            className="absolute -inset-6 md:-inset-8 border border-dashed border-blue-500/20 rounded-full" 
          />
          <motion.div 
            exit={{ opacity: 0, transition: { delay: 0.9 } }}
            animate={{ 
              rotate: -360,
              transition: { duration: 35, repeat: Infinity, ease: "linear" }
            }}
            className="absolute -inset-12 md:-inset-16 border border-dashed border-white/5 rounded-full" 
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
