import React from 'react';
import { motion } from 'framer-motion';

const contactInfo = [
   {
      icon: (
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
      ),
      label: 'Office Address',
      value: '1st Floor, Bagga House, Prabhat Rd, next to Deccan Police Station, Deccan Gymkhana, Pune, Maharashtra 411004',
      sub: 'Visit us for free in-person counseling',
      color: 'bg-blue-100 text-blue-600',
   },
   {
      icon: (
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
      ),
      label: 'Phone',
      value: '+91 77382 30335',
      value2: '+91 96840 20344',
      sub: 'Mon–Sat, 9 AM – 7 PM',
      href: 'tel:+917738230335',
      href2: 'tel:+919684020344',
      color: 'bg-green-100 text-green-600',
   },
   {
      icon: (
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
      ),
      label: 'Email',
      value: 'info@orionmedicaleducation.com',
      value2: 'admission@orionmedicaleducation.com',
      sub: 'We respond within 24 hours',
      href: 'mailto:info@orionmedicaleducation.com',
      href2: 'mailto:admission@orionmedicaleducation.com',
      color: 'bg-amber-100 text-amber-600',
   },
   {
      icon: (
         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" strokeLinecap="round" strokeLinejoin="round" />
         </svg>
      ),
      label: 'Website',
      value: 'www.orionmedicaledu.com',
      sub: 'Visit for more information',
      href: 'https://www.orionmedicaledu.com',
      color: 'bg-purple-100 text-purple-600',
   },
];

const socialLinks = [
   {
      platform: 'YouTube',
      icon: (
         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" /></svg>
      ),
      handle: '@OrionMedicalEdu',
      color: 'bg-red-50 border-red-200 text-red-600',
      btnColor: 'bg-red-500 hover:bg-red-600',
      link: 'https://youtube.com/@OrionMedicalEdu',
   },
   {
      platform: 'Instagram',
      icon: (
         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
      ),
      handle: '@orionmedicaledu',
      color: 'bg-pink-50 border-pink-200 text-pink-600',
      btnColor: 'bg-pink-500 hover:bg-pink-600',
      link: 'https://instagram.com/orionmedicaledu',
   },
   {
      platform: 'Facebook',
      icon: (
         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
      ),
      handle: 'Orion Medical Education',
      color: 'bg-blue-50 border-blue-200 text-blue-600',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      link: 'https://facebook.com/OrionMedicalEducation',
   },
];

