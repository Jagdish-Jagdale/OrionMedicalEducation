import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, useVelocity, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import airplaneImg from '../assets/splash/airoplane.png';
import airplaneLeftImg from '../assets/splash/airoplaneleft.png';
import airplaneBlackImg from '../assets/splash/airoplaneblack.png';
import airplaneBlackLeftImg from '../assets/splash/Airoplaneblackleft.png';

const CursorPlane = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isMovingLeft, setIsMovingLeft] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(true); // Default to dark (white cursor)
    
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    
    // Scroll velocity tracking
    const { scrollY } = useScroll();
    const scrollVel = useVelocity(scrollY);
    
    // Instantaneous tracking
    const cursorX = mouseX;
    const cursorY = mouseY;
    
    const rotation = useSpring(0, { damping: 20, stiffness: 150 });
    const scale = useSpring(1, { damping: 15, stiffness: 200 });
    
    const correctedRotation = useTransform(rotation, r => isMovingLeft ? r - 180 : r);
    
    const lastPos = useRef({ x: 0, y: 0 });
    const lastAngle = useRef(0);
    const angleOffset = useRef(0);
    const lastThemeCheck = useRef(0);

    // Helpers for background detection
    const getBackgroundColor = (el) => {
        while (el && el !== document.body) {
            const style = window.getComputedStyle(el);
            const bg = style.backgroundColor;
            const bgi = style.backgroundImage;

            // Gradient detection: If there's a gradient, consider it dark for contrast
            if (bgi && bgi.includes('gradient')) return 'rgb(30, 58, 95)'; 
            
            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && bg !== '') return bg;
            el = el.parentElement;
        }
        return window.getComputedStyle(document.body).backgroundColor || 'rgb(30, 58, 95)';
    };

    const checkIsDark = (color) => {
        const rgb = color.match(/\d+/g);
        if (!rgb || rgb.length < 3) return true;
        // Perceived brightness formula
        const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
        return brightness < 160; 
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isVisible) setIsVisible(true);
            
            const x = e.clientX;
            const y = e.clientY;
            
            const dx = x - lastPos.current.x;
            const dy = y - lastPos.current.y;
            
            if (dx < -1) setIsMovingLeft(true);
            else if (dx > 1) setIsMovingLeft(false);
            
            // Periodically check background theme for optimization
            const now = Date.now();
            if (now - lastThemeCheck.current > 150) {
                const el = document.elementFromPoint(x, y);
                if (el) {
                    const bgColor = getBackgroundColor(el);
                    setIsDarkTheme(checkIsDark(bgColor));
                }
                lastThemeCheck.current = now;
            }

            const sVel = scrollVel.get() * 0.1;
            if (Math.abs(dx) > 0.5 || Math.abs(dy + sVel) > 0.5) {
                const targetAngle = Math.atan2(dy + sVel, dx) * (180 / Math.PI);
                let diff = targetAngle - lastAngle.current;
                if (diff > 180) angleOffset.current -= 360;
                else if (diff < -180) angleOffset.current += 360;
                lastAngle.current = targetAngle;
                rotation.set(targetAngle + angleOffset.current);
            }
            
            mouseX.set(x);
            mouseY.set(y);
            lastPos.current = { x, y };
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable = target.closest('a, button, [role="button"], .swiper-button-next, .swiper-button-prev, .clickable');
            setIsHovering(!!isClickable);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isVisible, mouseX, mouseY, rotation, scrollVel]);

    useEffect(() => {
        if (isClicking) scale.set(0.85);
        else if (isHovering) scale.set(1.4);
        else scale.set(1);
    }, [isHovering, isClicking, scale]);

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    // Determine current image assets
    const currentImg = isDarkTheme 
        ? (isMovingLeft ? airplaneLeftImg : airplaneImg)
        : (isMovingLeft ? airplaneBlackLeftImg : airplaneBlackImg);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
            <motion.div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    x: cursorX,
                    y: cursorY,
                    rotate: correctedRotation,
                    scale: scale,
                    translateX: isMovingLeft ? '-10%' : '-90%',
                    translateY: '-50%',
                    display: isVisible ? 'block' : 'none',
                    transformOrigin: isMovingLeft ? '10% 50%' : '90% 50%',
                }}
            >
                <div className="relative">
                    {/* Shadow - Adaptive color */}
                    <div 
                        className={`absolute inset-0 blur-md ${isDarkTheme ? 'bg-black/10' : 'bg-black/5'} translate-y-3 translate-x-1 rounded-full scale-110`} 
                    />
                    
                    <img 
                        src={currentImg} 
                        alt="cursor-plane" 
                        className={`w-12 h-12 object-contain transition-all duration-300 ${isHovering ? 'brightness-125' : 'brightness-100'}`}
                        style={{ 
                            filter: isDarkTheme 
                                ? 'drop-shadow(0 0 10px rgba(255,255,255,0.4))'
                                : 'drop-shadow(0 0 4px rgba(0,0,0,0.1))',
                        }}
                    />
                    
                    {/* Professional Trail - Reversed for left movement */}
                    {!isHovering && (
                        <div 
                            className={`absolute top-1/2 -translate-y-1/2 flex gap-1.5 ${isMovingLeft ? '-right-3' : '-left-3'}`}
                            style={{ flexDirection: isMovingLeft ? 'row-reverse' : 'row' }}
                        >
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [0.4, 1, 0],
                                        opacity: [0.2, 0.5, 0],
                                        x: isMovingLeft ? [6 * (i + 1), 18 * (i + 1)] : [-6 * (i + 1), -18 * (i + 1)],
                                        y: [(i % 2 === 0 ? 2 : -2), 0]
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                        ease: "easeOut"
                                    }}
                                    className={`w-2 h-2 ${isDarkTheme ? 'bg-white/30' : 'bg-black/20'} rounded-full blur-[1px]`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Magnetic Glow */}
            <motion.div
                animate={{
                    opacity: isHovering ? 0.25 : 0,
                    scale: isHovering ? 1.3 : 0.7,
                }}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    background: isDarkTheme 
                        ? 'radial-gradient(circle, #3b82f6 0%, transparent 75%)'
                        : 'radial-gradient(circle, #1e40af 0%, transparent 75%)',
                    zIndex: -1,
                }}
            />
        </div>
    );
};

export default CursorPlane;
