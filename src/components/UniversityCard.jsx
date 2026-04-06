import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const accreditationColors = {
  NMC: 'bg-green-100 text-green-700 border-green-200',
  WHO: 'bg-blue-100 text-blue-700 border-blue-200',
  WDOMS: 'bg-purple-100 text-purple-700 border-purple-200',
};

const UniversityCard = ({ university }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100"
    >
      {/* Image */}
      <div className="relative h-32 sm:h-44 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
        {university.imageUrl ? (
          <img
            src={university.imageUrl}
            alt={university.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
              <path d="M12 14l9-5-9-5-9 5 9 5z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {/* Country badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm text-navy text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm">
          {university.countryName}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-navy text-sm sm:text-base leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
          {university.name}
        </h3>

        {/* Accreditation Badges */}
        {university.accreditation && university.accreditation.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {university.accreditation.map((acc) => (
              <span
                key={acc}
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${accreditationColors[acc] || 'bg-slate-100 text-slate-700 border-slate-200'}`}
              >
                {acc}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          {university.established && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Est. {university.established}
            </div>
          )}
          {university.programDuration && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {university.programDuration}
            </div>
          )}
        </div>

        <Link
          to={`/university/${university.slug}`}
          className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-xl transition-all group-hover:shadow-md"
        >
          View Details
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};

export default UniversityCard;
