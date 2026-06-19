import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTeamAllData } from '../firebase/firestore';
import TeamCard from '../components/TeamCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import PageTitle from '../components/PageTitle';

const Team = () => {
  const [team, setTeam] = useState([]);
  const [regionalExperts, setRegionalExperts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTeamAllData();
        setTeam(data.core || []);
        setRegionalExperts(data.regional || []);
        setSettings(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hero = {
    badge: settings?.hero?.badge || '',
    title: settings?.hero?.title || '',
    description: settings?.hero?.description || ''
  };

  const stats = settings?.stats || [];

  const quotes = {
    quote1: settings?.quotes?.quote1 || "",
    quote2: settings?.quotes?.quote2 || ""
  };

  // Randomized background dots
  const backgroundDots = React.useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, []);

  if (loading) return <LoadingSkeleton type="teampage" />;

  return (
    <div className="min-h-screen bg-[#e0f2fe] pt-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {backgroundDots.map((dot) => (
          <div key={dot.id} className="absolute bg-blue-400 rounded-full" style={{ top: dot.top, left: dot.left, width: `${dot.size}px`, height: `${dot.size}px`, opacity: dot.opacity }} />
        ))}
        {/* Animated Stars */}
        {[...Array(8)].map((_, i) => (
          <motion.div key={`star-${i}`} animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.3, 1] }} transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }} className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
        ))}
      </div>

      <PageTitle title="Team" />

      {/* Header */}
      <div className="relative py-16 sm:py-24 px-6 text-center overflow-hidden bg-blue-600">
        <div className="absolute top-0 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-100" style={{ background: 'linear-gradient(110deg, #2563eb 0%, #1e3a5f 65%, #1e3a5f 100%)' }} />
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1.5px, transparent 0)', backgroundSize: '24px 24px' }} />

        <div className="relative z-10">
          {hero.badge && (
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-amber-400 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] mb-4 border border-white/20 bg-white/5 inline-block px-4 py-1.5 rounded-full backdrop-blur-md">
              {hero.badge}
            </motion.p>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {hero.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-blue-100/70 max-w-2xl mx-auto text-sm sm:text-base font-medium leading-relaxed">
            {hero.description}
          </motion.p>
        </div>
      </div>
      {/* Stats bar - Reverted to simpler original style */}
      <div className="bg-white border-b border-slate-100 shadow-sm relative z-10">
        <div className="max-w-3xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-blue-600">{s.value}</div>
              <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">

        {/* Leadership Section - Reverted to Amber Underline style */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Core Leadership</h2>
            <div className="w-16 h-1 bg-amber-400 mx-auto mt-2 rounded-full" />
          </div>
          <div className="flex flex-col gap-8">
            {team.map((member, i) => (
              <TeamCard key={member.id || i} member={member} index={i} />
            ))}
          </div>
          {team.length === 0 && (
            <div className="text-center py-20 text-slate-400 font-medium italic">Our experts are currently offline. Check back soon.</div>
          )}
        </div>

        {/* Motivational Card - Reverted to cleaner white style */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="my-16 sm:my-24 text-center p-8 sm:p-12 bg-white rounded-3xl border border-blue-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16" />
          <p className="text-xl sm:text-2xl font-medium text-slate-700 leading-relaxed max-w-4xl mx-auto relative z-10 italic">
            "{quotes.quote1}"
          </p>
        </motion.div>

        {/* Regional Experts Section */}
        {regionalExperts.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy">Our Regional Experts</h2>
              <div className="w-16 h-1 bg-blue-500 mx-auto mt-2 rounded-full" />
            </div>
            <div className="flex flex-col gap-8">
              {regionalExperts.map((member, i) => (
                <TeamCard key={member.id || i} member={member} index={i + team.length} />
              ))}
            </div>
          </div>
        )}
        {/* Closing Quote */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 sm:mt-20 text-center bg-gradient-to-r from-navy to-blue-700 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold leading-relaxed">
              "{quotes.quote2}"
            </p>
            <p className="mt-4 text-blue-200 text-xs sm:text-sm">— Team Orion Medical Education</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Team;
