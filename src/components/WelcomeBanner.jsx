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
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center overflow-hidden"
                >
                    {/* Background Aesthetics: Blurred Banner */}
                    <div 
                        className="absolute inset-0 opacity-50 blur-[100px] scale-125 pointer-events-none"
                        style={{ 
                            backgroundImage: `url(${bannerImg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                    
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60 pointer-events-none" />

                    {/* Main Banner Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ 
                            delay: 0.1, 
                            duration: 0.4,
                            ease: [0.16, 1, 0.3, 1] 
                        }}
                        className="relative w-full h-full flex items-center justify-center p-4 sm:p-0"
                    >
                        {/* Interactive Link wrapper */}
                        <a 
                            href="https://wa.me/919999999999" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="relative block w-full h-full max-h-screen cursor-pointer"
                        >
                            <img
                                src={bannerImg}
                                alt="MBBS Consultant for Abroad"
                                className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                            />
                            
                            {/* Reflection effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                        </a>
                    </motion.div>

                    {/* Close Button - Viewport Positioned for Accessibility */}
                    <motion.button
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={handleClose}
                        className="absolute top-6 right-6 z-[110] w-12 h-12 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-xl transition-all border border-white/20 group shadow-2xl active:scale-90"
                        aria-label="Close"
                    >
                        <svg className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                        </svg>
                    </motion.button>

                    {/* Hint to close */}
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-[0.3em] font-medium pointer-events-none"
                    >
                        Click anywhere to close
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeBanner;
