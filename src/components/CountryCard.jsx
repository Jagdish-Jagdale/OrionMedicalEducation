import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getHomeContent } from '../firebase/firestore';

const CountryCard = ({ country, universities = [] }) => {
  const [waNumber, setWaNumber] = useState('');

  useEffect(() => {
    getHomeContent().then((data) => {
      if (data && data.whatsappNumber) {
        setWaNumber(data.whatsappNumber.replace(/\s+/g, ''));
      }
    });
  }, []);

  const flagMap = {
    Kyrgyzstan: '🇰🇬',
    Russia: '🇷🇺',
    Georgia: '🇬🇪',
    Uzbekistan: '🇺🇿',
    Kazakhstan: '🇺🇿', // Fixed: Kazakhstan flag was missing/duplicated
  };

  const positionClasses = {
    'top left': 'items-start justify-start',
    'top right': 'items-start justify-end text-right',
    'bottom': 'items-end justify-center text-center',
    'bottom left': 'items-end justify-start',
    'bottom right': 'items-end justify-end text-right',
  }[country.flagPosition || 'top left'];

  const flexDir = (country.flagPosition?.includes('right')) ? 'flex-row-reverse' : 'flex-row';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden border border-slate-100"
    >
      {/* Country Header */}
      <div className={`relative bg-gradient-to-r from-navy to-blue-800 p-5 sm:p-6 text-white overflow-hidden min-h-[140px] flex ${positionClasses}`}>
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -right-2 -bottom-8 w-20 h-20 bg-white/5 rounded-full" />
        
        <div className={`relative z-10 flex ${flexDir} items-center gap-4`}>
          {country.flag ? (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0">
              <img src={country.flag} alt={country.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <span className="text-4xl sm:text-5xl">{flagMap[country.name] || '🌍'}</span>
          )}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold leading-tight">{country.name}</h3>
            <p className="text-blue-200 text-xs sm:text-sm mt-0.5 font-medium">{universities.length} Universities</p>
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
                <div key={uni.id} className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all relative">
                  <Link
                    to={`/university/${uni.slug}`}
                    className="flex items-center gap-3 flex-grow min-w-0"
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
                  </Link>

                  <a
                    href={`https://wa.me/${waNumber}?text=Hi, I am interested in ${uni.name}, ${country.name}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors ml-auto"
                    title="Enquire on WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CountryCard;
