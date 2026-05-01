import React, { useRef, useCallback, useLayoutEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { getReviews } from '../firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import NeuralReviewCard from '../components/NeuralReviewCard';
import brainImg from '../assets/reviewimage.png';
import brainMobileImg from '../assets/brainrightpov.png';

const Reviews = () => {
  const { data: reviews } = useFirestore(getReviews);

  /* ── Layout refs ── */
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const brainRef = useRef(null);
  const cardRefs = useRef([]); // 6 card wrappers

  /* ── Dynamically-computed SVG path strings ── */
  const [pathDefs, setPathDefs] = useState(Array(6).fill(''));
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'end 0.1'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const row1NerveProg = useTransform(smoothProgress, [0, 0.12], [0, 1]);
  const row1CardProg = useTransform(smoothProgress, [0.06, 0.18], [0, 1]);

  const row2NerveProg = useTransform(smoothProgress, [0.20, 0.32], [0, 1]);
  const row2CardProg = useTransform(smoothProgress, [0.26, 0.38], [0, 1]);

  const row3NerveProg = useTransform(smoothProgress, [0.40, 0.52], [0, 1]);
  const row3CardProg = useTransform(smoothProgress, [0.46, 0.58], [0, 1]);

  const progressByIndex = [row1NerveProg, row1NerveProg, row2NerveProg, row2NerveProg, row3NerveProg, row3NerveProg];
  const cardProgressByIndex = [row1CardProg, row1CardProg, row2CardProg, row2CardProg, row3CardProg, row3CardProg];
  const scaleByIndex = cardProgressByIndex.map(p => useTransform(p, [0, 1], [0.95, 1]));

  const isLeftCard = [true, false, true, false, true, false];

  const measurePaths = useCallback(() => {
    if (!svgRef.current || !brainRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const brainRect = brainRef.current.getBoundingClientRect();

    // Target the spine center (roughly 47% from the left edge of the side-profile image)
    const stemX = isMobile 
      ? brainRect.left + (brainRect.width * 0.47) - svgRect.left
      : brainRect.left + brainRect.width * 0.5 - svgRect.left;

    const newPaths = cardRefs.current.map((el, i) => {
      if (!el) return '';
      const r = el.getBoundingClientRect();

      const row = Math.floor(i / 2);
      // Start from brain's bottom/top of spine (higher vertical factor on mobile)
      const verticalFactor = isMobile 
        ? 0.25 + (row * 0.22) 
        : [0.28, 0.44, 0.60][row];
      
      const cardStemY = brainRect.top + brainRect.height * verticalFactor - svgRect.top;

      // On mobile, all cards are on the right
      const mobileIsRight = isMobile ? true : !isLeftCard[i];
      
      const dotX = !mobileIsRight
        ? r.right - svgRect.left + (isMobile ? 2 : 6)
        : r.left - svgRect.left - (isMobile ? 2 : 6);
      const dotY = r.top + r.height / 2 - svgRect.top;

      const s = (n) => n.toFixed(1);
      const startX = stemX;
      const startY = cardStemY;
      const endX = dotX;
      const endY = dotY;

      // Smoother, more organic emergence (shortened cp1X to avoid sharp 'elbows')
      const cp1X = startX + (isMobile ? 40 : (isLeftCard[i] ? -100 : 100));
      const cp1Y = startY + (isMobile ? 10 : 0);

      // CP2 handles the main curve tension
      const cp2X = isMobile ? (startX + endX) * 0.5 : (startX + endX) / 2;
      const cp2Y = endY - (isMobile ? 20 : 0);

      return `M ${s(startX)} ${s(startY)} C ${s(cp1X)} ${s(cp1Y)}, ${s(cp2X)} ${s(cp2Y)}, ${s(endX)} ${s(endY)}`;
    });

    setPathDefs(newPaths);
  }, [isMobile]);

  useLayoutEffect(() => {
    measurePaths();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      measurePaths();
    };
    handleResize();

    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', handleResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [measurePaths]);

  const setCardRef = (i) => (el) => {
    cardRefs.current[i] = el;
    requestAnimationFrame(measurePaths);
  };

  const topReviews =
    reviews && reviews.length > 0
      ? reviews.slice(0, 6)
      : [
        { id: 1, studentName: 'Aditya Sharma', type: 'MBBS STUDENT', text: "Orion's neural map of medical universities made my decision much clearer. The spinal network of support is real!" },
        { id: 2, studentName: 'Priya Patel', type: 'PARENT', text: "Seeing the entire structure of medical education through Orion's lens gave us peace of mind." },
        { id: 3, studentName: 'Rahul Verma', type: 'MBBS STUDENT', text: 'The guidance here is the backbone of my medical career. Truly anatomical excellence.' },
        { id: 4, studentName: 'Sneha Reddy', type: 'PARENT', text: 'A robust network that connects aspiring doctors to reputable global institutions.' },
        { id: 5, studentName: 'Vikram Singh', type: 'MBBS STUDENT', text: 'From the brain core to the finest nerve, every detail of the admission process was handled perfectly.' },
        { id: 6, studentName: 'Ananya Iyer', type: 'PARENT', text: "The structural integrity of Orion's placement system is unmatched in the industry." },
      ];

  return (
    <div className="min-h-screen bg-white pt-10 md:pt-20 overflow-hidden font-sans relative">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#000 1px,transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)', backgroundSize: '50px 50px' }}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-20 relative overflow-visible" ref={containerRef}>

        {/* ═══ HEADER ═══ */}
        <div className="text-center mb-0 md:mb-16 relative z-40 mt-12 md:mt-0">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            className="text-blue-600 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] mb-3 block"
          >
            Anatomical Intelligence
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-6xl font-black text-navy tracking-tighter"
          >
            Anatomical <span className="text-red-500">Success</span> Core
          </motion.h1>
          <div className="w-16 md:w-20 h-1 bg-amber-500 mx-auto mt-4 md:mt-6 rounded-full shadow-lg" />
        </div>

        {/* ═══ ANIMATED NEURAL MAP ═══ */}
        <div className="relative mt-4 md:mt-12 min-h-[950px] md:min-h-[1150px] lg:min-h-[1350px]">

          {/* ── Brain & Spine Hub ── */}
          <div className={`absolute top-[20px] md:top-[0px] ${isMobile ? 'left-[-50px] translate-x-0 w-[300px]' : 'left-1/2 -translate-x-1/2 w-full'} flex items-start justify-center pointer-events-none z-20`}>
            <div className={`relative ${isMobile ? 'w-full' : 'w-[320px] md:w-[600px] lg:w-[900px]'}`}>
              <motion.div
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-blue-300 via-blue-100 to-transparent blur-[60px] lg:blur-[160px]"
              />
              <motion.img
                ref={brainRef}
                src={isMobile ? brainMobileImg : brainImg}
                alt="Scale and Precision"
                className="w-full h-auto object-contain relative z-20 scale-100"
                onLoad={measurePaths}
              />
            </div>
          </div>

          {/* ── SVG nerve network ── */}
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
                  stroke="#ef4444"
                  strokeWidth={isMobile ? "2.0" : "4.0"}
                  strokeLinecap="round"
                  initial={{ opacity: 0, pathLength: 0 }}
                  style={{
                    pathLength: progressByIndex[i],
                    opacity: progressByIndex[i],
                    filter: isMobile ? 'none' : 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.4))'
                  }}
                />
              ) : null
            )}
          </svg>

          {/* ── Optimized Card Layout ── */}
          <div className="relative z-30 w-full px-4">

            {/* Row 1 */}
            <div
              ref={setCardRef(0)}
              className={`absolute top-[150px] lg:top-[420px] left-1/2 ${isMobile ? 'translate-x-[20px] w-[130px]' : '-translate-x-[calc(100%+140px)] lg:-translate-x-[550px] w-[280px]'} -translate-y-1/2`}
            >
              <motion.div style={{ opacity: cardProgressByIndex[0], scale: scaleByIndex[0] }}>
                {topReviews[0] && <NeuralReviewCard review={topReviews[0]} position="relative" isLeft={!isMobile} />}
              </motion.div>
            </div>
            <div
              ref={setCardRef(1)}
              className={`absolute top-[260px] lg:top-[420px] left-1/2 ${isMobile ? 'translate-x-[20px] w-[130px]' : 'translate-x-[140px] lg:translate-x-[270px] w-[280px]'} -translate-y-1/2`}
            >
              <motion.div style={{ opacity: cardProgressByIndex[1], scale: scaleByIndex[0] }}>
                {topReviews[1] && <NeuralReviewCard review={topReviews[1]} position="relative" isLeft={false} />}
              </motion.div>
            </div>

            {/* Row 2 */}
            <div
              ref={setCardRef(2)}
              className={`absolute top-[390px] lg:top-[750px] left-1/2 ${isMobile ? 'translate-x-[20px] w-[130px]' : '-translate-x-[calc(100%+140px)] lg:-translate-x-[550px] w-[280px]'} -translate-y-1/2`}
            >
              <motion.div style={{ opacity: cardProgressByIndex[2], scale: scaleByIndex[0] }}>
                {topReviews[2] && <NeuralReviewCard review={topReviews[2]} position="relative" isLeft={!isMobile} />}
              </motion.div>
            </div>
            <div
              ref={setCardRef(3)}
              className={`absolute top-[500px] lg:top-[750px] left-1/2 ${isMobile ? 'translate-x-[20px] w-[130px]' : 'translate-x-[140px] lg:translate-x-[270px] w-[280px]'} -translate-y-1/2`}
            >
              <motion.div style={{ opacity: cardProgressByIndex[3], scale: scaleByIndex[0] }}>
                {topReviews[3] && <NeuralReviewCard review={topReviews[3]} position="relative" isLeft={false} />}
              </motion.div>
            </div>

            {/* Row 3 */}
            <div
              ref={setCardRef(4)}
              className={`absolute top-[630px] lg:top-[1080px] left-1/2 ${isMobile ? 'translate-x-[20px] w-[130px]' : '-translate-x-[calc(100%+140px)] lg:-translate-x-[550px] w-[280px]'} -translate-y-1/2`}
            >
              <motion.div style={{ opacity: cardProgressByIndex[4], scale: scaleByIndex[0] }}>
                {topReviews[4] && <NeuralReviewCard review={topReviews[4]} position="relative" isLeft={!isMobile} />}
              </motion.div>
            </div>
            <div
              ref={setCardRef(5)}
              className={`absolute top-[740px] lg:top-[1080px] left-1/2 ${isMobile ? 'translate-x-[20px] w-[130px]' : 'translate-x-[140px] lg:translate-x-[270px] w-[280px]'} -translate-y-1/2`}
            >
              <motion.div style={{ opacity: cardProgressByIndex[5], scale: scaleByIndex[0] }}>
                {topReviews[5] && <NeuralReviewCard review={topReviews[5]} position="relative" isLeft={false} />}
              </motion.div>
            </div>

          </div>
        </div>

        {/* ═══ CTA ═══ */}
        <div className="mt-4 md:mt-8 text-center relative z-40 pb-20">
          <motion.a
            href="https://wa.me/917738230335"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 bg-red-600 text-white px-8 md:px-14 py-4 md:py-6 rounded-full shadow-3xl hover:bg-red-700 transition-all group active:scale-95"
          >
            <span className="w-2 h-2 bg-amber-400 rounded-full group-hover:scale-150 transition-transform" />
            <span className="text-[10px] md:text-xs font-black tracking-widest uppercase text-white">Sync into the Network</span>
            <svg className="w-4 h-4 md:w-5 md:h-5 text-amber-400 group-hover:translate-x-3 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </div>

      </div>
    </div>
  );
};

export default Reviews;
