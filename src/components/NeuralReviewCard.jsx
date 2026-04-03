import React from 'react';
import { motion } from 'framer-motion';

const NeuralReviewCard = ({ review, position, isLeft }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: isLeft ? -20 : 20 }}
      whileInView={{ opacity: 1, scale: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`${position} z-30 w-full p-5 bg-white rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] group hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] transition-all border-l-4 ${isLeft ? 'border-l-blue-500' : 'border-l-amber-500'}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full border-2 border-slate-100 p-0.5 overflow-hidden flex-shrink-0 group-hover:border-blue-400 transition-colors shadow-sm">
          <img 
            src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.studentName || 'User')}&background=random`} 
            alt={review.studentName} 
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-navy font-bold text-sm truncate group-hover:text-blue-600 transition-colors uppercase tracking-wider">{review.studentName || 'Student'}</h4>
          <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">{review.type}</p>
        </div>
      </div>
      
      <div className="relative">
        <svg className="absolute -top-2 -left-1 w-4 h-4 text-slate-100" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 13V10C14.017 8.89543 14.9124 8 16.017 8H19.017C20.1216 8 21.017 8.89543 21.017 10V13C21.017 14.1046 20.1216 15 19.017 15H16.017C14.9124 15 14.017 14.1046 14.017 13ZM3.01693 21L3.01693 18C3.01693 16.8954 3.91236 16 5.01693 16H8.01693C9.1215 16 10.0169 16.8954 10.0169 18V21C10.0169 22.1046 9.1215 23 8.01693 23H5.01693C3.91236 23 3.01693 22.1046 3.01693 21ZM3.01693 13V10C3.01693 8.89543 3.91236 8 5.01693 8H8.01693C9.1215 8 10.0169 8.89543 10.0169 10V13C10.0169 14.1046 9.1215 15 8.01693 15H5.01693C3.91236 15 3.01693 14.1046 3.01693 13Z" />
        </svg>
        <p className="text-slate-600 text-[12px] leading-relaxed italic pl-4">
          {review.text || review.comment}
        </p>
      </div>
      
      {/* Precision Synapse Point */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? '-right-[5px]' : '-left-[5px]'} w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] z-50 border-2 border-white`} />
    </motion.div>
  );
};

export default NeuralReviewCard;
