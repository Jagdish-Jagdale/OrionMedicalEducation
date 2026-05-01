import React from 'react';
import { motion } from 'framer-motion';
import { getObservership } from '../firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';

const highlightCards = [
  {
    icon: '🏥',
    title: 'Elite Clinical Exposure',
    desc: 'Train alongside renowned specialists in real hospital environments. Our program provides unmatched hands-on clinical training.',
  },
  {
    icon: '🔬',
    title: 'Advanced Specializations',
    desc: 'Choose from cutting-edge specializations including Oncology, Critical Care & ICU, and Tele-ICU programs.',
  },
  {
    icon: '🏅',
    title: 'Professional Recognition',
    desc: 'Receive internationally recognized certificates from partner hospitals upon successful completion.',
  },
];

const whyCards = [
  {
    icon: '📋',
    title: 'Structured Program',
    desc: 'Well-organized curriculum with clear learning objectives, structured rotations, and mentorship.',
  },
  {
    icon: '🤝',
    title: 'Top Hospital Partnerships',
    desc: 'Exclusively partnered with leading Indian and international hospitals for genuine clinical experience.',
  },
  {
    icon: '🌍',
    title: 'Global Exposure',
    desc: 'Connect with medical professionals globally, building a network that supports your career for life.',
  },
];

const Observership = () => {
  const { data: observership, loading, error } = useFirestore(getObservership);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-blue-700 py-16 px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3"
        >
          Clinical Observership
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight"
        >
          Orion Medical Education:<br />
          <span className="text-amber-300">Clinical Observership Program</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-blue-200 max-w-2xl mx-auto text-sm leading-relaxed"
        >
          Bridging the gap between theoretical knowledge and real-world clinical practice through our exclusive hospital observership program.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-slate-100"
        >
          <h2 className="text-2xl font-bold text-navy mb-4">Program Overview</h2>
          <p className="text-slate-600 leading-relaxed">
            {observership?.description ||
              `The Orion Medical Education Clinical Observership Program is a prestigious initiative designed to give MBBS students and graduates a firsthand experience of advanced medical practice in India's top hospitals. This program bridges the gap between theoretical knowledge and real-world clinical practice, offering participants exposure to cutting-edge medical technologies and techniques under the mentorship of renowned specialists.`}
          </p>
          {observership?.duration && (
            <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
              Duration: {observership.duration}
            </div>
          )}
        </motion.section>

        {/* Highlight cards */}
        <section>
          <h2 className="text-2xl font-bold text-navy text-center mb-8">Program Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlightCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-slate-100 hover:border-blue-200"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-navy text-lg mb-2 group-hover:text-blue-700 transition-colors">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Specializations */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-navy to-blue-700 rounded-3xl p-8 sm:p-12 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Available Specializations</h2>
          <p className="text-blue-200 text-sm mb-8">Gain exposure in the most in-demand medical disciplines.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Oncology', desc: 'Cancer diagnosis, treatment protocols, and modern therapies' },
              { name: 'Critical Care & ICU', desc: 'Life support systems, ventilator management, emergency response' },
              { name: 'Tele-ICU', desc: 'Remote intensive care monitoring using cutting-edge technology' },
              { name: 'General Medicine', desc: 'Comprehensive internal medicine rounds with senior consultants' },
              { name: 'Surgery', desc: 'Observe live surgical procedures across multiple specialties' },
              { name: 'Radiology & Imaging', desc: 'Advanced diagnostic imaging interpretation and reporting' },
            ].map((spec, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-white text-sm">{spec.name}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{spec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose */}
        <section>
          <h2 className="text-2xl font-bold text-navy text-center mb-8">Why Choose Our Observership?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whyCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center bg-white rounded-2xl p-6 shadow-md border border-slate-100"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-navy mb-2">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hospital Partners */}
        {observership?.partnerHospitals && observership.partnerHospitals.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-navy text-center mb-8">Our Hospital Partners</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {observership.partnerHospitals.map((hospital, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                >
                  {hospital.logoUrl ? (
                    <img src={hospital.logoUrl} alt={hospital.name} loading="lazy" className="h-12 object-contain" />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  <p className="text-xs font-semibold text-navy text-center">{hospital.name}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-amber-50 border border-amber-200 rounded-3xl p-10"
        >
          <h2 className="text-2xl font-bold text-navy mb-3">Interested in the Observership Program?</h2>
          <p className="text-slate-500 text-sm mb-6">Limited seats available each batch. Contact us now to register your interest.</p>
          <a
            href="https://wa.me/917738230335?text=I%20am%20interested%20in%20the%20Orion%20Observership%20Program"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full transition-all text-sm shadow-lg"
          >
            Enquire on WhatsApp
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Observership;
