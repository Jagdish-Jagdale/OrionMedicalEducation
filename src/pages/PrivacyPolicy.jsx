import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Information We Collect',
      content: `When you interact with Orion Medical Education, we may collect the following types of information:`,
      list: [
        { bold: 'Personal Information:', text: 'Name, email address, phone number, and other contact details you provide through our forms.' },
        { bold: 'Academic Information:', text: 'Educational background, NEET scores, and other academic details relevant to your MBBS admission.' },
        { bold: 'Usage Data:', text: 'Information about how you interact with our website, including pages visited, time spent, and browser information.' },
        { bold: 'Communication Records:', text: 'Records of your inquiries, feedback, and correspondence with our team.' },
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'How We Use Your Information',
      content: 'We use the information we collect for the following purposes:',
      list: [
        { text: 'To provide counseling and guidance for MBBS admissions abroad.' },
        { text: 'To communicate with you regarding your inquiries and application process.' },
        { text: 'To improve our website, services, and user experience.' },
        { text: 'To send relevant updates about admission deadlines, university information, and our services (with your consent).' },
        { text: 'To comply with legal obligations and protect our rights.' },
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Information Sharing & Disclosure',
      content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:',
      list: [
        { text: 'With partner universities for the purpose of processing your admission application.' },
        { text: 'With trusted service providers who assist us in operating our website and services.' },
        { text: 'When required by law or to respond to legal processes.' },
        { text: 'To protect the rights, property, or safety of Orion Medical Education, our users, or the public.' },
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Data Security',
      content:
        'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encrypted data transmission, secure server infrastructure, and regular security audits. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Cookies & Tracking',
      content:
        'Our website may use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. Cookies are small data files stored on your device that help us remember your preferences and understand how you use our site. You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of our website.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Third-Party Links',
      content:
        'Our website may contain links to third-party websites, including university portals, government agencies, and partner organizations. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Your Rights',
      content: 'Under applicable data protection laws, you have the following rights regarding your personal data:',
      list: [
        { bold: 'Right of Access:', text: 'Request access to the personal information we hold about you.' },
        { bold: 'Right to Rectification:', text: 'Request correction of inaccurate or incomplete data.' },
        { bold: 'Right to Erasure:', text: 'Request deletion of your personal information, subject to legal obligations.' },
        { bold: 'Right to Withdraw Consent:', text: 'Opt out of marketing communications at any time.' },
        { bold: 'Right to Complain:', text: 'Lodge a complaint with the relevant data protection authority.' },
      ],
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Children's Privacy",
      content:
        "Our services are intended for students and their guardians seeking MBBS education abroad. We do not knowingly collect personal information from children under the age of 13 without verifiable parental consent. If you believe we have inadvertently collected such information, please contact us immediately and we will take steps to delete it promptly.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Changes to This Policy',
      content:
        'We reserve the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically to stay informed about how we protect your information. Continued use of our services after any changes constitutes acceptance of the updated policy.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: 'Contact Us',
      content:
        'If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please do not hesitate to reach out:',
      contact: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-28 pb-20">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-blue-600/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-bold tracking-[0.2em] uppercase px-5 py-2.5 rounded-full mb-6 border border-blue-100/60 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Legal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-500 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how <span className="text-slate-700 font-medium">Orion Medical Education</span> collects, uses, and safeguards your personal information when you use our services.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6">
              <span className="text-sm text-slate-400 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Effective: May {currentYear}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-sm text-slate-400 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Last Updated: May {currentYear}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar – Table of Contents */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="lg:sticky lg:top-28">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">Table of Contents</h3>
                <nav className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        const el = document.getElementById(`section-${index}`);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="group flex items-center gap-2.5 py-2 px-3 rounded-lg text-sm text-slate-500 hover:text-blue-700 hover:bg-blue-50/60 transition-all w-full text-left"
                    >
                      <span className="w-5 h-5 flex items-center justify-center rounded-md bg-slate-100 group-hover:bg-blue-100 text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="truncate">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={index}
                id={`section-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * index }}
                className="bg-white rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Section Header */}
                <div className="flex items-center gap-4 px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Section {String(index + 1).padStart(2, '0')}</span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* Section Body */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                  <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-4">
                    {section.content}
                  </p>

                  {section.list && (
                    <div className="space-y-3 mt-4">
                      {section.list.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 bg-slate-50/80 rounded-xl px-4 py-3 border border-slate-100"
                        >
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {item.bold && <span className="font-semibold text-slate-700">{item.bold} </span>}
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.contact && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                      <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl px-5 py-4 border border-blue-100/60">
                        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Email</p>
                          <p className="text-sm text-slate-700 font-medium">info@orionmedicaleducation.com</p>
                          <p className="text-sm text-slate-700 font-medium">admission@orionmedicaleducation.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl px-5 py-4 border border-green-100/60">
                        <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Phone</p>
                          <p className="text-sm text-slate-700 font-medium">+91 77382 30335</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl px-5 py-4 border border-amber-100/60">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Address</p>
                          <p className="text-sm text-slate-700 font-medium">1st Floor, Bagga House, Prabhat Rd, Deccan Gymkhana, Pune, Maharashtra 411004</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>
            ))}

            {/* Bottom Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/60 p-6 sm:p-8 text-center"
            >
              <p className="text-sm text-slate-500 leading-relaxed">
                By using our website and services, you acknowledge that you have read and understood this Privacy Policy.
                <br />
                <span className="text-slate-400 text-xs mt-1 inline-block">© {currentYear} Orion Medical Education. All rights reserved.</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
