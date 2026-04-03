import React from 'react';
import { motion } from 'framer-motion';
import { getReviews } from '../firebase/firestore';
import { useFirestore } from '../hooks/useFirestore';
import ReviewCard from '../components/ReviewCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Reviews = () => {
  const { data: reviews, loading, error, refetch } = useFirestore(getReviews);

  const parentReviews = (reviews || []).filter((r) => r.type === 'parent');
  const studentReviews = (reviews || []).filter((r) => r.type === 'student');

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy to-blue-700 py-16 px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3"
        >
          Testimonials
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold text-white mb-4"
        >
          What Our Students &amp; Parents Say
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-blue-200 max-w-xl mx-auto text-sm"
        >
          Real stories, real trust. Here's what families who chose Orion Medical Education have to say.
        </motion.p>
      </div>

      {/* Split layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-7 bg-slate-200 rounded w-1/3 animate-pulse" />
              <LoadingSkeleton count={3} type="review" />
            </div>
            <div className="space-y-4">
              <div className="h-7 bg-slate-200 rounded w-1/3 animate-pulse" />
              <LoadingSkeleton count={3} type="review" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-4">{error}</p>
            <button onClick={refetch} className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Parents column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl">👨‍👩‍👧</div>
                <div>
                  <h2 className="font-bold text-navy text-xl">Parents Say</h2>
                  <p className="text-slate-400 text-xs">Trusted by families across India</p>
                </div>
              </div>
              <div className="space-y-5">
                {parentReviews.length > 0 ? (
                  parentReviews.map((review, i) => (
                    <ReviewCard key={review.id} review={review} index={i} />
                  ))
                ) : (
                  <p className="text-slate-400 text-sm text-center py-8">No parent reviews yet.</p>
                )}
              </div>
            </div>

            {/* Students column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl">🎓</div>
                <div>
                  <h2 className="font-bold text-navy text-xl">Students Say</h2>
                  <p className="text-slate-400 text-xs">From students studying abroad right now</p>
                </div>
              </div>
              <div className="space-y-5">
                {studentReviews.length > 0 ? (
                  studentReviews.map((review, i) => (
                    <ReviewCard key={review.id} review={review} index={i} />
                  ))
                ) : (
                  <p className="text-slate-400 text-sm text-center py-8">No student reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CTA - submit review */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-navy to-blue-700 rounded-3xl p-10 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-3">Share Your Experience</h2>
          <p className="text-blue-200 text-sm mb-6">Are you a student or parent who chose Orion? We'd love to hear your story.</p>
          <a
            href="https://wa.me/919999999999?text=I%20want%20to%20share%20my%20review%20for%20Orion%20Medical%20Education"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3.5 rounded-full transition-all text-sm shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            Submit Your Review
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Reviews;
