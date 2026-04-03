import React from 'react';
import { motion } from 'framer-motion';

const ProcessStep = ({ step, number, isLast = false }) => {
  return (
    <div className="flex gap-5 relative">
      {/* Step number + connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: number * 0.1 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-navy flex items-center justify-center text-white font-bold text-lg shadow-lg z-10"
        >
          {number}
        </motion.div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-blue-300 to-blue-100 mt-2 min-h-[3rem]" />
        )}
      </div>

      {/* Step content */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: number * 0.1 }}
        className={`pb-8 flex-1 ${isLast ? '' : ''}`}
      >
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 border border-slate-100 group">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-bold text-navy text-base">{step.title}</h3>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProcessStep;
