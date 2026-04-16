import React from 'react';
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
const STEP_H = 300;    // Further increased for ultra-smooth sweeps
const CX = VB_W / 2;  // center X
const CARD_W = 320;
const CARD_OFFSET = 310; // how far left/right card centers are from CX

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
    const targetX = isEven ? CX + CARD_OFFSET : CX - CARD_OFFSET;
    const targetY = startY + (i + 1) * STEP_H;

    // Fluid Bezier curve to the next step
    const cp1Y = currY + STEP_H * 0.4;
    const cp2Y = targetY - STEP_H * 0.4;
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
  return (
    <div className="min-h-screen bg-white pt-20">

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
      <div className="relative max-w-4xl mx-auto px-4 pb-20 -mt-24 sm:-mt-32">

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
              className="relative z-10 w-72 sm:w-[300px] h-auto object-contain drop-shadow-2xl brightness-105"
            />
          </motion.div>
        </div>

        {/* SVG Tube + Step Cards overlay */}
        <div
          className="relative w-full"
          style={{ height: `${svgHeight}px` }}
        >
          {/* ── SVG Tube path ── */}
          <svg
            viewBox={`0 0 ${VB_W} ${svgHeight}`}
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            style={{ pointerEvents: 'none' }}
          >
            <defs>
              {/* Tube-like gradient: lighter center, darker outer = 3D tube look */}
              <linearGradient id="tubeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="40%" stopColor="#ef4444" />
                <stop offset="60%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
              {/* Drop shadow filter for tube depth */}
              <filter id="tubeShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#7f1d1d" floodOpacity="0.5" />
              </filter>
            </defs>

            {/* Subtle border for the tube */}
            <path
              d={tubePath}
              fill="none"
              stroke="#872b2f"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Single solid-colored tube matching the stethoscope */}
            <path
              d={tubePath}
              fill="none"
              stroke={TUBE_COLOR}
              strokeWidth="21"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Step node circles on the tube */}
            {steps.map((step, i) => {
              const nodeX = i % 2 === 0 ? CX - CARD_OFFSET : CX + CARD_OFFSET;
              const nodeY = (i + 1) * STEP_H;
              return (
                <g key={i}>
                  {/* Subtle outer glow using the step color */}
                  <circle cx={nodeX} cy={nodeY} r="26" fill={step.color} opacity="0.15" />
                  {/* Node circle */}
                  <circle cx={nodeX} cy={nodeY} r="20" fill={step.color} />
                  {/* Step number text */}
                  <text
                    x={nodeX}
                    y={nodeY + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="Inter, sans-serif"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}

            {/* The new Stethoscope Head Image at the bottom — Exactly 8 o'clock */}
            <foreignObject x={CX - 150} y={endY - 240} width="350" height="400">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center overflow-visible"
              >
                <img 
                  src={processImage2} 
                  alt="Stethoscope Head" 
                  className="w-40 h-auto object-contain transform rotate-[240deg] drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }}
                />
                <div className="mt-4 flex flex-col items-center">
                  <span className="text-[#9b1c1c] text-[10px] font-black tracking-[0.2em] uppercase bg-white/90 px-4 py-1 rounded-full shadow-sm border border-rose-100">
                    Your Journey Begins
                  </span>
                </div>
              </motion.div>
            </foreignObject>
          </svg>

          {/* ── Step Cards — absolutely positioned to match SVG nodes ── */}
          {steps.map((step, i) => {
            const isLeft = i % 2 === 0;
            // Map SVG coords to percentage of container width
            const nodeXpct = isLeft
              ? ((CX - CARD_OFFSET) / VB_W) * 100
              : ((CX + CARD_OFFSET) / VB_W) * 100;
            const nodeYpct = ((i + 1) * STEP_H / svgHeight) * 100;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                style={{
                  position: 'absolute',
                  top: `${nodeYpct}%`,
                  left: isLeft ? `${nodeXpct - 30}%` : 'auto',
                  right: isLeft ? 'auto' : `${100 - nodeXpct - 30}%`,
                  transform: 'translateY(-50%)',
                  width: '220px',
                  zIndex: 10,
                }}
                className={`${isLeft ? 'mr-2' : 'ml-2'}`}
              >
                <div
                  className="bg-white rounded-2xl shadow-xl border-l-4 p-4 hover:shadow-2xl transition-all duration-300 group"
                  style={{ borderLeftColor: step.color }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: `${step.color}15`, color: step.color }}
                    >
                      {step.icon}
                    </span>
                    <h3 className="font-bold text-[#1e3a5f] text-sm leading-tight">{step.title}</h3>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{step.description}</p>
                </div>
                {/* Connector arrow pointing from card to node */}
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    [isLeft ? 'right' : 'left']: '-10px',
                    width: 0,
                    height: 0,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    [isLeft ? 'borderLeft' : 'borderRight']: `10px solid ${step.color}`,
                  }}
                />
              </motion.div>
            );
          })}
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
