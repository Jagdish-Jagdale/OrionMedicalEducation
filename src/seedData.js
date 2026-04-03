import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase/config';

// ── COUNTRIES ──────────────────────────────────────────────
const countries = [
  {
    name: 'Kyrgyzstan',
    slug: 'kyrgyzstan',
    description: 'Kyrgyzstan has emerged as one of the most popular destinations for MBBS abroad. It offers NMC-approved universities, English-medium education, and an extremely affordable fee structure. Orion Medical Education is the Official Representative of top Kyrgyz medical universities.',
    imageUrl: '',
    benefits: [
      'NMC & WHO-approved universities',
      'No donation or capitation fee',
      'English medium MBBS program',
      'Affordable fee: ₹15–25 Lakhs total',
      'Indian food & hostel available',
      'Direct admission without entrance exam (NEET required)',
      'Safe country with Indian embassy support',
    ],
    order: 1,
  },
  {
    name: 'Russia',
    slug: 'russia',
    description: 'Russia is home to some of the world\'s oldest and most prestigious medical universities. Russian medical degrees are globally recognized and the country offers world-class infrastructure, qualified faculty, and a multicultural environment for international students.',
    imageUrl: '',
    benefits: [
      'World-renowned medical institutions',
      'NMC, WHO, WDOMS approved',
      'Over 50 years of medical education legacy',
      'Low cost of living',
      'Strong alumni network in India',
      'Advanced research facilities',
      'Clinical training from Year 1',
    ],
    order: 2,
  },
  {
    name: 'Georgia',
    slug: 'georgia',
    description: 'Georgia has become a top MBBS destination in Eastern Europe. Located at the crossroads of Europe and Asia, Georgian medical universities offer a perfect blend of European education standards with affordable costs.',
    imageUrl: '',
    benefits: [
      'European standard medical education',
      'NMC & WHO approved',
      'Visa-free entry for Indian students',
      'Moderate climate and safe environment',
      'Strong Indian student community',
      'English-medium programs available',
      'Lower cost compared to Europe',
    ],
    order: 3,
  },
  {
    name: 'Uzbekistan',
    slug: 'uzbekistan',
    description: 'Uzbekistan is a rapidly growing destination for MBBS education with modern universities, low fees, and a welcoming environment for Indian students. The country is investing heavily in medical education infrastructure.',
    imageUrl: '',
    benefits: [
      'NMC-approved universities',
      'Very affordable fee structure',
      'No language barrier (programs in English)',
      'Indian food and cultural compatibility',
      'Growing medical research infrastructure',
      'Friendly visa process for Indians',
      'Rich cultural heritage',
    ],
    order: 4,
  },
];

