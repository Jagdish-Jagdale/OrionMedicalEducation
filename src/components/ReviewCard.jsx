import React from 'react';
import { motion } from 'framer-motion';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-slate-200'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const ReviewCard = ({ review, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-100 relative overflow-hidden group"
    >
      {/* Quote mark */}
      <div className="absolute -top-2 -right-2 text-7xl font-serif text-blue-50 group-hover:text-blue-100 transition-colors leading-none select-none">
        "
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${review.type === 'parent' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
              {review.name ? review.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-semibold text-navy text-sm">{review.name}</p>
              <p className="text-slate-400 text-xs">{review.university}</p>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${review.type === 'parent' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
            {review.type === 'parent' ? '👨‍👩‍👧 Parent' : '🎓 Student'}
          </span>
        </div>

        <StarRating rating={review.rating || 5} />

        <p className="mt-3 text-slate-600 text-sm leading-relaxed line-clamp-4">
          "{review.message}"
        </p>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
