import React from 'react';
import { motion } from 'framer-motion';
import orionLogo from '../assets/orionologo.png';

const PageLoader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex items-center justify-center bg-white"
  >
    <div className="flex flex-col items-center gap-6">
      {/* Brand Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl p-2 mb-2 border border-slate-50"
      >
        <img src={orionLogo} alt="Orion" className="w-full h-full object-contain" />
      </motion.div>

      {/* Brand Text */}
      <div className="text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-[#1e3a5f] tracking-tight uppercase"
        >
          Orion Medical Education
        </motion.h2>
        <div className="flex justify-center gap-1.5 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default PageLoader;
