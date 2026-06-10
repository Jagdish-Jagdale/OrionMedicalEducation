import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageTitle from '../components/PageTitle';
import processImage from '../assets/processimage.png';
import processImage2 from '../assets/processimage2.png';
import orionLogo from '../assets/orionologo.png';
import eyeImg from '../assets/eye.png';
import abdomenImg from '../assets/abdomen.png';
import lungsImg from '../assets/lungs.png';
import teethImg from '../assets/teeth.png';
import brainImg from '../assets/brain_final.png';
import heartImg from '../assets/heart.png';
import liverImg from '../assets/liver.png';
import kidneyImg from '../assets/kidney.png';
import { getProcessAllData } from '../firebase/firestore';

const organImages = [
  { img: eyeImg, title: 'Ophthalmology', baseScale: 0.7 },
  { img: abdomenImg, title: 'Internal Medicine', baseScale: 1 },
  { img: lungsImg, title: 'Pulmonology', baseScale: 1.8 },
  { img: teethImg, title: 'Stomatology', baseScale: 0.7 },
  { img: brainImg, title: 'Neurology', baseScale: 2.5 },
  { img: heartImg, title: 'Cardiology', baseScale: 0.8 },
  { img: liverImg, title: 'Hepatology', baseScale: 0.8 },
  { img: kidneyImg, title: 'Nephrology', baseScale: 0.8 }
];

// Stethoscope tube coloryy
const TUBE_COLOR = '#7e2726';