// ── UNIVERSITIES ───────────────────────────────────────────
const universities = [
  // Kyrgyzstan
  {
    name: 'International School of Medicine (ISM) / IEU',
    slug: 'ism-ieu-kyrgyzstan',
    countryName: 'Kyrgyzstan',
    countrySlug: 'kyrgyzstan',
    description: 'IEU (International European University) and ISM are premier medical institutions in Bishkek, Kyrgyzstan. Known for their modern facilities, experienced faculty, and strong clinical training programs.',
    imageUrl: '',
    features: ['Modern simulation labs', 'Experienced international faculty', 'Well-equipped hospitals for clinical training', 'Strong alumni in India', 'Indian mess on campus'],
    accreditation: ['NMC', 'WHO', 'WDOMS'],
    established: 2003,
    programDuration: '5.5 Years (including internship)',
    order: 1,
  },
  {
    name: 'Asian Medical Institute (AMU)',
    slug: 'amu-kyrgyzstan',
    countryName: 'Kyrgyzstan',
    countrySlug: 'kyrgyzstan',
    description: 'Asian Medical Institute is one of the leading medical universities in Kyrgyzstan, offering quality MBBS education to international students including thousands of Indians.',
    imageUrl: '',
    features: ['Well-structured curriculum', 'Affordable tuition fees', 'Hostel with Indian food', 'Active Indian student association', 'FMGE coaching support'],
    accreditation: ['NMC', 'WHO'],
    established: 1995,
    programDuration: '5.5 Years',
    order: 2,
  },
  // Russia
  {
    name: 'North Siberian University (NSU)',
    slug: 'nsu-russia',
    countryName: 'Russia',
    countrySlug: 'russia',
    description: 'North Siberian University is a prestigious institution offering comprehensive medical programs. Known for excellent research facilities and highly qualified professors.',
    imageUrl: '',
    features: ['State-of-the-art research labs', 'Strong clinical exposure', 'Experienced faculty', 'Vibrant campus life', 'Indian students support cell'],
    accreditation: ['NMC', 'WHO', 'WDOMS'],
    established: 1958,
    programDuration: '6 Years',
    order: 3,
  },
  {
    name: 'Crimea Federal University (CFU)',
    slug: 'cfu-russia',
    countryName: 'Russia',
    countrySlug: 'russia',
    description: 'Crimea Federal University is a top-ranked Russian medical university with a rich heritage of medical education and research excellence.',
    imageUrl: '',
    features: ['Modern infrastructure', 'Advanced clinical training', 'Multicultural campus', 'Affordable fees', 'Low cost of living'],
    accreditation: ['NMC', 'WHO'],
    established: 1931,
    programDuration: '6 Years',
    order: 4,
  },
  {
    name: 'Orenburg State Medical University',
    slug: 'orenburg-russia',
    countryName: 'Russia',
    countrySlug: 'russia',
    description: 'Orenburg State Medical University is one of Russia\'s prominent medical schools, offering world-class education with a strong emphasis on clinical and practical training.',
    imageUrl: '',
    features: ['100+ years of legacy', 'NMC recognized', 'English-medium program for international students', 'Clinical training from Year 3', 'Indian cultural association'],
    accreditation: ['NMC', 'WHO', 'WDOMS'],
    established: 1944,
    programDuration: '6 Years',
    order: 5,
  },
  {
    name: 'Perm State Medical University',
    slug: 'perm-russia',
    countryName: 'Russia',
    countrySlug: 'russia',
    description: 'Perm State Medical University is a renowned university offering MBBS in English with internationally recognized degrees and excellent placement record.',
    imageUrl: '',
    features: ['European standard education', 'Strong FMGE track record', 'Experienced international faculty', 'Safe city environment', 'Active Indian community'],
    accreditation: ['NMC', 'WHO'],
    established: 1916,
    programDuration: '6 Years',
    order: 6,
  },
  {
    name: 'Mari State University',
    slug: 'mari-russia',
    countryName: 'Russia',
    countrySlug: 'russia',
    description: 'Mari State University provides affordable quality medical education with English-medium programs and a supportive environment for international students.',
    imageUrl: '',
    features: ['Affordable fee structure', 'Peaceful city', 'English medium MBBS', 'Hostel with Indian food', 'Direct professor interaction'],
    accreditation: ['NMC', 'WHO'],
    established: 1972,
    programDuration: '6 Years',
    order: 7,
  },
  {
    name: 'North Caucasian Federal University (NCFU)',
    slug: 'ncfu-russia',
    countryName: 'Russia',
    countrySlug: 'russia',
    description: 'NCFU Medical Institute offers quality MBBS programs recognized internationally, with excellent clinical exposure in a modern university environment.',
    imageUrl: '',
    features: ['Modern clinical facilities', 'Research-oriented faculty', 'Strong Indian student network', 'Cultural diversity', 'MCI-recognized degree'],
    accreditation: ['NMC', 'WHO', 'WDOMS'],
    established: 1960,
    programDuration: '6 Years',
    order: 8,
  },
  {
    name: 'Kabardino-Balkarian State University (KBSU)',
    slug: 'kbsu-russia',
    countryName: 'Russia',
    countrySlug: 'russia',
    description: 'KBSU is a federal university in Nalchik offering MBBS programs with strong practical training and a small class size ensuring personalized attention.',
    imageUrl: '',
    features: ['Small class sizes', 'Personal faculty attention', 'Strong FMGE pass rate', 'Beautiful campus setting', 'Indian community support'],
    accreditation: ['NMC', 'WHO'],
    established: 1957,
    programDuration: '6 Years',
    order: 9,
  },
  {
    name: 'Amur State Medical Academy',
    slug: 'amur-russia',
    countryName: 'Russia',
    countrySlug: 'russia',
    description: 'Amur State Medical Academy is one of the prominent medical institutions in Russia\'s Far East, offering MBBS programs with high-tech medical training facilities.',
    imageUrl: '',
    features: ['igh-tech labs', 'International partnerships', 'Experienced medical professors', 'Robust clinical training', 'Low tuition fees'],
    accreditation: ['NMC', 'WHO'],
    established: 1952,
    programDuration: '6 Years',
    order: 10,
  },
  // Georgia
  {
    name: 'Selefkia European University (SEU)',
    slug: 'seu-georgia',
    countryName: 'Georgia',
    countrySlug: 'georgia',
    description: 'SEU is a modern university in Tbilisi offering an internationally recognized MBBS program with European academic standards and strong clinical training.',
    imageUrl: '',
    features: ['European academic standards', 'Modern simulation center', 'English-medium MBBS', 'Experienced professors', 'Active campus life'],
    accreditation: ['NMC', 'WHO'],
    established: 2005,
    programDuration: '6 Years',
    order: 11,
  },
  {
    name: 'David Tvildiani Medical University (DTMU)',
    slug: 'dtmu-georgia',
    countryName: 'Georgia',
    countrySlug: 'georgia',
    description: 'DTMU is one of the oldest and most respected medical universities in Georgia with a strong academic history and a globally recognized degree.',
    imageUrl: '',
    features: ['Established reputation', 'Strong clinical hospital attachment', 'NMC approved', 'International student support', 'Modern labs and library'],
    accreditation: ['NMC', 'WHO', 'WDOMS'],
    established: 1992,
    programDuration: '6 Years',
    order: 12,
  },
  {
    name: 'University of Georgia (UG)',
    slug: 'ug-georgia',
    countryName: 'Georgia',
    countrySlug: 'georgia',
    description: 'One of Georgia\'s largest private universities offering a comprehensive MBBS program with state-of-the-art infrastructure and a progressive teaching methodology.',
    imageUrl: '',
    features: ['Large modern campus', 'Research-driven teaching', 'Wide hospital network', 'International student community', 'Strong FMGE preparation support'],
    accreditation: ['NMC', 'WHO'],
    established: 2004,
    programDuration: '6 Years',
    order: 13,
  },
  {
    name: 'Avicenna Batumi International University',
    slug: 'avicenna-batumi-georgia',
    countryName: 'Georgia',
    countrySlug: 'georgia',
    description: 'Located in the beautiful coastal city of Batumi, this university offers a globally recognized medical degree with a perfect blend of quality education and stunning surroundings.',
    imageUrl: '',
    features: ['Coastal city campus', 'Affordable fee', 'English medium MBBS', 'Small cohort sizes', 'Safe city for students'],
    accreditation: ['NMC', 'WHO'],
    established: 2010,
    programDuration: '6 Years',
    order: 14,
  },
  {
    name: 'Caucasus International University (CIU)',
    slug: 'ciu-georgia',
    countryName: 'Georgia',
    countrySlug: 'georgia',
    description: 'CIU is a progressive university in Tbilisi with strong emphasis on clinical training and modern medical education methodologies.',
    imageUrl: '',
    features: ['Clinical-first approach', 'Modern teaching methodologies', 'Strong Indian alumni network', 'Affordable accommodation', 'Regular FMGE coaching'],
    accreditation: ['NMC', 'WHO'],
    established: 1995,
    programDuration: '6 Years',
    order: 15,
  },
  {
    name: 'Georgian Research and University (GRUNI)',
    slug: 'gruni-georgia',
    countryName: 'Georgia',
    countrySlug: 'georgia',
    description: 'GRUNI is a research-focused medical university offering an MBBS program that integrates cutting-edge research with practical clinical training.',
    imageUrl: '',
    features: ['Research-integrated curriculum', 'Strong publication record', 'International faculty network', 'Modern campus', 'Post-graduate opportunities'],
    accreditation: ['NMC', 'WHO'],
    established: 2001,
    programDuration: '6 Years',
    order: 16,
  },
  {
    name: 'Caucasus University (CU)',
    slug: 'cu-georgia',
    countryName: 'Georgia',
    countrySlug: 'georgia',
    description: 'Caucasus University is a prestigious institution in Tbilisi offering a comprehensive MBBS program with European educational standards.',
    imageUrl: '',
    features: ['European accreditation', 'Strong international partnerships', 'English-medium education', 'Modern simulation labs', 'Comprehensive student support'],
    accreditation: ['NMC', 'WHO'],
    established: 2004,
    programDuration: '6 Years',
    order: 17,
  },
  // Uzbekistan
  {
    name: 'Andijan State Medical Institute (ASMI)',
    slug: 'asmi-uzbekistan',
    countryName: 'Uzbekistan',
    countrySlug: 'uzbekistan',
    description: 'ASMI is one of the oldest and most respected medical institutes in Uzbekistan, offering a comprehensive MBBS program with NMC recognition and quality education.',
    imageUrl: '',
    features: ['80+ years of medical education', 'NMC recognized', 'Affordable total cost', 'Warm climate', 'Indian-friendly environment'],
    accreditation: ['NMC', 'WHO'],
    established: 1955,
    programDuration: '5.5 Years',
    order: 18,
  },
  {
    name: 'Navoi State Pedagogical Institute Medical Faculty',
    slug: 'navoi-uzbekistan',
    countryName: 'Uzbekistan',
    countrySlug: 'uzbekistan',
    description: 'Navoi State Institute offers a growing MBBS program with modern facilities and a supportive environment for international students seeking quality education at affordable costs.',
    imageUrl: '',
    features: ['Modern infrastructure', 'Affordable fee structure', 'English medium teaching', 'Active student support center', 'Safe and peaceful city'],
    accreditation: ['NMC', 'WHO'],
    established: 1979,
    programDuration: '5.5 Years',
    order: 19,
  },
];