const Contact = () => {
   return (
      <div className="min-h-screen bg-slate-50 pt-20">
         {/* Header */}
         <div className="bg-gradient-to-r from-navy to-blue-700 py-12 sm:py-16 px-6 text-center">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3">
               Contact Us
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
               Get in Touch With Us
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-blue-200 max-w-xl mx-auto text-xs sm:text-sm">
               Our expert counselors are ready to guide you through every step of your MBBS abroad journey.
            </motion.p>
         </div>

         <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-16 space-y-12">
            {/* Contact info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
               {contactInfo.map((info, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow overflow-hidden"
                  >
                     <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 ${info.color}`}>
                        {info.icon}
                     </div>
                     <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                     {info.href ? (
                        <a href={info.href} className="font-bold text-navy hover:text-blue-600 transition-colors text-xs sm:text-sm block break-all">{info.value}</a>
                     ) : (
                        <p className="font-bold text-navy text-xs sm:text-sm break-words">{info.value}</p>
                     )}
                     {info.value2 && (
                        info.href2 ? (
                           <a href={info.href2} className="font-bold text-navy hover:text-blue-600 transition-colors text-xs sm:text-sm block mt-0.5 break-all">{info.value2}</a>
                        ) : (
                           <p className="font-bold text-navy text-xs sm:text-sm mt-0.5 break-words">{info.value2}</p>
                        )
                     )}
                     <p className="text-slate-400 text-[10px] sm:text-xs mt-1">{info.sub}</p>
                  </motion.div>
               ))}
            </div>

            {/* Contact Form & Side Info */}
            <div className="grid lg:grid-cols-3 gap-12 items-start">
               {/* Form */}
               <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />

                  <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2 relative z-10">Send us a Message</h2>
                  <p className="text-slate-500 text-sm mb-10 relative z-10">Fill out the form below and our counselor will call you within 24 hours.</p>

                  <form className="space-y-6 relative z-10">
                     <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Full Name</label>
                           <input
                              type="text"
                              placeholder="e.g. John Doe"
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Phone Number</label>
                           <input
                              type="tel"
                              placeholder="+91 00000 00000"
                              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Email Address</label>
                        <input
                           type="email"
                           placeholder="john@example.com"
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Preferred Country</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all appearance-none cursor-pointer">
                           <option>Select Country</option>
                           <option>Georgia</option>
                           <option>Russia</option>
                           <option>Uzbekistan</option>
                           <option>Kyrgyzstan</option>
                           <option>Other</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-xs font-black text-navy uppercase tracking-widest ml-1">Your Message</label>
                        <textarea
                           rows="4"
                           placeholder="Tell us about your academic background or any questions you have..."
                           className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
                        ></textarea>
                     </div>

                     <button className="w-full bg-gradient-to-r from-blue-600 to-navy text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        Submit Application
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                     </button>
                  </form>
               </motion.div>

               {/* Social Side */}
               <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-navy px-2">Social Network</h2>
                  <div className="flex flex-col gap-4">
                     {socialLinks.map((s, i) => (
                        <motion.a
                           key={i}
                           href={s.link}
                           target="_blank"
                           rel="noopener noreferrer"
                           initial={{ opacity: 0, x: 20 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: i * 0.1 }}
                           className={`rounded-3xl border p-5 ${s.color} flex items-center gap-4 group transition-all hover:shadow-lg`}
                        >
                           <div className="p-3 bg-white rounded-2xl shadow-sm text-inherit group-hover:scale-110 transition-transform">{s.icon}</div>
                           <div className="flex-1">
                              <p className="font-bold text-navy text-sm">{s.platform}</p>
                              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{s.handle}</p>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center group-hover:bg-white transition-colors">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                           </div>
                        </motion.a>
                     ))}
                  </div>

                  {/* Trust Badge */}
                  <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl">
                     <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
                     </div>
                     <h4 className="font-bold text-navy mb-2">100% Authorized Partner</h4>
                     <p className="text-slate-500 text-xs leading-relaxed">We are official authorized representatives for all universities listed on our portal. Zero commission, direct admissions.</p>
                  </div>
               </div>
            </div>

            {/* WhatsApp CTA */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-10 text-center text-white shadow-xl"
            >
               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg className="w-9 h-9" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
               </div>
               <h2 className="text-3xl font-bold mb-3">Chat with Us on WhatsApp</h2>
               <p className="text-green-100 text-base mb-8 max-w-lg mx-auto">Get instant answers to all your questions about MBBS abroad. Our counselors are available Mon–Sat, 9 AM – 7 PM.</p>
               <a
                  href="https://wa.me/917738230335"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-white text-green-600 font-bold px-10 py-4 rounded-full hover:bg-green-50 transition-all shadow-lg text-base"
               >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Start WhatsApp Chat
               </a>
            </motion.div>

            {/* Direct call */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center"
            >
               <p className="text-navy font-bold text-xl mb-4">So future doctors! What are you waiting for?</p>
               <a
                  href="tel:+917738230335"
                  className="inline-flex items-center gap-3 bg-navy hover:bg-blue-800 text-white font-bold px-10 py-4 rounded-full transition-all shadow-lg text-base"
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                     <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Call Us Now
               </a>
            </motion.div>
         </div>

         {/* Floating WhatsApp */}
         <a
            href="https://wa.me/917738230335"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed top-1/2 -translate-y-1/2 right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
         >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
         </a>
      </div>
   );
};

export default Contact;
