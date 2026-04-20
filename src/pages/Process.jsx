import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import processImage from '../assets/processimage.png';
import processImage2 from '../assets/processimage2.png';

const steps = [
  {
    icon: '🩺',
    title: 'Career Counseling',
    description: 'In-depth one-on-one consultation to understand your academic profile, budget, and future goals.',
    color: '#0D9488',
  },
  {
    icon: '🏫',
    title: 'University Selection & Application',
    description: 'We shortlist the best NMC/WHO-approved universities and submit a flawless application on your behalf.',
    color: '#2563EB',
  },
  {
    icon: '📄',
    title: 'Documentation Support',
    description: 'Our experts guide you through every document — all notarized and attested correctly.',
    color: '#4F46E5',
  },
  {
    icon: '📩',
    title: 'Admission Letter',
    description: 'Upon acceptance, we obtain your official admission letter directly from the university.',
    color: '#7C3AED',
  },
  {
    icon: '🛂',
    title: 'Visa Processing',
    description: 'We prepare and submit your student visa application with full documentation coaching.',
    color: '#9333EA',
  },
  {
    icon: '✈️',
    title: 'Air Ticket Assistance',
    description: 'We help you book the most convenient flights coordinated with university intake dates.',
    color: '#E11D48',
  },
  {
    icon: '🎒',
    title: 'Pre-Departure Guidance',
    description: 'Briefing on weather, culture, packing essentials — so you arrive confident and prepared.',
    color: '#EA580C',
  },
  {
    icon: '🏥',
    title: 'Post-Arrival Support',
    description: 'Our local team receives you at the airport. Hostel, SIM, mess, orientation — covered.',
    color: '#059669',
  },
];

// Stethoscope tube color — Exact match requested by user
const TUBE_COLOR = '#7e2726';

// SVG layout constants (all in viewBox units)
const VB_W = 900;
const STEP_H = 450;    // Significantly increased for a premium, elongated sweep
const CX = VB_W / 2;  // center X
const CARD_W = 320;
const CARD_OFFSET = 200; // Sleeker offset for a more modern look

// Build the SVG path that snakes left and right
function buildTubePath(numSteps) {
  const startX = CX - 5; // Perfectly centered alignment
  const startY = -150; // Deep overlap for zero gap
  const segments = [];
  let currX = startX;
  let currY = startY;

  // Initial drop
  segments.push(`L ${startX},40`);
  currY = 40;

  for (let i = 0; i < numSteps; i++) {
    const isEven = i % 2 === 0;
    const targetX = isEven ? CX - CARD_OFFSET : CX + CARD_OFFSET; // Consistent: Even is Left, Odd is Right
    const targetY = startY + (i + 1) * STEP_H;

    // Premium 'S' Curve logic: Handle influence scaled for an elongated, elegant flow
    const segmentH = targetY - currY;
    const cpYInfluence = 0.65; // Higher influence for wider, more rounded arcs
    const cp1Y = currY + segmentH * cpYInfluence;
    const cp2Y = targetY - segmentH * cpYInfluence;
    segments.push(`C ${currX},${cp1Y} ${targetX},${cp2Y} ${targetX},${targetY}`);

    currX = targetX;
    currY = targetY;
  }

  // Final attachment to the 8 o'clock diaphragm — Absolute precision override
  const targetX = CX + 120;
  const finalY = currY - 60; // Elevated to hit the top-right stem tip
  segments.push(`L ${targetX},${finalY}`);
  return { path: `M ${startX},${startY} ${segments.join(' ')}`, endY: finalY, startX };
}

const { path: tubePath, endY, startX: initialX } = buildTubePath(steps.length);
const svgHeight = endY + 250; // High buffer to prevent clipping of tilted bottom hardware

