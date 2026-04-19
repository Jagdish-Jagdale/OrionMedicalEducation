import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import airplaneImg from '../assets/splash/airoplane.png';
import orionLogo from '../assets/orionfullrmbg.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import WelcomeBanner from '../components/WelcomeBanner';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const stats = [
  { value: '7+', label: 'Years Experience' },
  { value: '500+', label: 'Students Placed' },
  { value: '4', label: 'Countries' },
  { value: '20+', label: 'Universities' },
];

const focusCards = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Personalized Guidance',
    desc: 'One-on-one counseling tailored to your academic profile, budget, and career goals.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Ethical Admission',
    desc: 'Transparent process with zero hidden charges. We represent only accredited, verified universities.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Long-term Support',
    desc: 'Our support continues even after you arrive abroad — hostel, mess, airport pickup, local team.',
  },
];

const reviews = [
  {
    name: "Sneha Reddy",
    university: "Georgia State Medical University",
    country: "Georgia",
    rating: 5,
    text: "Clinical exposure here is world-class. The guidance I received during the university selection process was accurate and honest. Truly a custodian for medical aspirants. I highly recommend Orion Medical Education to anyone looking for abroad MBBS.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
  },
  {
    name: "Rahul Verma",
    university: "Samarkand State Medical University",
    country: "Uzbekistan",
    rating: 5,
    text: "I was worried about the budget, but Orion helped me find the perfect university that offers quality medical education without hidden charges. Their local team support is vital throughout the journey from admission to hostel accommodation.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
  },
  {
    name: "Anjali Gupta",
    university: "Osh State University",
    country: "Kyrgyzstan",
    rating: 5,
    text: "Best decision for my medical career. The constant support from the Orion team even after 2 years of being here is what makes them different from any other consultant. They treat you like family and ensure your well-being in a foreign land.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop"
  },
  {
    name: "Aman Singh",
    university: "Kazan Federal University",
    country: "Russia",
    rating: 5,
    text: "The transition from India to Russia was absolutely seamless. Orion Medical Education handled every detail, from the visa process to hostel accommodation. I couldn't be happier with my choice of university and my consultant.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
  }
];