// ── TEAM ───────────────────────────────────────────────────
const team = [
  {
    name: 'Dr. Rajesh Sharma',
    role: 'Director',
    imageUrl: '',
    description: 'With over 15 years of experience in international medical education consulting, Dr. Sharma has personally guided 500+ students to top medical universities across 4 countries. He is the visionary founder of Orion Medical Education.',
    order: 1,
  },
  {
    name: 'Priya Mehta',
    role: 'Branch Head',
    imageUrl: '',
    description: 'Priya heads our operations and student coordination. She has been instrumental in building partnerships with universities in Russia and Georgia. Her dedication ensures every student receives personalized guidance.',
    order: 2,
  },
  {
    name: 'Amit Kumar',
    role: 'PR and HR Head',
    imageUrl: '',
    description: 'Amit manages our public relations and human resources. He coordinates with universities abroad, maintains our reputation, and ensures that our team is always motivated to deliver the best outcomes for students.',
    order: 3,
  },
];

// ── REVIEWS ────────────────────────────────────────────────
const reviews = [
  // Parents
  {
    name: 'Mrs. Sunita Patel',
    type: 'parent',
    message: 'We were very anxious about sending our daughter abroad for MBBS. Orion Medical Education guided us at every step — from choosing the right university to visa processing and even airport pickup. They truly are custodians of our children\'s future. Highly recommend!',
    rating: 5,
    university: 'IEU, Kyrgyzstan',
  },
  {
    name: 'Mr. Vikram Singh',
    type: 'parent',
    message: 'Orion team is extremely professional and transparent. No hidden charges, no false promises. My son got admission to a top Russian university and everything was handled smoothly. We are very satisfied with their service.',
    rating: 5,
    university: 'Perm State Medical University, Russia',
  },
  {
    name: 'Mrs. Kavitha Rao',
    type: 'parent',
    message: 'As a parent, my biggest concern was safety. The Orion team had local representatives at the airport when my daughter arrived in Georgia. They arranged her hostel, sim card, and even helped her understand the local culture. I felt so relieved.',
    rating: 5,
    university: 'DTMU, Georgia',
  },
  {
    name: 'Mr. Harish Verma',
    type: 'parent',
    message: 'I had contacted 5 different consultants before coming to Orion. Only Orion gave us the complete picture — fees, living costs, NMC status — honestly and transparently. My son is now in his 2nd year and doing great. God bless this organization.',
    rating: 5,
    university: 'ASMI, Uzbekistan',
  },
  // Students
  {
    name: 'Aakash Joshi',
    type: 'student',
    message: 'Orion guided me from confusion to confidence. I didn\'t know anything about MBBS abroad, but after consulting with them, I had a clear roadmap. Now I am studying in Kyrgyzstan and the support they gave me even after landing was incredible!',
    rating: 5,
    university: 'Asian Medical Institute, Kyrgyzstan',
  },
  {
    name: 'Sneha Gupta',
    type: 'student',
    message: 'I had almost given up after NEET, but Orion showed me another path. They helped me secure admission to a WHO-approved university in Georgia. The process was smooth, transparent, and they were available 24/7 to answer my questions.',
    rating: 5,
    university: 'Caucasus International University, Georgia',
  },
  {
    name: 'Rahul Sharma',
    type: 'student',
    message: 'Best decision of my life was trusting Orion. The team is knowledgeable, honest, and genuinely care about student success. My visa was approved in the first attempt, and I am now in my 3rd year of MBBS in Russia. Thank you Orion!',
    rating: 5,
    university: 'Orenburg State Medical University, Russia',
  },
  {
    name: 'Divya Krishnan',
    type: 'student',
    message: 'What sets Orion apart is their post-arrival support. Even months after I arrived in Russia, they checked in on me, connected me with local doctors who speak Hindi, and helped me navigate the healthcare system. True custodians indeed!',
    rating: 5,
    university: 'KBSU, Russia',
  },
];

