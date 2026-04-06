import React from 'react';
import { motion } from 'framer-motion';
import ProcessStep from '../components/ProcessStep';

const steps = [
  {
    title: 'Career Counseling',
    description: 'In-depth one-on-one consultation to understand your academic profile, budget, and future goals. We help you make the right choice from the very beginning.',
  },
  {
    title: 'University Selection & Application',
    description: 'Based on your profile, we shortlist the best NMC/WHO-approved universities and submit a flawless application on your behalf.',
  },
  {
    title: 'Documentation Support',
    description: 'Our experts guide you through every document: academic transcripts, birth certificate, medical fitness certificate, and more — all notarized and attested correctly.',
  },
  {
    title: 'Admission Letter',
    description: 'Upon acceptance, we obtain your official admission letter directly from the university administration.',
  },
  {
    title: 'Visa Processing',
    description: 'We prepare and submit your student visa application, providing all required documents and coaching you for the visa interview if needed.',
  },
  {
    title: 'Air Ticket Assistance',
    description: 'We help you book the most convenient and affordable flights, and coordinate your travel schedule with the university intake dates.',
  },
  {
    title: 'Pre-Departure Guidance',
    description: 'Briefing session covering weather, culture, currency, packing essentials, and what to expect on campus — so you arrive confident and prepared.',
  },
  {
    title: 'Post-Arrival Support',
    description: 'Our local team is present at the airport to receive you. We assist with hostel registration, Indian mess access, local SIM, and orientation. You are never alone.',
  },
];

const Process = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-blue-700 py-12 sm:py-16 px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3"
        >
          Step by Step
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
        >
          Simple &amp; Transparent Admission Process
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-blue-200 max-w-xl mx-auto text-xs sm:text-sm"
        >
          8 clear steps from your first call to arriving at your university campus abroad.
        </motion.p>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {steps.map((step, i) => (
          <ProcessStep
            key={i}
            step={step}
            number={i + 1}
            isLast={i === steps.length - 1}
          />
        ))}

        {/* End note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center shadow-lg"
        >
          <svg className="w-8 h-8 mx-auto mb-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-bold text-lg">We stay connected with you even after you reach abroad.</p>
          <p className="text-green-100 text-sm mt-1">Your success is our mission — and it doesn't stop at the airport.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Process;
