import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageTitle from '../components/PageTitle';
import { getContactPageData, getHomeContent, saveContactSubmission, getCountries } from '../firebase/firestore';
import toast from 'react-hot-toast';

const Contact = () => {
   const [data, setData] = useState(null);
   const [globalWa, setGlobalWa] = useState('');
   const [countries, setCountries] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const pageData = await getContactPageData();
            if (pageData) setData(pageData);

            const homeData = await getHomeContent();
            if (homeData && homeData.whatsappNumber) {
               const cleanNum = homeData.whatsappNumber.replace(/\D/g, '');
               setGlobalWa(cleanNum.length === 10 ? `91${cleanNum}` : cleanNum);
            }

            const data = await getCountries();
            const filtered = data.filter(c => c.countryCardPosition || c.countrycardpostion);
            setCountries(filtered);
         } catch (err) {

         }
      };
      fetchData();
   }, []);

   const contactInfo = [
      {
         icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
               <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
               <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
         ),
         label: data?.officeTitle,
         value: data?.address,
         sub: data?.officeTagline,
         color: 'bg-blue-100 text-blue-600',
      },
      {
         icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
               <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
         ),
         label: data?.phoneTitle,
         value: data?.phone1,
         value2: data?.phone2,
         sub: data?.phoneTagline,
         href: data?.phone1 ? `tel:${data.phone1.replace(/[^0-9+]/g, '')}` : '',
         href2: data?.phone2 ? `tel:${data.phone2.replace(/[^0-9+]/g, '')}` : '',
         color: 'bg-green-100 text-green-600',
      },
      {
         icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
               <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
         ),
         label: data?.emailTitle,
         value: data?.email1,
         value2: data?.email2,
         sub: data?.emailTagline,
         href: data?.email1 ? `mailto:${data.email1}` : '',
         href2: data?.email2 ? `mailto:${data.email2}` : '',
         color: 'bg-amber-100 text-amber-600',
      },
      {
         icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
               <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
         ),
         label: data?.websiteTitle,
         value: data?.websiteLink,
         sub: data?.websiteTagline,
         href: data?.websiteLink ? (data.websiteLink.startsWith('http') ? data.websiteLink : `https://${data.websiteLink}`) : '',
         color: 'bg-purple-100 text-purple-600',
      },
   ];

   const socialLinks = [
      {
         platform: 'YouTube',
         icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" /></svg>
         ),
         handle: data?.youtube ? (data.youtube.split('/').pop()) : '',
         color: 'bg-red-50 border-red-100 text-red-500',
         link: data?.youtube || '',
      },
      {
         platform: 'Instagram',
         icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
         ),
         handle: data?.instagram ? (data.instagram.split('/').filter(Boolean).pop()) : '',
         color: 'bg-pink-50 border-pink-100 text-pink-500',
         link: data?.instagram || '',
      },
      {
         platform: 'Facebook',
         icon: (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
         ),
         handle: data?.facebook ? (data.facebook.split('/').filter(Boolean).pop()) : '',
         color: 'bg-blue-50 border-blue-100 text-blue-500',
         link: data?.facebook || '',
      },
   ];

   const [formData, setFormData] = useState({
      fullName: '',
      phoneNumber: '',
      country: '',
      message: ''
   });
   const [submitting, setSubmitting] = useState(false);

   const handleInputChange = (e) => {
      const { name, value } = e.target;

      if (name === 'fullName') {
         // Only alphabetic characters and spaces
         const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, '');
         setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      } else if (name === 'phoneNumber') {
         // Phone number sanitization: only allow digits, +, -, (, ), and spaces
         const sanitizedValue = value.replace(/[^0-9+()-\s]/g, '').slice(0, 15);
         setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
      } else if (name === 'message') {
         // Limit to 200 characters
         setFormData(prev => ({ ...prev, [name]: value.slice(0, 200) }));
      } else {
         setFormData(prev => ({ ...prev, [name]: value }));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Basic Validations
      if (formData.fullName.trim().length < 2) {
         toast.error('Please enter a valid full name (min 2 characters).', { position: 'top-right' });
         return;
      }



      const phoneRegex = /^[0-9+()-\s]{10,}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
         toast.error('Please enter a valid phone number (min 10 digits).', { position: 'top-right' });
         return;
      }

      if (!formData.country) {
         toast.error('Please select a preferred country.', { position: 'top-right' });
         return;
      }

      setSubmitting(true);
      try {
         await saveContactSubmission({
            ...formData,
            source: 'contact_page'
         });
         toast.success('Message sent successfully! We will contact you soon.', {
            position: 'top-right',
         });
         setFormData({
            fullName: '',
            phoneNumber: '',
            country: '',
            message: ''
         });
      } catch (err) {

         toast.error('Failed to send message. Please try again.', {
            position: 'top-right',
         });
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="min-h-screen bg-slate-50 pt-20 overflow-x-hidden">
         <PageTitle title="Contact" />

         {/* Header Banner - Standardized to Team Style */}
         <div className="relative py-16 sm:py-24 px-6 text-center overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
               <div className="absolute top-0 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
               <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]" />
               <div className="absolute inset-0 opacity-100" style={{ background: 'linear-gradient(110deg, #2563eb 0%, #1e3a5f 65%, #1e3a5f 100%)' }} />
               {/* Dot Pattern Overlay */}
               <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1.5px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
               {data?.subheader && (
                  <div className="flex justify-center mb-6">
                     <span className="inline-block text-amber-400 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] border border-white/20 bg-white/10 px-6 py-2.5 rounded-full backdrop-blur-md shadow-2xl">
                        {data?.subheader}
                     </span>
                  </div>
               )}
               <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
                  {data?.header}
               </motion.h1>
               <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-blue-100/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
                  {data?.description}
               </motion.p>
            </motion.div>
         </div>

         <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
            {/* Contact info cards wrapped in a premium container */}
            <motion.div
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
               className="relative py-12 px-4 sm:px-8 rounded-[3.5rem] overflow-hidden mb-20 shadow-2xl border border-white/10 group/container"
               style={{ background: 'linear-gradient(to left, #112e51, #2052c1)' }}
            >
               {/* Background decoration */}
               <div className="absolute inset-0 pointer-events-none z-[1]">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-full blur-[120px] -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-1/2 h-full bg-white/5 rounded-full blur-[120px] -ml-20 -mb-20" />
                  <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1.5px, transparent 0)', backgroundSize: '32px 32px' }} />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10" style={{ perspective: '2000px' }}>
                  {contactInfo.map((info, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{
                           y: -15,
                           scale: 1.04,
                           rotateX: 4,
                           rotateY: -2,
                           z: 40
                        }}
                        viewport={{ once: true }}
                        transition={{
                           initial: { delay: i * 0.15, duration: 0.8 },
                           default: { type: 'spring', stiffness: 200, damping: 25 }
                        }}
                        className="group relative bg-gradient-to-br from-white/30 to-white/5 backdrop-blur-2xl rounded-3xl p-7 border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden cursor-pointer flex flex-col items-start gap-4 min-h-[240px]"
                        style={{ transformStyle: 'preserve-3d' }}
                     >
                        {/* Inner glow for glass depth */}
                        <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none" />

                        {/* Diagonal Shine Effect */}
                        <div className="absolute inset-0 pointer-events-none">
                           <div className="absolute top-0 -left-[150%] w-[100%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-0 group-hover:duration-[1500ms] ease-in-out" />
                        </div>

                        <div className="flex items-center gap-4 relative z-10 w-full mb-2">
                           <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg bg-white/20 text-white backdrop-blur-md border border-white/40 group-hover:scale-110 transition-transform duration-500">
                              <div className="scale-90">
                                 {info.icon}
                              </div>
                           </div>
                           <p className="text-[11px] text-white/70 font-black uppercase tracking-[0.25em]">{info.label}</p>
                        </div>

                        <div className="relative z-10 flex-1 w-full" style={{ transform: 'translateZ(30px)' }}>
                           <div className="space-y-2">
                              {info.href ? (
                                 <a href={info.href} className={`${info.label === 'Email' ? 'text-[14px]' : 'text-[16px]'} font-bold text-white group-hover:text-amber-400 transition-colors block leading-snug`}>{info.value}</a>
                              ) : (
                                 <p className={`${info.label === 'Email' ? 'text-[14px]' : 'text-[16px]'} font-bold text-white leading-snug`}>{info.value}</p>
                              )}
                              {info.value2 && (
                                 info.href2 ? (
                                    <a href={info.href2} className={`${info.label === 'Email' ? 'text-[14px]' : 'text-[16px]'} font-bold text-white group-hover:text-amber-400 transition-colors block leading-snug`}>{info.value2}</a>
                                 ) : (
                                    <p className={`${info.label === 'Email' ? 'text-[14px]' : 'text-[16px]'} font-bold text-white leading-snug`}>{info.value2}</p>
                                 )
                              )}
                           </div>
                           <p className="text-white/60 text-[12px] mt-5 font-medium leading-relaxed border-t border-white/10 pt-4">{info.sub}</p>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </motion.div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-24">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
               {/* Send us a Message Card */}
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-8 bg-white rounded-3xl p-10 sm:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100"
               >
                  <h2 className="text-3xl font-bold text-navy mb-3 tracking-tight">Send us a Message</h2>
                  <p className="text-slate-400 text-[13px] mb-12 font-medium">Fill out the form below and our counselor will call you within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-navy uppercase tracking-[0.15em] ml-1">Full Name</label>
                           <input
                              type="text"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="Enter your full name"
                              required
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700"
                           />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-navy uppercase tracking-[0.15em] ml-1">Phone Number</label>
                           <input
                              type="tel"
                              name="phoneNumber"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                              placeholder="Enter your mobile number"
                              required
                              maxLength="15"
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700"
                           />
                        </div>
                     </div>



                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-navy uppercase tracking-[0.15em] ml-1">Preferred Country</label>
                        <div className="relative">
                           <select
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              required
                              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer font-medium text-slate-700"
                           >
                              <option value="">Select Preferred Country</option>
                              {countries.map((c, i) => (
                                 <option key={i} value={c.name}>{c.name}</option>
                              ))}
                              <option value="Other">Other</option>
                           </select>
                           <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <div className="flex justify-between items-center ml-1">
                           <label className="text-[10px] font-black text-navy uppercase tracking-[0.15em]">Your Message</label>
                           <span className={`text-[10px] font-bold ${formData.message.length >= 200 ? 'text-red-500' : 'text-slate-400'}`}>
                              {formData.message.length}/200
                           </span>
                        </div>
                        <textarea
                           name="message"
                           value={formData.message}
                           onChange={handleInputChange}
                           rows="4"
                           placeholder="Type your message or queries here..."
                           required
                           maxLength="200"
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-[13px] focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none font-medium text-slate-700"
                        ></textarea>
                     </div>

                     <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-[#2563EB] disabled:opacity-70 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-3 text-base shadow-xl shadow-blue-500/10"
                     >
                        {submitting ? 'Sending...' : 'Submit Message'}

                     </button>
                  </form>
               </motion.div>

               {/* Right Side: Social & Partner Cards */}
               <div className="lg:col-span-4 space-y-10 lg:pt-9">
                  <div className="space-y-6">
                     <h2 className="text-3xl font-bold text-navy px-2 tracking-tight">Social Network</h2>
                     <div className="flex flex-col gap-4">
                        {socialLinks.map((s, i) => (
                           <motion.a
                              key={i}
                              href={s.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              whileHover={{ x: 6 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 }}
                              className={`rounded-2xl border p-5 ${s.color} flex items-center gap-5 transition-all hover:shadow-lg hover:bg-white`}
                           >
                              <div className="p-3 bg-white rounded-xl shadow-sm text-inherit">
                                 {s.icon}
                              </div>
                              <div className="flex-1">
                                 <p className="font-bold text-navy text-[15px]">{s.platform}</p>
                                 <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{s.handle}</p>
                              </div>
                              <div className="text-slate-300">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" /></svg>
                              </div>
                           </motion.a>
                        ))}
                     </div>
                  </div>

                  {/* Trust Badge / Partner Card */}
                  <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)]"
                  >
                     <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-6">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
                     </div>
                     <h4 className="text-[18px] font-bold text-navy mb-4 tracking-tight">
                        {data?.partnerTitle}
                     </h4>
                     <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
                        {data?.partnerDescription}
                     </p>
                  </motion.div>
               </div>
            </div>

            {/* WhatsApp CTA */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-12 text-center text-white shadow-xl mt-24"
            >
               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
               </div>
               <h2 className="text-4xl font-bold mb-4">
                  {data?.whatsappTitle}
               </h2>
               <p className="text-green-50 text-lg mb-10 max-w-2xl mx-auto font-medium">
                  {data?.whatsappDescription}
               </p>
               <a
                  href={`https://wa.me/${globalWa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 sm:gap-4 bg-white text-green-600 font-bold px-6 py-3 sm:px-12 sm:py-5 rounded-full hover:shadow-2xl transition-all text-xs sm:text-lg shadow-xl"
               >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  {data?.whatsappButtonLabel}
               </a>
            </motion.div>

            {/* Bottom Call Section Restored */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mt-16 text-center"
            >
               <h2 className="text-2xl font-bold text-navy mb-2 tracking-tight">{data?.ctaTitle || "So future doctors! What are you waiting for?"}</h2>
               <div className="flex justify-center mt-6">
                  <a
                     href={`tel:${data?.ctaPhone ? data.ctaPhone.replace(/\D/g, '') : globalWa}`}
                     className="bg-[#1e3a5f] text-white font-bold px-10 py-4 rounded-full hover:bg-navy transition-all flex items-center gap-3 shadow-xl shadow-slate-200"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                     </svg>
                     {data?.ctaButtonLabel || "Call Us Now"}
                  </a>
               </div>
            </motion.div>
         </div>

         {/* Floating WhatsApp */}
         <a
            href={`https://wa.me/${globalWa}`}
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
