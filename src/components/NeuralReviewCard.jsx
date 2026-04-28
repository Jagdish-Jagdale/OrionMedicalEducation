import React from 'react';

const NeuralReviewCard = ({ review, position, isLeft, style }) => {
  return (
    <div
      style={style}
      className={`${position} z-30 w-full p-2 lg:p-5 bg-white rounded-lg lg:rounded-3xl border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] group hover:shadow-[0_20px_50px_rgba(239,68,68,0.1)] transition-all border-l-[3px] lg:border-l-4 ${isLeft ? 'border-l-red-500' : 'border-l-amber-500'}`}
    >
      <div className="flex items-center gap-1.5 lg:gap-3 mb-1 lg:mb-4">
        <div className="w-6 h-6 lg:w-11 lg:h-11 rounded-md border border-slate-100 p-0.5 overflow-hidden flex-shrink-0 group-hover:border-red-400 transition-colors shadow-sm">
          <img 
            src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.studentName || 'User')}&background=random`} 
            alt={review.studentName} 
            className="w-full h-full rounded-md object-cover"
          />
        </div>
        <div className="overflow-hidden">
          <h4 className="text-navy font-bold text-[8px] lg:text-sm truncate group-hover:text-red-600 transition-colors uppercase tracking-tight lg:tracking-wider">{review.studentName || 'Student'}</h4>
          <p className="text-slate-400 text-[5px] lg:text-[10px] uppercase font-black tracking-widest leading-none mt-0.5">{review.type}</p>
        </div>
      </div>
      
      <div className="relative">
        <svg className="absolute -top-0.5 lg:-top-2 -left-0.5 w-1.5 h-1.5 lg:w-4 lg:h-4 text-slate-100" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 13V10C14.017 8.89543 14.9124 8 16.017 8H19.017C20.1216 8 21.017 8.89543 21.017 10V13C21.017 14.1046 20.1216 15 19.017 15H16.017C14.9124 15 14.017 14.1046 14.017 13ZM3.01693 21L3.01693 18C3.01693 16.8954 3.91236 16 5.01693 16H8.01693C9.1215 16 10.0169 16.8954 10.0169 18V21C10.0169 22.1046 9.1215 23 8.01693 23H5.01693C3.91236 23 3.01693 22.1046 3.01693 21ZM3.01693 13V10C3.01693 8.89543 3.91236 8 5.01693 8H8.01693C9.1215 8 10.0169 8.89543 10.0169 10V13C10.0169 14.1046 9.1215 15 8.01693 15H5.01693C3.91236 15 3.01693 14.1046 3.01693 13Z" />
        </svg>
        <p className="text-slate-600 text-[7px] lg:text-[12px] leading-snug italic pl-2 lg:pl-4">
          {review.text || review.comment}
        </p>
      </div>
      
      {/* Precision Synapse Point */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? '-right-[4px] lg:-right-[5px]' : '-left-[4px] lg:-left-[5px]'} w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.6)] z-50 border-2 border-white`} />
    </div>
  );
};

export default NeuralReviewCard;
