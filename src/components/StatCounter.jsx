import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

const StatCounter = ({ value, label, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView && value) {
      // Extract the number and any non-numeric suffix (like '+' or '%')
      const numberMatch = value.match(/(\d+)/);
      const targetNumber = numberMatch ? parseInt(numberMatch[1], 10) : 0;
      const suffix = value.replace(numberMatch ? numberMatch[1] : "", "") || "";

      const controls = animate(0, targetNumber, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for smooth finish
        delay: delay,
        onUpdate: (latest) => {
          setDisplayValue(Math.floor(latest).toString() + suffix);
        }
      });

      return () => controls.stop();
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: delay }}
      className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
    >
      <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1 tracking-tight">
        {displayValue}
      </div>
      <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{label}</div>
    </motion.div>
  );
};

export default StatCounter;
