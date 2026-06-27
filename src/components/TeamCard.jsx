import React from 'react';
import { motion } from 'framer-motion';

const TeamCard = ({ member, index = 0 }) => {
  // Support both old and new field names
  const name = member.name || '';
  const displayPosition = member.position || member.role || '';
  const displayImage = member.image || member.imageUrl;
  const displayDescription = member.description || member.bio || '';
  const displayExpertise = member.expertise || '';
  const displayStatus = member.status || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 p-6 sm:p-8"
    >
      <div className="flex flex-col sm:flex-row gap-8 items-start">
        {/* Left Side: Photo + Name + Position */}
        <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-start">
          <div className="relative w-40 h-52 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-navy rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
            {displayImage ? (
              <img
                src={displayImage}
                alt={name}
                loading="lazy"
                className="w-full h-full rounded-2xl object-cover ring-4 ring-white shadow-lg group-hover:ring-blue-100 transition-all"
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-100 to-navy/10 flex items-center justify-center ring-4 ring-white shadow-lg">
                <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            <div className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow-sm ${member.status === 'Inactive' ? 'bg-slate-400' : 'bg-green-400'}`} />
          </div>

          <h3 className="font-bold text-navy text-xl sm:text-2xl mb-1 text-center sm:text-left">{name}</h3>
          <span className="inline-block text-sm font-bold px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-center sm:text-left shadow-sm">
            {displayPosition}
          </span>
        </div>

        {/* Right Side: Information */}
        <div className="w-full sm:w-2/3 pt-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-1 bg-blue-600 rounded-full" />
            <span className="text-blue-600 font-bold uppercase tracking-wider text-xs">Profile Overview</span>
          </div>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium">
            {displayDescription}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-sm font-bold text-navy">{displayStatus}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Expertise</p>
              <p className="text-sm font-bold text-navy">{displayExpertise}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;