const ReviewCard = ({ rev }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full relative group/card flex flex-col">
      {/* Quote Icon in Top Right */}
      <div className="absolute top-6 right-6 w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center group-hover/card:bg-amber-100 transition-colors">
        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 32 32">
          <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z" />
        </svg>
      </div>

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-50 shadow-sm">
          <img src={rev.image} alt={rev.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-bold text-navy text-lg leading-tight">{rev.name}</h4>
          <p className="text-slate-400 text-xs font-semibold">{rev.university}</p>
        </div>
      </div>

      {/* Rating Stars */}
      <div className="flex gap-1 text-amber-400 mb-4">
        {[...Array(rev.rating)].map((_, i) => (
          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Testimonial Text */}
      <div className="flex-grow">
        <p className={`text-slate-600 italic text-base leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}>
          "{rev.text}"
        </p>
        {rev.text && rev.text.length > 80 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-xs font-bold mt-2 hover:text-blue-700 transition-colors uppercase tracking-wider text-left border-none bg-transparent p-0 cursor-pointer"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="font-sans">
      <WelcomeBanner />
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-navy via-blue-900 to-blue-800 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex justify-center lg:justify-start"
            >
              <img src={orionLogo} alt="Orion Medical Education" className="h-16 sm:h-20 w-auto object-contain brightness-0 invert drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-amber-300 text-[10px] sm:text-xs font-bold px-4 py-2 rounded-full border border-white/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Trusted MBBS Abroad Consultancy Since 2017
            </motion.div>


            <motion.h1
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Your Trusted{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                Custodian
              </span>{' '}
              in MBBS Abroad Journey
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 text-lg sm:text-xl font-semibold text-blue-200"
            >
              Orion Medical Education
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-6 text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              With over 7+ years of clinical expertise, we have helped 500+ students secure admissions to world-class NMC & WHO-approved medical universities.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/countries"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-blue-500/30 text-sm"
              >
                Explore Countries
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-semibold px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-green-500/30 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact Us Now
              </a>
            </motion.div>
          </div>
        </div>

        {/* --- MBBS TO ABROAD JOURNEY TRANSITION ─────────────────── */}
        <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 px-6 sm:px-12 pointer-events-none z-20">
          <div className="max-w-7xl mx-auto flex items-end justify-between gap-4 sm:gap-8 h-20 sm:h-28 relative overflow-visible">
            {/* Left: MBBS Label */}
            <span className="text-white font-black text-xl sm:text-3xl italic tracking-tighter opacity-80 select-none drop-shadow-md z-10">MBBS</span>

            {/* High-Fidelity Continuous Flight - Responsive scaling */}
            <motion.img
              src={airplaneImg}
              alt="Airplane"
              initial={{ left: "0%", top: "20%", rotate: 0 }}
              animate={{
                left: ["0%", "95%"],
                top: ["20%", "-150%", "20%"],
                rotate: [0, -35, 0, 15, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 12,
                ease: "easeInOut",
                repeatDelay: 3
              }}
              className="w-10 sm:w-16 h-auto object-contain filter brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] z-30"
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)'
              }}
            />

            {/* Right: ABROAD Label */}
            <span className="text-white font-black text-xl sm:text-3xl italic tracking-tighter opacity-80 select-none drop-shadow-md z-10">ABROAD</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* --- About Section --------------------------------- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <span className="inline-block text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">About Us</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-tight">
              We are not just consultants —{' '}
              <span className="text-amber-500">we are Custodians</span> of your entire journey.
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Since 2017, Orion Medical Education has been the bridge between aspiring doctors and world-class medical education. Our team has lived this journey and knows every step of the way.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {focusCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group bg-slate-50 hover:bg-blue-600 rounded-2xl p-8 transition-all duration-300 border border-slate-100 hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/20 cursor-default"
              >
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-white/20 rounded-xl flex items-center justify-center text-blue-600 group-hover:text-white mb-5 transition-all">
                  {card.icon}
                </div>
                <h3 className="font-bold text-navy group-hover:text-white text-lg mb-2 transition-colors">{card.title}</h3>
                <p className="text-slate-500 group-hover:text-blue-100 text-sm leading-relaxed transition-colors">{card.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-navy to-blue-700 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-white mb-16 sm:mb-20 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            <div className="relative z-10">
              <svg className="w-10 h-10 text-amber-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl sm:text-2xl font-bold leading-relaxed max-w-3xl mx-auto">
                "To turn your dream of becoming a doctor into a{' '}
                <span className="text-amber-300">successful reality</span> — with integrity, transparency, and unwavering support."
              </p>
              <p className="mt-4 text-blue-200 text-sm font-medium">— Our Mission</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Video Section ────────────────────────────────── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
          >
            <span className="inline-block text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">Clinical Training & Education</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-tight">
              Mastering <span className="text-amber-500">Medical Excellence</span>
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Gain exclusive access to clinical procedures, surgical training, and medical terminology mastery. A glimpse into the sophisticated training of future doctors.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Advanced Surgical Training",
                synopsis: "Step inside the operating room to witness complex surgical procedures and professional medical protocols firsthand.",
                youtubeId: "dK6klQeM4v8",
                videoUrl: "https://youtube.com/shorts/dK6klQeM4v8"
              },
              {
                title: "Medical Anatomy Mastery",
                synopsis: "In-depth understanding of physiological structures and clinical conditions through advanced visual demonstrations.",
                youtubeId: "StJ34VMd6M8",
                videoUrl: "https://youtu.be/StJ34VMd6M8?si=P5IQ-bntbGRqXrDY"
              },
              {
                title: "Clinical Practice Highlights",
                synopsis: "Real-world hospital experience and diagnostic skills essential for modern medical practice.",
                youtubeId: "_6FbcwJ0V4Y",
                videoUrl: "https://youtu.be/_6FbcwJ0V4Y"
              },
              {
                title: "Emergency Response Training",
                synopsis: "Gaining proficiency in critical care management and high-pressure emergency medical interventions.",
                youtubeId: "j6rX7bqOnOc",
                videoUrl: "https://youtube.com/shorts/j6rX7bqOnOc"
              }
            ].map((video, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />

                  {/* Play Overlay Button */}
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center group/play transition-all bg-black/20 hover:bg-black/40"
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover/play:scale-110 group-hover/play:bg-blue-600 group-hover/play:border-blue-500 transition-all duration-300">
                      <svg className="w-8 h-8 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </a>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="font-bold text-navy text-lg mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {video.synopsis}
                  </p>
                </div>
                <div className="h-1.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Reviews Section (Slider) ─────────────────────── */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="inline-block text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-amber-100 shadow-sm">Real Testimonials</span>
            <h2 className="text-4xl sm:text-5xl font-black text-navy leading-tight tracking-tight mb-4">
              Voices of <span className="text-blue-600">Future Doctors</span>
            </h2>
            <p className="text-slate-500 text-lg">Hear from our satisfied students about their experience working with us.</p>
          </motion.div>

          <div className="relative group">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={{
                prevEl: '.review-prev',
                nextEl: '.review-next',
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="pb-16 px-4"
            >
              {reviews.map((rev, i) => (
                <SwiperSlide key={i}>
                  <div className="h-full py-4">
                    <ReviewCard rev={rev} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="hidden lg:flex justify-between absolute top-1/2 -translate-y-1/2 -left-12 -right-12 pointer-events-none px-4">
              <button className="review-prev pointer-events-auto w-12 h-12 rounded-2xl bg-white shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center text-slate-400 group/nav border border-slate-100">
                <svg className="w-6 h-6 group-hover/nav:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="review-next pointer-events-auto w-12 h-12 rounded-2xl bg-white shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center text-slate-400 group/nav border border-slate-100">
                <svg className="w-6 h-6 group-hover/nav:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Banner ─────────────────────────────────── */}
      <section className="py-16 bg-amber-50 border-y border-amber-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-4">
              Ready to Start Your MBBS Journey Abroad?
            </h2>
            <p className="text-slate-600 mb-8">Talk to our expert counselors today. Free consultation, no obligations.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-blue-800 text-white font-semibold px-8 py-4 rounded-full transition-all hover:shadow-xl text-sm"
              >
                Book Free Counseling
              </Link>
              <Link
                to="/countries"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-navy font-semibold px-8 py-4 rounded-full transition-all hover:shadow-xl text-sm border border-slate-200"
              >
                Explore Universities
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
        aria-label="WhatsApp"
      >
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.335-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
};

export default Home;
