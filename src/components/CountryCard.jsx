import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CountryCard = ({ country, universities = [] }) => {
  const flagMap = {
    Kyrgyzstan: '🇰🇬',
    Russia: '🇷🇺',
    Georgia: '🇬🇪',
    Uzbekistan: '🇺🇿',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border border-slate-100"
    >
      {/* Country Header */}
      <div className="relative bg-gradient-to-r from-navy to-blue-800 p-5 sm:p-6 text-white overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -right-2 -bottom-8 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative z-10 flex items-center gap-4">
          <span className="text-4xl sm:text-5xl">{flagMap[country.name] || '🌍'}</span>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">{country.name}</h3>
            <p className="text-blue-200 text-xs sm:text-sm mt-0.5">{universities.length} Universities</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-5 sm:p-6">
        <p className="text-slate-600 text-sm leading-relaxed mb-5">{country.description}</p>

        {/* Benefits */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Benefits</h4>
          <ul className="space-y-2">
            {country.benefits && country.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Kyrgyzstan special note */}
        {country.name === 'Kyrgyzstan' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-xs font-medium flex items-start gap-2">
              <span className="text-amber-500 text-base">★</span>
              <span>Orion Medical Education is the <strong>Official Representative</strong> of top Kyrgyz medical universities. We ensure authentic admissions and full-year support.</span>
            </p>
          </div>
        )}

        {/* Universities Grid */}
        {universities.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Universities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {universities.map((uni) => (
                <Link
                  key={uni.id}
                  to={`/university/${uni.slug}`}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 truncate">{uni.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {uni.accreditation && uni.accreditation.slice(0, 2).map((acc) => (
                        <span key={acc} className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${acc === 'NMC' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 ml-auto flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CountryCard;
