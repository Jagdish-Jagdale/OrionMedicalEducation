import React, { useRef, useCallback, useLayoutEffect, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValueEvent } from 'framer-motion';
import NeuralReviewCard from '../components/NeuralReviewCard';
import brainImg from '../assets/reviewimage.png';
import brainMobileImg from '../assets/brainrightpov.png';
import PageTitle from '../components/PageTitle';
import { getReviews, getReviewsHeader } from '../firebase/firestore';

const NeuralNerve = ({ d, index, isMobile, cardRef, isScrollingDown }) => {
  const isInView = useInView(cardRef, {
    margin: "-10% 0px -20% 0px",
    once: false
  });

  const variants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      transition: { duration: 0.8, ease: "easeIn" }
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: isScrollingDown ? 1.0 : 0,
        ease: [0.4, 0, 0.2, 1],
        delay: 0
      }
    }
  };

  if (!d) return null;
  return (
    <motion.path
      d={d}
      stroke="#ef4444"
      strokeWidth={isMobile ? "2.0" : "4.0"}
      strokeLinecap="round"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    />
  );
};

const AnimatedCardWrapper = ({ rev, index, total, isMobile, cardRef, isScrollingDown }) => {
  const isInView = useInView(cardRef, {
    margin: "-10% 0px -20% 0px",
    once: false
  });

  const row = Math.floor(index / 2);
  const isLeft = index % 2 === 0;

  const desktopOffset = 420 + (row * 320);
  const topOffset = isMobile ? (150 + (index * 110)) : desktopOffset;

  const variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      x: isLeft ? -20 : 20,
      y: -20,
      transition: { duration: 0.6, ease: "easeIn" }
    },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: {
        duration: isScrollingDown ? 0.8 : 0,
        ease: "easeOut",
        delay: 0
      }
    }
  };

  return (
    <div
      ref={cardRef}
      className={`absolute left-1/2 -translate-y-1/2 ${isMobile ? 'translate-x-[20px] w-[130px]' : (isLeft ? '-translate-x-[calc(100%+140px)] lg:-translate-x-[550px] w-[280px]' : 'translate-x-[140px] lg:translate-x-[270px] w-[280px]')}`}
      style={{ top: `${topOffset}px` }}
    >
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
      >
        <NeuralReviewCard
          review={{
            studentName: rev.name,
            type: rev.type,
            text: rev.text,
            avatar: rev.image
          }}
          position="relative"
          isLeft={!isMobile && isLeft}
        />
      </motion.div>
    </div>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [header, setHeader] = useState({ badge: '', title: '' });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [waNumber, setWaNumber] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Preload large brain images for instant display
  useEffect(() => {
    const preloadImages = [brainImg, brainMobileImg];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [reviewsData, headerData, homeData] = await Promise.all([
          getReviews(),
          getReviewsHeader(),
          import('../firebase/firestore').then(({ getHomeContent }) => getHomeContent())
        ]);

        if (homeData && homeData.whatsappNumber) {
          const cleanNum = homeData.whatsappNumber.replace(/\D/g, '');
          setWaNumber(cleanNum.length === 10 ? `91${cleanNum}` : cleanNum);
        }

        const flattened = [];
        reviewsData.forEach(item => {
          if (item.student) {
            flattened.push({
              id: `${item.id}-s`,
              name: item.student.name,
              type: 'MBBS STUDENT',
              text: item.student.review,
              image: item.student.image
            });
          }
          if (item.parent) {
            flattened.push({
              id: `${item.id}-p`,
              name: item.parent.name,
              type: 'PARENT',
              text: item.parent.review,
              image: item.parent.image
            });
          }
        });
        setReviews(flattened);
        if (headerData) setHeader(headerData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const brainRef = useRef(null);

  // Create a stable list of refs for each review
  const cardRefs = React.useMemo(() => reviews.map(() => React.createRef()), [reviews]);

  const { scrollY } = useScroll();
  const [isScrollingDown, setIsScrollingDown] = useState(true);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() || 0;
    if (latest > prev) setIsScrollingDown(true);
    else if (latest < prev) setIsScrollingDown(false);
  });

  const [pathDefs, setPathDefs] = useState([]);

  const backgroundDots = React.useMemo(() => {
    return [...Array(60)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  const measurePaths = useCallback(() => {
    if (!svgRef.current || !brainRef.current || cardRefs.length === 0) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const brainRect = brainRef.current.getBoundingClientRect();

    const stemX = isMobile
      ? brainRect.left + (brainRect.width * 0.47) - svgRect.left
      : brainRect.left + brainRect.width * 0.5 - svgRect.left;

    const newPaths = cardRefs.map((ref, i) => {
      const el = ref.current;
      if (!el) return '';
      const r = el.getBoundingClientRect();

      const row = Math.floor(i / 2);
      let verticalFactor = isMobile
        ? 0.25 + (row * 0.12)
        : 0.28 + (row * 0.08);

      // Capped to stay within the spine graphic
      verticalFactor = Math.min(verticalFactor, 0.82);

      const cardStemY = brainRect.top + brainRect.height * verticalFactor - svgRect.top;
      const isLeft = i % 2 === 0;
      const mobileIsRight = isMobile ? true : !isLeft;

      const dotX = !mobileIsRight
        ? r.right - svgRect.left + (isMobile ? 2 : 6)
        : r.left - svgRect.left - (isMobile ? 2 : 6);
      const dotY = r.top + r.height / 2 - svgRect.top;

      const s = (n) => n.toFixed(1);
      const startX = stemX;
      const startY = cardStemY;
      const endX = dotX;
      const endY = dotY;

      const cp1X = startX + (isMobile ? 40 : (isLeft ? -100 : 100));
      const cp1Y = startY + (isMobile ? 10 : 0);
      const cp2X = isMobile ? (startX + endX) * 0.5 : (startX + endX) / 2;
      const cp2Y = endY - (isMobile ? 20 : 0);

      return `M ${s(startX)} ${s(startY)} C ${s(cp1X)} ${s(cp1Y)}, ${s(cp2X)} ${s(cp2Y)}, ${s(endX)} ${s(endY)}`;
    });

    setPathDefs(newPaths);
  }, [isMobile, reviews, cardRefs]);

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

  // Initial measurement once content is ready
  useEffect(() => {
    if (reviews.length > 0) {
      const timer = setTimeout(measurePaths, 150);
      return () => clearTimeout(timer);
    }
  }, [reviews, measurePaths]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e0f2fe] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e0f2fe] pt-10 md:pt-20 overflow-hidden font-sans relative">
      <PageTitle title="Reviews" />

      <div className="absolute inset-0 pointer-events-none z-0">
        {backgroundDots.map((dot) => (
          <div key={dot.id} className="absolute bg-blue-400 rounded-full" style={{ top: dot.top, left: dot.left, width: `${dot.size}px`, height: `${dot.size}px`, opacity: dot.opacity }} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-20 relative overflow-visible" ref={containerRef}>
        <div className="text-center mb-0 md:mb-16 relative z-40 mt-12 md:mt-0">
          {header.badge && (
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-blue-600 text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] mb-3 block">
              {header.badge}
            </motion.span>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-2xl md:text-6xl font-black text-navy tracking-tighter">
            {header.title}
          </motion.h1>
          {header.title && <div className="w-16 md:w-20 h-1 bg-amber-500 mx-auto mt-4 md:mt-6 rounded-full shadow-lg" />}
        </div>

        <div
          className="relative mt-4 md:mt-12 transition-all duration-500"
          style={{
            minHeight: isMobile
              ? `${Math.max(600, 250 + (reviews.length * 110))}px`
              : `${Math.max(900, 600 + (Math.ceil(reviews.length / 2) * 320))}px`,
            opacity: isImageLoaded ? 1 : 0
          }}
        >
          <div className={`absolute top-[20px] md:top-[0px] ${isMobile ? 'left-[-50px] translate-x-0 w-[300px]' : 'left-1/2 -translate-x-1/2 w-full'} flex items-start justify-center pointer-events-none z-20`}>
            <div className={`relative ${isMobile ? 'w-full' : 'w-[320px] md:w-[600px] lg:w-[900px]'}`}>
              <motion.img
                ref={brainRef}
                src={isMobile ? brainMobileImg : brainImg}
                alt="Anatomical Hub"
                className="w-full h-auto object-contain relative z-20"
                onLoad={() => {
                  measurePaths();
                  setIsImageLoaded(true);
                }}
              />
            </div>
          </div>

          {isImageLoaded && (
            <>
              <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" fill="none">
                {pathDefs.map((d, i) => (
                  <NeuralNerve
                    key={i}
                    d={d}
                    index={i}
                    isMobile={isMobile}
                    cardRef={cardRefs[i]}
                    isScrollingDown={isScrollingDown}
                  />
                ))}
              </svg>

              <div className="relative z-30 w-full px-4">
                {reviews.map((rev, i) => (
                  <AnimatedCardWrapper
                    key={rev.id}
                    rev={rev}
                    index={i}
                    total={reviews.length}
                    isMobile={isMobile}
                    cardRef={cardRefs[i]}
                    isScrollingDown={isScrollingDown}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-[-40px] text-center relative z-40 pb-20">
          {header.footerText && (
            <motion.a
              href={`https://wa.me/${waNumber}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-4 bg-gradient-to-r from-red-600 to-rose-500 text-white px-10 py-5 rounded-full shadow-3xl hover:shadow-red-200/50 hover:scale-105 transition-all group active:scale-95"
            >
              <span className="text-xs font-black tracking-widest uppercase">{header.footerText}</span>
              <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
            </motion.a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;

