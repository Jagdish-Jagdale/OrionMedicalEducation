// Georgia Destination Guide Data
import seuImg from '../assets/universities/seu.png';
import dtmuImg from '../assets/universities/dtmu.png';
import ugImg from '../assets/universities/ug.png';
import avicennaImg from '../assets/universities/avicenna_batumi.png';
import ciuImg from '../assets/universities/ciu.png';
import gruniImg from '../assets/universities/gruni.png';
import cuImg from '../assets/universities/cu.png';

export const georgiaOverview = {
  benefits: [
    'European standard education',
    'Modern hospitals & clinical training',
    'Safe for students',
    'High visa success rate',
    'Globally accepted degree'
  ],
  universities: [
    {
      id: 1,
      name: 'Georgian National University SEU',
      image: seuImg,
      description: 'Established in 2001, SEU is the largest private higher education institution in Georgia. Its ultra-modern campus in Tbilisi features over 160 study rooms and sophisticated simulation centers adhering to European standards. It offers a 6-year English-medium MD program emphasizing early clinical exposure.',
      highlight: 'SEU provides a vibrant multicultural environment with students from over 50 countries, dedicated FMGE/NExT coaching, and high-quality hostel facilities with Indian mess options.'
    },
    {
      id: 2,
      name: 'David Tvildiani Medical University (DTMU)',
      image: dtmuImg,
      description: 'Founded in 1989, DTMU was the first private medical school in Georgia with a curriculum entirely in English. It is renowned for academic rigor and preparing students for international licensing exams like the USMLE. The 6-year program provides a deep foundation in basic sciences before intensive clinical clerkships.',
      highlight: 'Highly respected by global medical bodies, DTMU is a top choice for students aiming for careers in the United States or Europe, benefiting from a rich digital and physical library.'
    },
    {
      id: 3,
      name: 'The University of Georgia (UG)',
      image: ugImg,
      description: 'Established in 2004, UG is recognized for one of the most advanced infrastructures in the region. It offers a 6-year MD program fully compliant with WHO and NMC standards, featuring high-tech laboratories and "smart" classrooms for an interactive learning experience.',
      highlight: 'With a massive international student population, UG’s strong clinical network in Tbilisi ensures diverse hands-on training across various medical specialties.'
    },
    {
      id: 4,
      name: 'Avicenna Batumi Medical University',
      image: avicennaImg,
      description: 'Established in 2022 in Batumi, this modern institution follows a unique "hospital-based" education model, integrated with a network of five multi-profile hospitals. It utilizes a state-of-the-art simulation center equipped with American-standard technology.',
      highlight: 'Focusing on "Learning for Life," it has quickly gained a reputation for its research-oriented approach and commitment to Western academic standards.'
    },
    {
      id: 5,
      name: 'Caucasus International University (CIU)',
      image: ciuImg,
      description: 'Founded in 1995, CIU maintains an extensive clinical foundation through partnerships with over 44 affiliated hospitals, providing students exposure to a wide variety of medical cases during their 6-year program.',
      highlight: 'CIU offers a supportive atmosphere with modern anatomy labs, simulation centers, and on-campus facilities including Indian dining options and 24/7 student assistance.'
    },
    {
      id: 6,
      name: 'Grigol Robakidze University (GRUNI)',
      image: gruniImg,
      description: 'Established in 1992, GRUNI is prestigious for its simulation-based medical education. Its Simulation Training Laboratory Centre allows students to perfect diagnostic and surgical skills on high-fidelity phantoms.',
      highlight: 'GRUNI provides a curriculum fully aligned with international standards, supported by advanced laboratory facilities for biophysics, chemistry, and histology.'
    },
    {
      id: 7,
      name: 'Caucasus University (CU)',
      image: cuImg,
      description: 'Established in 1998, CU emphasizes internationalization and innovation. Its medical curriculum is designed to meet European standards, focusing on research proficiency and modern diagnostic tools.',
      highlight: 'Ranked highly for academic quality, CU provides a high-energy urban learning environment and opportunities for global academic exchange.'
    }
  ]
};
