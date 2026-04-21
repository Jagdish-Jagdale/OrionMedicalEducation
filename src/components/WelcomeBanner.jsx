import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bannerImg from '../assets/promotions/welcome_banner.png';
import orionLogo from '../assets/orionfullrmbg.png';
import introAudio from '../assets/splash/intro.mp3';

const WelcomeBanner = () => {
    // Synchronous initialization to prevent "flash" of home screen
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window !== 'undefined') {
            return !sessionStorage.getItem('welcomeBannerShown');
        }
        return false;
    });
    
    const audioRef = useRef(null);

    useEffect(() => {
        if (isVisible) {
            // Lock scrolling
            document.body.style.overflow = 'hidden';

            // Sequence Timing:
            // 0-1.5: Black
            // 1.5-4.5: Logo phase
            // 4.5: Banner starts
            // 8.5: Start fading out the whole splash
            const timer = setTimeout(() => {
                handleClose();
            }, 8500);

            return () => {
                clearTimeout(timer);
                document.body.style.overflow = '';
            };
        }
    }, [isVisible]);

    useEffect(() => {
        let audio;

        const startAudio = () => {
            if (audio) {
                audio.play().catch(() => {});
            }
            document.removeEventListener('click', startAudio);
        };

        if (isVisible) {
            // Initialize Audio
            audio = new Audio(introAudio);
            audio.loop = true;
            audioRef.current = audio;

            // Attempt to play immediately
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    console.log("Autoplay blocked. Sound will start on first click.");
                    document.addEventListener('click', startAudio);
                });
            }
        }

        return () => {
            document.removeEventListener('click', startAudio);
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            audioRef.current = null;
        };
    }, [isVisible]);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('welcomeBannerShown', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }} // Instant opaque to cover home screen
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-gradient-to-br from-white to-slate-200 overflow-hidden flex items-center justify-center"
                >
                    {/* ── STAGE 1: LOGO REVEAL (1.5s - 4.5s) ────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ 
                            opacity: [0, 1, 1, 0],
                            scale: [0.95, 1, 1, 1.05],
                        }}
                        transition={{ 
                            times: [0, 0.3, 0.7, 1],
                            duration: 3, 
                            delay: 1.5, 
                            ease: "easeInOut"
                        }}
                        className="absolute z-20 pointer-events-none"
                    >
                        <img 
                            src={orionLogo} 
                            alt="Orion Logo" 
                            className="w-64 sm:w-80 md:w-96 lg:w-[32rem] h-auto drop-shadow-xl" 
                        />
                    </motion.div>

                    {/* ── STAGE 2: BANNER REVEAL (4.5s+) ────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4.5, duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 z-10"
                    >
                        {/* Full Screen Interactive Banner */}
                        <a 
                            href="https://wa.me/919999999999" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block w-full h-full cursor-pointer"
                        >
                            <img
                                src={bannerImg}
                                alt="MBBS Consultant for Abroad"
                                className="w-full h-full object-cover"
                            />
                        </a>
                    </motion.div>

                    {/* ── UTILITIES (Revealed with Banner) ────────────────── */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 5.5 }}
                    >
                        {/* Skip/Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-6 right-6 z-[110] w-12 h-12 sm:w-14 sm:h-14 bg-white/60 hover:bg-white text-slate-400 hover:text-slate-800 rounded-full flex items-center justify-center backdrop-blur-xl transition-all border border-slate-200 group shadow-lg active:scale-90"
                            aria-label="Skip"
                        >
                            <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                            </svg>
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeBanner;
