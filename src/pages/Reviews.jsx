import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getReviews } from '../firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import NeuralReviewCard from '../components/NeuralReviewCard';
import brainImg from '../assets/splash/brain.png';

const Reviews = () => {
  const { data: reviews, loading, error } = useFirestore(getReviews);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Select 6 reviews for the extended spinal map (with static fallback)
  const topReviews = (reviews && reviews.length > 0) 
    ? reviews.slice(0, 6) 
    : [
        { id: 1, studentName: "Aditya Sharma", type: "MBBS STUDENT", text: "Orion's neural map of medical universities made my decision much clearer. The spinal network of support is real!" },
        { id: 2, studentName: "Priya Patel", type: "PARENT", text: "Seeing the entire structure of medical education through Orion's lens gave us peace of mind." },
        { id: 3, studentName: "Rahul Verma", type: "MBBS STUDENT", text: "The guidance here is the backbone of my medical career. Truly anatomical excellence." },
        { id: 4, studentName: "Sneha Reddy", type: "PARENT", text: "A robust network that connects aspiring doctors to reputable global institutions." },
        { id: 5, studentName: "Vikram Singh", type: "MBBS STUDENT", text: "From the brain core to the finest nerve, every detail of the admission process was handled perfectly." },
        { id: 6, studentName: "Ananya Iyer", type: "PARENT", text: "The structural integrity of Orion's placement system is unmatched in the industry." }
      ];

  return (
    <div className="min-h-screen bg-white pt-20 overflow-hidden font-sans relative">
      {/* --- Subtle Medical Grid Background --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      
      <div className="max-w-7xl mx-auto px-4 py-20 relative min-h-[1600px]" ref={containerRef}>
        {/* Header - Medical & Professional */}
        <div className="text-center mb-16 relative z-40 translate-y-[-20px]">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block"
          >
            Anatomical Intelligence
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-navy tracking-tighter"
          >
            Spinal <span className="text-blue-500">Success</span> Core
          </motion.h1>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-6 rounded-full shadow-lg" />
        </div>

        {/* --- THE ANATOMICAL CORE (Top-Mounted Brain) --- */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px]">
            {/* Soft Glow */}
            <motion.div 
               animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-x-0 inset-y-0 bg-blue-300 rounded-full blur-[70px]"
            />
            
            {/* The Brain Model */}
            <motion.img 
              src={brainImg} 
              alt="Anatomical Intelligence"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full object-contain relative z-20"
            />
          </div>
        </div>

        {/* --- THE SPINE & NERVES (SVG Paths Array) --- */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-10" 
          viewBox="0 0 1200 1800" 
          fill="none"
          preserveAspectRatio="xMidYMin slice"
        >
          {/* THE MAIN SPINE (Anatomical Trunk) */}
          <motion.path 
            d="M 600 520 L 600 1750" 
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            strokeWidth="22"
            stroke="#1e3a8a"
            strokeLinecap="round"
            className="opacity-100"
          />
          <motion.path 
            d="M 600 520 L 600 1750" 
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
            strokeWidth="6"
            stroke="#ffffff"
            strokeDasharray="15 25"
            className="opacity-40"
          />

          {/* SECONDARY NERVE FILAMENTS (Density) */}
          {[...Array(30)].map((_, i) => (
            <motion.path
              key={`filament-${i}`}
              d={`M 600 ${520 + i * 40} L ${600 + (i % 2 === 0 ? 150 : -150)} ${550 + i * 40}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.15 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.03 }}
              stroke="#3b82f6"
              strokeWidth="1"
            />
          ))}

          {/* PRIMARY NODAL NERVES (The Cards) */}
          {/* 
            Math:
            Container is 1200px wide in viewBox.
            Left cards center at x=340 (dot at x=490).
            Right cards center at x=860 (dot at x=710).
          */}
          <motion.path d="M 600 525 C 560 525 530 525 490 525" stroke="#3b82f6" strokeWidth="3" initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ delay: 1 }} />
          <motion.path d="M 600 675 C 640 675 670 675 710 675" stroke="#3b82f6" strokeWidth="3" initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ delay: 1.2 }} />
          <motion.path d="M 600 895 C 560 895 530 895 490 895" stroke="#3b82f6" strokeWidth="3" initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ delay: 1.4 }} />
          <motion.path d="M 600 1095 C 640 1095 670 1095 710 1095" stroke="#3b82f6" strokeWidth="3" initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ delay: 1.6 }} />
          <motion.path d="M 600 1295 C 560 1295 530 1295 490 1295" stroke="#3b82f6" strokeWidth="3" initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ delay: 1.8 }} />
          <motion.path d="M 600 1495 C 640 1495 670 1495 710 1495" stroke="#3b82f6" strokeWidth="3" initial={{ pathLength: 0 }} animate={isInView ? { pathLength: 1 } : {}} transition={{ delay: 2 }} />
        </svg>

        {/* --- REVIEW CARDS (Precise Mapping) --- */}
        <div className="relative z-30 w-full min-h-[1600px] mb-40">
          {/* 
            Container max-w-7xl is ~1280. SVG ViewBox is 1200.
            Card width is 300px.
            Left Dot is at card-right. Right Dot is at card-left.
            We use flex/grid math or absolute % to align with the SVG scale.
          */}
          <div className="absolute top-[450px] left-[50%] -translate-x-[410px] w-[300px]">
            {topReviews[0] && <NeuralReviewCard review={topReviews[0]} position="relative" isLeft={true} />}
          </div>
          <div className="absolute top-[600px] left-[50%] translate-x-[110px] w-[300px]">
            {topReviews[1] && <NeuralReviewCard review={topReviews[1]} position="relative" isLeft={false} />}
          </div>
          <div className="absolute top-[820px] left-[50%] -translate-x-[410px] w-[300px]">
            {topReviews[2] && <NeuralReviewCard review={topReviews[2]} position="relative" isLeft={true} />}
          </div>
          <div className="absolute top-[1020px] left-[50%] translate-x-[110px] w-[300px]">
            {topReviews[3] && <NeuralReviewCard review={topReviews[3]} position="relative" isLeft={false} />}
          </div>
          <div className="absolute top-[1220px] left-[50%] -translate-x-[410px] w-[300px]">
            {topReviews[4] && <NeuralReviewCard review={topReviews[4]} position="relative" isLeft={true} />}
          </div>
          <div className="absolute top-[1420px] left-[50%] translate-x-[110px] w-[300px]">
            {topReviews[5] && <NeuralReviewCard review={topReviews[5]} position="relative" isLeft={false} />}
          </div>
        </div>

        {/* --- MOBILE FALLBACK --- */}
        <div className="lg:hidden flex flex-col gap-6 relative z-40 px-4 mt-[450px]">
          {topReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xl"
            >
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 rounded-full border-2 border-blue-500/20 p-0.5 overflow-hidden">
                    <img src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.studentName)}`} alt={review.studentName} className="w-full h-full rounded-full" />
                 </div>
                 <div>
                    <h3 className="text-navy font-bold">{review.studentName}</h3>
                    <p className="text-blue-500 text-xs font-black uppercase">{review.type}</p>
                 </div>
               </div>
               <p className="text-slate-600 text-sm italic">"{review.text || review.comment}"</p>
            </motion.div>
          ))}
        </div>

        {/* Footer - Unified Action */}
        <div className="mt-20 text-center relative z-40 pb-20">
           <motion.a
             href="https://wa.me/919999999999"
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             className="inline-flex items-center gap-4 bg-navy text-white px-14 py-6 rounded-full shadow-3xl hover:bg-blue-900 transition-all group scale-100 active:scale-95"
           >
             <span className="w-2 h-2 bg-amber-500 rounded-full group-hover:scale-150 transition-transform" />
             <span className="text-xs font-black tracking-widest uppercase">Sync into the Network</span>
             <svg className="w-5 h-5 text-amber-500 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
               <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
             </svg>
           </motion.a>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