// ── OBSERVERSHIP ──────────────────────────────────────────
const observership = {
  title: 'Clinical Observership Program',
  description: 'The Orion Medical Education Clinical Observership Program is a prestigious initiative designed to give MBBS students and graduates a firsthand experience of advanced medical practice in India\'s top hospitals. This program bridges the gap between theoretical knowledge and real-world clinical practice, offering participants exposure to cutting-edge medical technologies and techniques under the mentorship of renowned specialists.',
  duration: '4 weeks – 3 months (flexible batches)',
  highlights: [
    'Elite clinical exposure at top-tier hospitals',
    'Advanced specialization tracks in Oncology, Critical Care & ICU',
    'Tele-ICU monitoring and remote critical care experience',
    'Professional certification upon completion',
    'Mentorship by senior consultants and specialists',
    'Exposure to cutting-edge medical technology and diagnostics',
  ],
  partnerHospitals: [
    { name: 'AIIMS Delhi', logoUrl: '' },
    { name: 'Apollo Hospitals', logoUrl: '' },
    { name: 'Fortis Healthcare', logoUrl: '' },
    { name: 'Manipal Hospitals', logoUrl: '' },
    { name: 'Medanta', logoUrl: '' },
    { name: 'Max Healthcare', logoUrl: '' },
    { name: 'Kokilaben Hospital', logoUrl: '' },
    { name: 'Narayana Health', logoUrl: '' },
  ],
};

