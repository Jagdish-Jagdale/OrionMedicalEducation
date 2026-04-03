import React from 'react';
import { motion } from 'framer-motion';

const roleColors = {
  Director: 'bg-amber-100 text-amber-800',
  'Branch Head': 'bg-blue-100 text-blue-800',
  'PR and HR Head': 'bg-purple-100 text-purple-800',
};

const TeamCard = ({ member, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100 text-center"
    >
      {/* Photo */}
      <div className="relative pt-8 px-8">
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-navy rounded-full opacity-10 group-hover:opacity-20 transition-opacity" />
          {member.imageUrl ? (
            <img
              src={member.imageUrl}
              alt={member.name}
              loading="lazy"
              className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg group-hover:ring-blue-100 transition-all"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-navy/10 flex items-center justify-center ring-4 ring-white shadow-lg">
              <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {/* Online status dot */}
          <div className="absolute bottom-0 right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-white" />
        </div>
      </div>

      {/* Info */}
      <div className="px-6 pb-8 pt-4">
        <h3 className="font-bold text-navy text-xl mb-1">{member.name}</h3>
        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${roleColors[member.role] || 'bg-slate-100 text-slate-700'}`}>
          {member.role}
        </span>
        <p className="text-slate-500 text-sm leading-relaxed">{member.description}</p>
      </div>
    </motion.div>
  );
};

export default TeamCard;