const Process = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive Constants
  const VB_W = isMobile ? 800 : 1000; // Balanced coordinate width
  const STEP_H = isMobile ? 550 : 450;
  const CX = VB_W / 2;
  const CARD_OFFSET = isMobile ? 120 : 250;
  const CARD_W = isMobile ? 320 : 480;
  const CARD_H = isMobile ? 500 : 400;

  // Build the SVG path dynamically based on responsive constants
  const buildTubePath = (numSteps) => {
    const startX = CX - 5;
    const startY = -150;
    const segments = [];
    let currX = startX;
    let currY = 40;

    segments.push(`L ${startX},40`);

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

    // Final segment: Curve smoothly into the stethoscope hardware
    const finalTargetX = CX;
    const finalTargetY = currY + 140;

    // Smooth transition from the last step node to the hardware
    const cp1Y = currY + 80;
    const cp2Y = finalTargetY - 40;
    segments.push(`C ${currX},${cp1Y} ${finalTargetX},${cp2Y} ${finalTargetX},${finalTargetY}`);

    return { path: `M ${startX},${startY} ${segments.join(' ')}`, endX: finalTargetX, endY: finalTargetY };
  };

  const { path: tubePath, endX, endY } = buildTubePath(steps.length);
  const svgHeight = endY + (isMobile ? 250 : 200);

  return (
    <div className="min-h-screen bg-white pt-20 overflow-x-hidden">

      {/* ── Header Banner ── */}
      <div className="bg-gradient-to-br from-[#0a1a3a] via-navy to-blue-900 py-10 px-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <span className="inline-block text-blue-300 text-xs font-bold uppercase tracking-widest mb-3 border border-blue-400/40 bg-blue-500/10 px-4 py-1.5 rounded-full">
            Step by Step
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
            Simple &amp; <span className="text-blue-300">Transparent</span> Admission Process
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            8 clear milestones — from your first consultation to arriving at your university campus abroad.
          </p>
        </motion.div>
      </div>

      {/* ── Stethoscope + Tube Roadmap ── */}
      <div className="relative max-w-4xl mx-auto px-4 pb-20 -mt-24 sm:-mt-32 overflow-visible">

        {/* Stethoscope Image — centered at top */}
        <div
          className="flex justify-center pt-32 relative z-20 pointer-events-none"
          style={{ marginBottom: '-45px' }}
        >
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src={processImage}
              alt="Stethoscope"
              className="relative z-10 w-48 sm:w-64 md:w-72 lg:w-[300px] h-auto object-contain drop-shadow-2xl brightness-105"
            />
          </motion.div>
        </div>

        {/* SVG Tube + Step Cards overlay */}
        <div
          className="relative w-full overflow-visible"
          style={{ height: `${svgHeight}px` }}
        >
          {/* ── SVG Tube path ── */}
          <svg
            viewBox={`0 0 ${VB_W} ${svgHeight}`}
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMin meet"
            style={{ pointerEvents: 'none', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="tubeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="40%" stopColor="#ef4444" />
                <stop offset="60%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>

            {/* Tube Borders */}
            <path d={tubePath} fill="none" stroke="#872b2f" strokeWidth={isMobile ? "18" : "24"} strokeLinecap="round" strokeLinejoin="round" />
            {/* Core Tube */}
            <path d={tubePath} fill="none" stroke={TUBE_COLOR} strokeWidth={isMobile ? "15" : "21"} strokeLinecap="round" strokeLinejoin="round" />

            {/* Step node circles + Info Cards on the tube */}
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              const nodeX = isLeft ? CX - CARD_OFFSET : CX + CARD_OFFSET;
              const nodeY = -150 + (i + 1) * STEP_H;

              return (
                <g key={i}>
                  <circle cx={nodeX} cy={nodeY} r={isMobile ? "20" : "26"} fill={step.color} opacity="0.15" />
                  <circle cx={nodeX} cy={nodeY} r={isMobile ? "15" : "20"} fill={step.color} />
                  <text x={nodeX} y={nodeY + 5} textAnchor="middle" fill="white" fontSize={isMobile ? "10" : "13"} fontWeight="bold" fontFamily="Inter, sans-serif">
                    {i + 1}
                  </text>

                  {/* Info Card via foreignObject */}
                  <foreignObject
                    x={isLeft ? nodeX - CARD_W - 20 : nodeX + 20}
                    y={nodeY - (CARD_H / 2)}
                    width={CARD_W}
                    height={CARD_H}
                    className="overflow-visible"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-20px" }}
                      className="w-full flex items-center relative h-full"
                    >
                      <div
                        className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-l-4 p-3 sm:p-4 hover:shadow-2xl transition-all duration-300 group w-full"
                        style={{ borderLeftColor: step.color }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs sm:text-base"
                            style={{ backgroundColor: `${step.color}15`, color: step.color }}
                          >
                            {step.icon}
                          </span>
                          <h3 className="font-bold text-[#1e3a5f] text-sm sm:text-base leading-tight">{step.title}</h3>
                        </div>
                        <p className="text-slate-500 text-[11px] sm:text-sm leading-relaxed">{step.description}</p>
                      </div>

                      <div
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{
                          [isLeft ? 'right' : 'left']: '-8px',
                          width: 0,
                          height: 0,
                          borderTop: isMobile ? '5px solid transparent' : '6px solid transparent',
                          borderBottom: isMobile ? '5px solid transparent' : '6px solid transparent',
                          [isLeft ? 'borderLeft' : 'borderRight']: isMobile ? `8px solid ${step.color}` : `8px solid ${step.color}`,
                        }}
                      />
                    </motion.div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Bottom Stethoscope Head — Centered Docking */}
            <foreignObject 
              x={endX - (isMobile ? 100 : 150)} 
              y={endY - (isMobile ? 100 : 150)} 
              width={isMobile ? 200 : 300} 
              height={isMobile ? 200 : 300}
              className="overflow-visible"
            >
              <div className="w-full h-full flex items-center justify-center overflow-visible">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative flex items-center justify-center"
                >
                  <img 
                    src={processImage2} 
                    alt="Stethoscope Head" 
                    className={`${isMobile ? 'w-32' : 'w-64'} h-auto object-contain transform rotate-[-90deg] drop-shadow-2xl`}
                  />
                  <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2">
                    <span className="text-[#9b1c1c] text-[10px] sm:text-[13px] font-black tracking-[0.2em] uppercase bg-white/95 px-5 sm:px-8 py-2.5 rounded-full shadow-2xl border border-rose-100 whitespace-nowrap">
                      Your Journey Begins
                    </span>
                  </div>
                </motion.div>
              </div>
            </foreignObject>
          </svg>
        </div>

        {/* CTA below */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-2xl text-center p-8 text-white shadow-2xl"
          style={{ background: `linear-gradient(135deg, ${TUBE_COLOR}, #ef4444)` }}
        >
          <p className="font-bold text-xl mb-1">You've arrived. Your medical journey begins!</p>
          <p className="text-rose-100 text-sm">We stay with you even after you reach abroad. Your success is our mission.</p>
        </motion.div>
      </div >
    </div >
  );
};

export default Process;
