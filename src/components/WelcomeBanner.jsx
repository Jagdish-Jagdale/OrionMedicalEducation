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
                    className="fixed inset-0 z-[100] bg-black"
                >
                    {/* Full Screen Image */}
                    <img
                        src={bannerImg}
                        alt="MBBS Consultant for Abroad"
                        className="w-full h-full object-cover"
                    />

                    {/* Dark gradient overlay for close button visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />

                    {/* Close Button - Viewport Positioned */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        onClick={handleClose}
                        className="absolute top-6 right-6 z-[110] w-12 h-12 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all border border-white/20 group shadow-2xl"
                        aria-label="Close"
                    >
                        <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                        </svg>
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeBanner;
