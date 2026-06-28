import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUniversityBySlug } from '../firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import { CardSkeleton } from '../components/LoadingSkeleton';
import PageTitle from '../components/PageTitle';

const accreditationColors = {
  NMC: 'bg-green-100 text-green-700 border-green-300',
  WHO: 'bg-blue-100 text-blue-700 border-blue-300',
  WDOMS: 'bg-purple-100 text-purple-700 border-purple-300',
};

const UniversityDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: university, loading, error, refetch } = useFirestore(
    () => getUniversityBySlug(slug),
    [slug]
  );
  const [waNumber, setWaNumber] = useState('');

  useEffect(() => {
    import('../firebase/firestore').then(({ getHomeContent }) => {
      getHomeContent().then((data) => {
        if (data && data.whatsappNumber) {
          const cleanNum = data.whatsappNumber.replace(/\D/g, '');
          setWaNumber(cleanNum.length === 10 ? `91${cleanNum}` : cleanNum);
        }
      });
    });
  }, []);

  const countryAnchor = university?.countryName?.toLowerCase() || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-6 w-24 bg-slate-200 rounded animate-pulse mb-8" />
          <div className="h-72 bg-slate-200 rounded-3xl animate-pulse mb-8" />
          <div className="space-y-3">
            <div className="h-8 bg-slate-200 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded animate-pulse" />
            <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !university) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 flex flex-col items-center justify-center gap-4 text-center px-4">
        <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="text-2xl font-bold text-navy">University Not Found</h2>
        <p className="text-slate-500 text-sm">{error || "The university you're looking for doesn't exist."}</p>
        <div className="flex gap-3 mt-2">
          <button onClick={refetch} className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
            Try Again
          </button>
          <button onClick={() => navigate('/countries')} className="bg-white border border-slate-200 text-navy px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors">
            Back to Countries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20">
      <PageTitle title={university?.name || "University Details"} />
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 mb-6">
        <button
          onClick={() => navigate(`/countries#${countryAnchor}`)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to {university.countryName}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl mb-8 bg-gradient-to-br from-blue-100 to-navy/10"
        >
          {university.imageUrl ? (
            <img src={university.imageUrl} alt={university.name} loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-24 h-24 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap gap-2 mb-2">
              {university.accreditation && university.accreditation.map((acc) => (
                <span key={acc} className={`text-xs font-bold px-2.5 py-1 rounded-full border ${accreditationColors[acc] || 'bg-white/90 text-slate-700'} bg-white/90`}>
                  {acc}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-lg">{university.name}</h1>
          </div>
        </motion.div>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: 'Country', value: university.countryName },
            { label: 'Established', value: university.established },
            { label: 'Program Duration', value: university.programDuration },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
              <p className="font-bold text-navy">{item.value || 'N/A'}</p>
            </div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 mb-6"
        >
          <h2 className="text-xl font-bold text-navy mb-4">About the University</h2>
          <p className="text-slate-600 leading-relaxed">{university.description}</p>
        </motion.div>

        {/* Features */}
        {university.features && university.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-md border border-slate-100 mb-6"
          >
            <h2 className="text-xl font-bold text-navy mb-5">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {university.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Admission requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-navy to-blue-700 rounded-3xl p-8 text-white mb-8"
        >
          <h2 className="text-xl font-bold mb-5">Admission Requirements</h2>
          <ul className="space-y-3">
            {[
              '10+2 with Physics, Chemistry, Biology (minimum 50% aggregate)',
              'NEET qualification (for Indian students)',
              'Age: 17–25 years',
              'English proficiency',
              'Valid passport',
            ].map((req, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-blue-100">
                <svg className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {req}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full transition-all text-sm shadow-lg"
          >
            Apply via WhatsApp
          </a>
          <button
            onClick={() => navigate('/contact')}
            className="flex items-center justify-center gap-2 bg-navy hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-full transition-all text-sm shadow-lg"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetails;
