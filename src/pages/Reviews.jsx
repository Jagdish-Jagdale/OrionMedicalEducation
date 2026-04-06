import React, { useRef, useCallback, useLayoutEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { getReviews } from '../firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import NeuralReviewCard from '../components/NeuralReviewCard';
import brainImg from '../assets/splash/brain.png';

const Reviews = () => {
  const { data: reviews } = useFirestore(getReviews);

  /* ── Layout refs ── */
  const containerRef = useRef(null);
  const svgRef       = useRef(null);
  const brainRef     = useRef(null);
  const cardRefs     = useRef([]); // 6 card wrappers

  /* ── Dynamically-computed SVG path strings ── */
  const [pathDefs, setPathDefs] = useState(Array(6).fill(''));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'end 0.1'],
  });

  // Smooth out the scroll progress for a premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Thresholds optimized for "Bottom 20%" trigger (80% top margin)
  const row1NerveProgress = useTransform(smoothProgress, [0, 0.12], [0, 1]);
  const row1CardProgress  = useTransform(smoothProgress, [0.06, 0.18], [0, 1]);

  const row2NerveProgress = useTransform(smoothProgress, [0.22, 0.34], [0, 1]);
  const row2CardProgress  = useTransform(smoothProgress, [0.28, 0.40], [0, 1]);

  const row3NerveProgress = useTransform(smoothProgress, [0.44, 0.56], [0, 1]);
  const row3CardProgress  = useTransform(smoothProgress, [0.50, 0.62], [0, 1]);

  // Use the card progress for scaling as well
  const row1Scale = useTransform(row1CardProgress, [0, 1], [0.95, 1]);
  const row2Scale = useTransform(row2CardProgress, [0, 1], [0.95, 1]);
  const row3Scale = useTransform(row3CardProgress, [0, 1], [0.95, 1]);

  const progressByIndex = [
    row1NerveProgress, row1NerveProgress,
    row2NerveProgress, row2NerveProgress,
    row3NerveProgress, row3NerveProgress,
  ];
  const isLeftCard = [true, false, true, false, true, false];

  /* ──────────────────────────────────────────────────────────
     Measure DOM positions & rebuild SVG paths.
     Called on mount, resize, and whenever refs become available.
  ────────────────────────────────────────────────────────── */
  const measurePaths = useCallback(() => {
    if (!svgRef.current || !brainRef.current) return;

    const svgRect   = svgRef.current.getBoundingClientRect();
    const brainRect = brainRef.current.getBoundingClientRect();

    // Brain stem tip: ≈48% across, ≈82% down the image
    const stemX = brainRect.left + brainRect.width  * 0.48 - svgRect.left;
    const stemY = brainRect.top  + brainRect.height * 0.82 - svgRect.top;

    const newPaths = cardRefs.current.map((el, i) => {
      if (!el) return '';
      const r    = el.getBoundingClientRect();
      // Synapse dot: right edge of left card, left edge of right card
      const dotX = isLeftCard[i]
        ? r.right - svgRect.left + 4   // 4px past right edge
        : r.left  - svgRect.left - 4;  // 4px before left edge
      const dotY = r.top + r.height / 2 - svgRect.top;

      // Cubic bezier exits stem vertically, arrives at dot horizontally
      const s = (n) => n.toFixed(1);
      return `M ${s(stemX)} ${s(stemY)} C ${s(stemX)} ${s(dotY)} ${s(dotX)} ${s(dotY)} ${s(dotX)} ${s(dotY)}`;
    });

    setPathDefs(newPaths);
  }, []); // refs are stable — no deps needed

  useLayoutEffect(() => {
    measurePaths();
    const ro = new ResizeObserver(measurePaths);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', measurePaths);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measurePaths);
    };
  }, [measurePaths]);

  const setCardRef = (i) => (el) => {
    cardRefs.current[i] = el;
    // Re-measure whenever a new card mounts
    requestAnimationFrame(measurePaths);
  };

  /* ── Review data ── */
  const topReviews =
    reviews && reviews.length > 0
      ? reviews.slice(0, 6)
      : [
          { id: 1, studentName: 'Aditya Sharma', type: 'MBBS STUDENT', text: "Orion's neural map of medical universities made my decision much clearer. The spinal network of support is real!" },
          { id: 2, studentName: 'Priya Patel',   type: 'PARENT',       text: "Seeing the entire structure of medical education through Orion's lens gave us peace of mind." },
          { id: 3, studentName: 'Rahul Verma',   type: 'MBBS STUDENT', text: 'The guidance here is the backbone of my medical career. Truly anatomical excellence.' },
          { id: 4, studentName: 'Sneha Reddy',   type: 'PARENT',       text: 'A robust network that connects aspiring doctors to reputable global institutions.' },
          { id: 5, studentName: 'Vikram Singh',  type: 'MBBS STUDENT', text: 'From the brain core to the finest nerve, every detail of the admission process was handled perfectly.' },
          { id: 6, studentName: 'Ananya Iyer',   type: 'PARENT',       text: "The structural integrity of Orion's placement system is unmatched in the industry." },
        ];

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-white pt-20 overflow-hidden font-sans relative">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)', backgroundSize: '50px 50px' }}
      />

      <div className="max-w-7xl mx-auto px-4 py-20 relative overflow-visible" ref={containerRef}>

        {/* ═══ HEADER ═══ */}
        <div className="text-center mb-8 md:mb-16 relative z-40">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block"
          >
            Anatomical Intelligence
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-6xl font-black text-navy tracking-tighter"
          >
            Spinal <span className="text-blue-500">Success</span> Core
          </motion.h1>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-6 rounded-full shadow-lg" />
        </div>

        {/* ═══ DESKTOP: Neural Map (lg+) ═══ */}
        <div className="hidden lg:block relative mt-10 min-h-[1500px]">

          {/* ── Brain ── */}
          <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 w-full flex items-center justify-center pointer-events-none z-20">
            <div className="relative w-[530px] h-[530px]">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-blue-300 rounded-full blur-[100px]"
              />
              <motion.img
                ref={brainRef}
                src={brainImg}
                alt="Anatomical Intelligence"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full object-contain relative z-20"
                onLoad={measurePaths}
              />
            </div>
          </div>

          {/* ── SVG nerve network (no viewBox — pure pixel space) ── */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {pathDefs.map((d, i) =>
              d ? (
                <motion.path
                  key={i}
                  d={d}
                  stroke="#3b82f6"
                  strokeWidth="5.0"
                  strokeLinecap="round"
                  initial={{ opacity: 0, pathLength: 0 }}
                  style={{ 
                    pathLength: progressByIndex[i], 
                    opacity: progressByIndex[i],
                    filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))'
                  }}
                />
              ) : null
            )}
          </svg>

          {/* ── Cards ── */}
          <div className="relative z-30 w-full min-h-[1500px]">

            {/* Row 1 */}
            <div
              ref={setCardRef(0)}
              className="absolute top-[450px] left-[50%] -translate-x-[460px] w-[300px] -translate-y-1/2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                style={{ opacity: row1CardProgress, scale: row1Scale }}
              >
                {topReviews[0] && <NeuralReviewCard review={topReviews[0]} position="relative" isLeft={true} />}
              </motion.div>
            </div>
            <div
              ref={setCardRef(1)}
              className="absolute top-[450px] left-[50%] translate-x-[160px] w-[300px] -translate-y-1/2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                style={{ opacity: row1CardProgress, scale: row1Scale }}
              >
                {topReviews[1] && <NeuralReviewCard review={topReviews[1]} position="relative" isLeft={false} />}
              </motion.div>
            </div>

            {/* Row 2 */}
            <div
              ref={setCardRef(2)}
              className="absolute top-[700px] left-[50%] -translate-x-[460px] w-[300px] -translate-y-1/2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                style={{ opacity: row2CardProgress, scale: row2Scale }}
              >
                {topReviews[2] && <NeuralReviewCard review={topReviews[2]} position="relative" isLeft={true} />}
              </motion.div>
            </div>
            <div
              ref={setCardRef(3)}
              className="absolute top-[700px] left-[50%] translate-x-[160px] w-[300px] -translate-y-1/2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                style={{ opacity: row2CardProgress, scale: row2Scale }}
              >
                {topReviews[3] && <NeuralReviewCard review={topReviews[3]} position="relative" isLeft={false} />}
              </motion.div>
            </div>

            {/* Row 3 */}
            <div
              ref={setCardRef(4)}
              className="absolute top-[1000px] left-[50%] -translate-x-[460px] w-[300px] -translate-y-1/2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                style={{ opacity: row3CardProgress, scale: row3Scale }}
              >
                {topReviews[4] && <NeuralReviewCard review={topReviews[4]} position="relative" isLeft={true} />}
              </motion.div>
            </div>
            <div
              ref={setCardRef(5)}
              className="absolute top-[1000px] left-[50%] translate-x-[160px] w-[300px] -translate-y-1/2"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                style={{ opacity: row3CardProgress, scale: row3Scale }}
              >
                {topReviews[5] && <NeuralReviewCard review={topReviews[5]} position="relative" isLeft={false} />}
              </motion.div>
            </div>

          </div>
        </div>

        {/* ═══ MOBILE / TABLET: Stacked list ═══ */}
        <div className="lg:hidden relative mt-6">
          {/* Mini brain */}
          <div className="flex justify-center mb-8">
            <div className="relative w-[200px] h-[200px]">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-blue-300 rounded-full blur-[60px]"
              />
              <motion.img
                src={brainImg} alt="Anatomical Intelligence"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 px-2">
            {topReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className={`relative p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border-l-4 ${i % 2 === 0 ? 'border-l-blue-500' : 'border-l-amber-500'}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full border-2 border-slate-100 p-0.5 overflow-hidden flex-shrink-0 shadow-sm">
                    <img
                      src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.studentName)}&background=random`}
                      alt={review.studentName} className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-navy font-bold text-sm uppercase tracking-wider">{review.studentName}</h4>
                    <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{review.type}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-[13px] leading-relaxed italic">"{review.text || review.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ═══ CTA ═══ */}
        <div className="mt-20 text-center relative z-40 pb-20">
          <motion.a
            href="https://wa.me/919999999999"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className="inline-flex items-center gap-4 bg-navy text-white px-10 md:px-14 py-5 md:py-6 rounded-full shadow-3xl hover:bg-blue-900 transition-all group active:scale-95"
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
