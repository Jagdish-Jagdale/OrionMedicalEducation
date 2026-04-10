import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, useVelocity, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import airplaneImg from '../assets/splash/airoplane.png';

const CursorPlane = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);
    
    // Scroll velocity tracking
    const { scrollY } = useScroll();
    const scrollVel = useVelocity(scrollY);
    
    const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);
    
    const rotation = useSpring(0, { damping: 20, stiffness: 150 });
    const scale = useSpring(1, { damping: 15, stiffness: 200 });
    
    const lastPos = useRef({ x: 0, y: 0 });
    const lastAngle = useRef(0);
    const angleOffset = useRef(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isVisible) setIsVisible(true);
            
            const x = e.clientX;
            const y = e.clientY;
            
            // Calculate movement direction
            const dx = x - lastPos.current.x;
            const dy = y - lastPos.current.y;
            
            // Factor in scroll velocity for a more dynamic "flight" feel
            const sVel = scrollVel.get() * 0.1;
            
            if (Math.abs(dx) > 0.5 || Math.abs(dy + sVel) > 0.5) {
                const targetAngle = Math.atan2(dy + sVel, dx) * (180 / Math.PI);
                
                // --- Angle Continuity Fix ---
                // Prevents the plane from flipping 360 degrees when crossing the 180/-180 boundary
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

    // Update scale based on states
    useEffect(() => {
        if (isClicking) {
            scale.set(0.85);
        } else if (isHovering) {
            scale.set(1.4);
        } else {
            scale.set(1);
        }
    }, [isHovering, isClicking, scale]);

    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null;
    }

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
            <motion.div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    x: cursorX,
                    y: cursorY,
                    rotate: rotation,
                    scale: scale,
                    translateX: '-50%',
                    translateY: '-50%',
                    display: isVisible ? 'block' : 'none',
                }}
            >
                <div className="relative">
                    {/* Shadow */}
                    <div 
                        className="absolute inset-0 blur-md bg-black/10 translate-y-3 translate-x-1 rounded-full scale-110" 
                    />
                    
                    <img 
                        src={airplaneImg} 
                        alt="cursor-plane" 
                        className={`w-12 h-12 object-contain transition-all duration-300 ${isHovering ? 'brightness-125' : 'brightness-100'}`}
                        style={{ 
                            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
                        }}
                    />
                    
                    {/* Professional Trail */}
                    {!isHovering && (
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 flex gap-1.5">
                            {[...Array(4)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        scale: [0.4, 1, 0],
                                        opacity: [0.2, 0.5, 0],
                                        x: [-6 * (i + 1), -18 * (i + 1)],
                                        y: [(i % 2 === 0 ? 2 : -2), 0]
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                        ease: "easeOut"
                                    }}
                                    className="w-2 h-2 bg-white/30 rounded-full blur-[1.5px]"
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
                    background: 'radial-gradient(circle, #3b82f6 0%, transparent 75%)',
                    zIndex: -1,
                }}
            />
        </div>
    );
};

export default CursorPlane;