const Process = () => {
  const [steps, setSteps] = useState([]);
  const [settings, setSettings] = useState({
    heroBadge: '',
    heroTitle: '',
    heroSubtitle: '',
    footerBadge: '',
    footerTitle: '',
    footerSubtitle: ''
  });
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Randomized background dots
  const backgroundDots = React.useMemo(() => {
    return [...Array(60)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { steps: dataSteps, settings: dataSettings } = await getProcessAllData();

        if (dataSteps) {
          const formattedSteps = dataSteps
            .sort((a, b) => a.order - b.order)
            .map((s, i) => ({
              ...s,
              color: s.color || ['#2563eb', '#0c4a6e', '#1e1b4b', '#3b0764', '#134e4a', '#064e3b', '#450a0a', '#1c1917'][i % 8],
              color2: s.color2 || ['#1d4ed8', '#082f49', '#020617', '#1e1b4b', '#064e3b', '#022c22', '#18181b', '#0c0a09'][i % 8],
              icon: s.icon || ['🩺', '🏫', '📄', '📩', '🛂', '✈️', '🎒', '🏥'][i % 8]
            }));
          setSteps(formattedSteps);
        }

        if (dataSettings) {
          setSettings(dataSettings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const VB_W = isMobile ? 650 : 1000;
  const STEP_H = isMobile ? 380 : 450;
  const CX = VB_W / 2;
  const CARD_OFFSET = isMobile ? 80 : 250;
  const CARD_W = isMobile ? 220 : 480;
  const CARD_H = isMobile ? 500 : 400;

  const buildTubePath = (numSteps) => {
    const startX = CX - 2;
    const startY = -120;
    const segments = [];
    let currX = startX;
    let currY = 80;

    segments.push(`L ${startX},80`);

    for (let i = 0; i < numSteps; i++) {
      const isEven = i % 2 === 0;
      const targetX = isEven ? CX - CARD_OFFSET : CX + CARD_OFFSET;
      const targetY = startY + (i + 1) * STEP_H;

      const segmentH = targetY - currY;
      const cpYInfluence = isMobile ? 0.5 : 0.65;
      const cp1Y = currY + segmentH * cpYInfluence;
      const cp2Y = targetY - segmentH * cpYInfluence;
      segments.push(`C ${currX},${cp1Y} ${targetX},${cp2Y} ${targetX},${targetY}`);

      currX = targetX;
      currY = targetY;
    }

    const finalTargetX = isMobile ? CX + 30 : CX + 75;
    const finalTargetY = currY + (isMobile ? 160 : 235);
    const cp1Y = currY + 100;
    const cp2Y = finalTargetY - 20;
    segments.push(`C ${currX},${cp1Y} ${finalTargetX},${cp2Y} ${finalTargetX},${finalTargetY}`);

    return { path: `M ${startX},${startY} ${segments.join(' ')}`, endX: finalTargetX, endY: finalTargetY };
  };

  const { path: tubePath, endX, endY } = buildTubePath(steps.length);
  const svgHeight = isMobile ? 3100 : (endY + 40);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e0f2fe] flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-blue-600 font-bold animate-pulse">Loading Roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e0f2fe] pt-20 overflow-x-hidden relative">
      <div className="absolute inset-0 pointer-events-none z-0">
        {backgroundDots.map((dot) => (
          <div key={dot.id} className="absolute bg-blue-400 rounded-full" style={{ top: dot.top, left: dot.left, width: `${dot.size}px`, height: `${dot.size}px`, opacity: dot.opacity }} />
        ))}
      </div>
      <PageTitle title="Process" />

      {/* Header Banner - Standardized to Team Style */}
      <div className="relative py-16 sm:py-24 px-6 text-center overflow-hidden z-30">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-100" style={{ background: 'linear-gradient(110deg, #2563eb 0%, #1e3a5f 65%, #1e3a5f 100%)' }} />
          {/* Dot Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1.5px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
          {settings.heroBadge && (
            <div className="flex justify-center mb-6">
              <span className="inline-block text-blue-900 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] border border-white/20 bg-white px-6 py-2.5 rounded-full shadow-2xl">
                {settings.heroBadge}
              </span>
            </div>
          )}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {settings.heroTitle}
          </h1>
          <p className="text-blue-100/80 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            {settings.heroSubtitle}
          </p>
        </motion.div>
      </div>

      {/* Roadmap */}
      <div className="relative max-w-4xl mx-auto px-4 pb-0 -mt-24 sm:-mt-32 overflow-visible z-10">
        <div className="flex justify-center pt-32 relative z-10 pointer-events-none" style={{ marginBottom: '-45px' }}>
          <motion.div initial={{ opacity: 0, y: -30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8 }} className="relative inline-block">
            <img src={processImage} alt="Stethoscope" className="relative z-10 w-48 sm:w-64 md:w-72 lg:w-[300px] h-auto object-contain drop-shadow-2xl brightness-105" />
            <div className="absolute top-[32%] left-[49%] -translate-x-1/2 -translate-y-1/2 z-20">
              <img src={orionLogo} alt="Orion Logo" className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain drop-shadow-xl" />
            </div>
          </motion.div>
        </div>

        <div className="relative w-full overflow-visible" style={{ height: `${svgHeight}px` }}>
          <svg viewBox={`0 0 ${VB_W} ${svgHeight}`} className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMin meet" style={{ pointerEvents: 'none', overflow: 'visible' }}>
            <path d={tubePath} fill="none" stroke="#872b2f" strokeWidth={isMobile ? "18" : "24"} strokeLinecap="round" strokeLinejoin="round" />
            <path d={tubePath} fill="none" stroke={TUBE_COLOR} strokeWidth={isMobile ? "15" : "21"} strokeLinecap="round" strokeLinejoin="round" />

            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              const nodeX = isLeft ? CX - CARD_OFFSET : CX + CARD_OFFSET;
              const nodeY = -120 + (i + 1) * STEP_H;

              return (
                <g key={i}>
                  <circle cx={nodeX} cy={nodeY} r={isMobile ? "20" : "26"} fill={step.color} opacity="0.15" />
                  <circle cx={nodeX} cy={nodeY} r={isMobile ? "15" : "20"} fill={step.color} />
                  <text x={nodeX} y={nodeY + 5} textAnchor="middle" fill="white" fontSize={isMobile ? "10" : "13"} fontWeight="bold" fontFamily="Inter, sans-serif">
                    {i + 1}
                  </text>

                  <foreignObject x={isLeft ? nodeX - CARD_W - 20 : nodeX + 20} y={nodeY - (CARD_H / 2)} width={CARD_W} height={CARD_H} className="overflow-visible">
                    <motion.div initial={{ opacity: 0, x: isLeft ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-20px" }} className="w-full flex items-center relative h-full">
                      <div className="rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 hover:shadow-2xl transition-all duration-500 group w-full relative overflow-hidden border border-white/10" style={{ background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), linear-gradient(135deg, ${step.color} 0%, ${step.color2} 100%)` }}>
                        {/* Shine Effect */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/20 to-transparent opacity-30" />
                        <div className="absolute -inset-y-12 -inset-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                          <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-sm sm:text-xl bg-white/20 text-white shadow-lg backdrop-blur-sm">
                            {step.icon}
                          </span>
                          <h3 className="font-bold text-white text-base sm:text-xl leading-tight tracking-tight">{step.title}</h3>
                        </div>
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed font-medium relative z-10">{step.description}</p>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2" style={{ [isLeft ? 'right' : 'left']: '-8px', width: 0, height: 0, borderTop: isMobile ? '5px solid transparent' : '6px solid transparent', borderBottom: isMobile ? '5px solid transparent' : '6px solid transparent', [isLeft ? 'borderLeft' : 'borderRight']: `8px solid ${step.color}` }} />
                    </motion.div>
                  </foreignObject>

                  <foreignObject x={isLeft ? nodeX + (isMobile ? 120 : 330) : nodeX - (isMobile ? 240 : 630)} y={nodeY - (isMobile ? 100 : 180)} width={isMobile ? 180 : 360} height={isMobile ? 180 : 360} className="overflow-visible">
                    <motion.div initial={{ opacity: 0, rotate: 0 }} whileInView={{ opacity: 0.95, rotate: 0 }} whileHover="hover" viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="w-full h-full flex flex-col items-center justify-center cursor-pointer pointer-events-auto group">
                      <motion.img initial={{ rotate: 0, scale: organImages[i % organImages.length].baseScale }} animate={{ rotate: 0, scale: organImages[i % organImages.length].baseScale }} variants={{ hover: { scale: organImages[i % organImages.length].baseScale * 1.18, rotate: 0, y: -8 } }} transition={{ type: "spring", stiffness: 300, damping: 20 }} src={organImages[i % organImages.length].img} alt="Medical Icon" className="w-[85%] h-[85%] object-contain drop-shadow-2xl" style={{ filter: `drop-shadow(0 0 25px ${step.color}99)` }} />
                      <motion.span variants={{ initial: { opacity: 0, y: 10, scale: 0.8 }, hover: { opacity: 1, y: 0, scale: 1 } }} initial="initial" className="mt-2 text-navy font-black text-[10px] sm:text-[14px] uppercase tracking-widest bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg border border-slate-100 whitespace-nowrap pointer-events-none">
                        {organImages[i % organImages.length].title}
                      </motion.span>
                    </motion.div>
                  </foreignObject>
                </g>
              );
            })}

            <foreignObject x={endX - (isMobile ? 110 : 230)} y={endY - (isMobile ? 70 : 85)} width={isMobile ? 200 : 300} height={isMobile ? 200 : 300} className="overflow-visible">
              <div className="w-full h-full flex items-center justify-center overflow-visible">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative flex items-center justify-center">
                  <img src={processImage2} alt="Stethoscope Head" className={`${isMobile ? 'w-40 rotate-[-160deg]' : 'w-52 rotate-[-130deg]'} h-auto object-contain transform drop-shadow-2xl`} />
                  {settings.footerBadge && (
                    <div className="absolute top-full mt-4 sm:mt-12 left-1/2 -translate-x-1/2">
                      <span className="text-[#9b1c1c] text-[15px] sm:text-[16px] font-black tracking-[0.2em] uppercase bg-white/95 px-5 sm:px-8 py-2.5 rounded-full shadow-2xl border border-rose-100 whitespace-nowrap">
                        {settings.footerBadge}
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>
            </foreignObject>
          </svg>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="-mt-[280px] sm:-mt-48 rounded-2xl text-center p-8 text-white shadow-2xl relative z-30 mx-4 flex flex-col items-center justify-center sm:min-h-[180px]" style={{ background: `linear-gradient(135deg, ${TUBE_COLOR}, #ef4444)` }}>
          <p className="font-bold text-xl mb-1">{settings.footerTitle}</p>
          <p className="text-rose-100 text-sm">{settings.footerSubtitle}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Process;
