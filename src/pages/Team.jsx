import React from 'react';
import { motion } from 'framer-motion';
import { getTeam } from '../firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import TeamCard from '../components/TeamCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const teamStats = [
  { value: '7+', label: 'Years Experience' },
  { value: '4', label: 'Country Specialists' },
  { value: '100%', label: 'Student-First' },
  { value: '0', label: 'Hidden Charges' },
];

const Team = () => {
  const { data: team, loading, error, refetch } = useFirestore(getTeam);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-blue-700 py-16 px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3"
        >
          The People Behind Your Success
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold text-white mb-4"
        >
          Meet the Experts Behind Your Success
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-blue-200 max-w-xl mx-auto text-sm"
        >
          Our team brings together years of experience, passion, and deep knowledge of international medical education.
        </motion.p>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {teamStats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{s.value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <LoadingSkeleton count={3} type="team" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-4">{error}</p>
            <button onClick={refetch} className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(team || []).map((member, i) => (
              <TeamCard key={member.id} member={member} index={i} />
            ))}
          </div>
        )}

        {/* End quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-gradient-to-r from-navy to-blue-700 rounded-3xl p-12 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10">
            <svg className="w-10 h-10 text-amber-400 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-2xl sm:text-3xl font-bold leading-relaxed">
              "Your dream is our{' '}
              <span className="text-amber-300">responsibility</span>."
            </p>
            <p className="mt-4 text-blue-200 text-sm">— Team Orion Medical Education</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Team;