// ── SEED RUNNER ───────────────────────────────────────────
export async function runSeed() {
  console.log('🌱 Starting Firestore seed...');

  // 1. Seed countries
  const countryIdMap = {};
  for (const country of countries) {
    const docRef = await addDoc(collection(db, 'countries'), country);
    countryIdMap[country.slug] = docRef.id;
    console.log(`✅ Country: ${country.name} → ${docRef.id}`);
  }

  // 2. Seed universities (link to country IDs)
  for (const uni of universities) {
    const countryId = countryIdMap[uni.countrySlug];
    const { countrySlug, ...uniData } = uni;
    await addDoc(collection(db, 'universities'), {
      ...uniData,
      countryId,
    });
    console.log(`✅ University: ${uni.name}`);
  }

  // 3. Seed team
  for (const member of team) {
    await addDoc(collection(db, 'team'), member);
    console.log(`✅ Team: ${member.name}`);
  }

  // 4. Seed reviews
  for (const review of reviews) {
    await addDoc(collection(db, 'reviews'), {
      ...review,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Review: ${review.name}`);
  }

  // 5. Seed observership
  await addDoc(collection(db, 'observership'), observership);
  console.log('✅ Observership document seeded');

  console.log('🎉 Seeding complete! Refresh your app to see the data.');
  return '✅ All data seeded successfully!';
}

// Usage from browser console:
// import { runSeed } from './seedData.js'; runSeed();
