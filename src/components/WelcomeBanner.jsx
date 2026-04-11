import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bannerImg from '../assets/promotions/welcome_banner.png';
import introAudio from '../assets/splash/intro.mp3';

const WelcomeBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const hasShown = sessionStorage.getItem('welcomeBannerShown');
        if (!hasShown) {
            setIsVisible(true);
        }
    }, []);

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
            // Definitive Cleanup: Stop audio and remove any pending listeners
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] bg-black overflow-hidden"
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

                    {/* Close Button - Premium Glassmorphism */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        onClick={handleClose}
                        className="absolute top-6 right-6 z-[110] w-12 h-12 sm:w-14 sm:h-14 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-xl transition-all border border-white/20 group shadow-2xl active:scale-90"
                        aria-label="Close"
                    >
                        <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                        </svg>
                    </motion.button>

                    {/* Subtle Navigation Hint */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
                        <span className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-white/40 text-[10px] uppercase tracking-[.3em] font-medium border border-white/5">
                            Click to consultation
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeBanner;
