import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import orionLogo from '../assets/orionologo.png';
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
            // 0-1.0: Gradient Background Reveal
            // 1.0-4.0: Logo phase (2s full visibility)
            // 4.5: Fade out to home
            const timer = setTimeout(() => {
                handleClose();
            }, 4500);

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
                audio.play().catch(() => { });
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
                    className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f8f9fc 0%, #eef1f8 40%, #e8ecf4 70%, #f0f2f8 100%)' }}
                >
                    {/* ── STAGE 1: LOGO REVEAL (1.0s - 4.0s) ────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0.95, 1, 1, 1.05],
                        }}
                        transition={{
                            times: [0, 0.166, 0.833, 1],
                            duration: 3,
                            delay: 1,
                            ease: "easeInOut"
                        }}
                        className="absolute z-20 pointer-events-none"
                    >
                        <img
                            src={orionLogo}
                            alt="Orion Logo"
                            className="w-48 sm:w-64 md:w-80 lg:w-[24rem] h-auto drop-shadow-xl"
                        />
                    </motion.div>



                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WelcomeBanner;
