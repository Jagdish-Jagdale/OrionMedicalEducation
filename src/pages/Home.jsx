import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

const Home = () => {
  return (
    <div className="font-sans">
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-navy via-blue-900 to-blue-800 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-amber-300 text-xs font-bold px-4 py-2 rounded-full border border-white/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Trusted MBBS Abroad Consultancy Since 2017
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
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
              className="mt-4 text-xl font-semibold text-blue-200"
            >
              Orion Medical Education
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-4 text-slate-300 text-base leading-relaxed max-w-lg"
            >
              With over 7+ years of experience, we have helped 500+ students secure admissions to top NMC & WHO-approved medical universities across Kyrgyzstan, Russia, Georgia, and Uzbekistan.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
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

          {/* Floating Medical Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="w-72 h-72 bg-gradient-to-br from-blue-500/20 to-white/5 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl"
              >
                <svg className="w-40 h-40 text-white/80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <circle cx="50" cy="50" r="30" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  <path d="M50 20v60M20 50h60" strokeLinecap="round" strokeWidth="4" stroke="#f59e0b" />
                  <circle cx="50" cy="50" r="8" fill="#f59e0b" fillOpacity="0.8" />
                </svg>
              </motion.div>
              {/* Orbiting dots */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
                className="absolute inset-0"
              >
                <div className="absolute top-2 left-1/2 w-3 h-3 bg-amber-400 rounded-full -translate-x-1/2 shadow-lg shadow-amber-400/50" />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
                className="absolute inset-4"
              >
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full -translate-x-1/2" />
              </motion.div>
            </div>
          </motion.div>
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

      {/* ── About Section ────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">About Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy leading-tight">
              We are not just consultants —{' '}
              <span className="text-amber-500">we are Custodians</span> of your entire journey.
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Since 2017, Orion Medical Education has been the bridge between aspiring doctors and world-class medical education. Our team has lived this journey and knows every step of the way.
            </p>
          </motion.div>

          {/* Focus cards */}
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

          {/* Mission statement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-navy to-blue-700 rounded-3xl p-12 text-white mb-20 relative overflow-hidden"
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

          {/* Stats bar */}
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
|
      {/* ── Video Section ────────────────────────────────── */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block text-blue-600 text-sm font-bold uppercase tracking-widest mb-3">Life at the University</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy leading-tight">
              Explore Our <span className="text-amber-500">Student Journey</span>
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">
              Experience the journey before you embark. Real glimpses into university life, clinical training, and our vibrant student community.
            </p>
          </motion.div>

          {/* Video Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "State-of-the-Art Campus",
                synopsis: "Explore modern digital labs and research centers where students excel academic excellence.",
                videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=2311894d033f242af070e17c988c5efba706d31c&profile_id=139&oauth2_token_id=57447761"
              },
              {
                title: "Clinical Hospital Practice",
                synopsis: "Early hospital experience that ensures you graduate ready for global clinical practice.",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
              },
              {
                title: "Hostel & Social Life",
                synopsis: "Comfortable living spaces and a thriving community where international doctors are born.",
                videoUrl: "https://player.vimeo.com/external/371433846.sd.mp4?s=2311894d033f242af070e17c988c5efba706d31c&profile_id=139&oauth2_token_id=57447761"
              },
              {
                title: "Success Stories",
                synopsis: "Hear directly from our graduates now practicing medicine in India and successfully abroad.",
                videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
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
                {/* Video Player Container - Upscaled height from 16:9 to 4:3 */}
                <div className="relative aspect-[4/3] bg-slate-900 group-hover:scale-[1.02] transition-transform duration-500">
                  <video 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                    muted 
                    loop 
                    playsInline
                    onMouseOver={event => event.target.play()}
                    onMouseOut={event => event.target.pause()}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                      <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow">
                  <h3 className="font-bold text-navy text-lg mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {video.synopsis}
                  </p>
                </div>

                {/* Bottom Border Accent */}
                <div className="h-1.5 w-0 bg-blue-600 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
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
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
};

export default Home;
