// Uzbekistan Destination Guide Data
import asmiImg from '../assets/universities/asmi.png';
import navoiImg from '../assets/universities/navoi.png';

export const uzbekistanOverview = {
  benefits: [
    'Budget-friendly education',
    'NMC-approved universities',
    'English-medium programs',
    'Good Indian student community',
    'Quality hostel & facilities'
  ],
  universities: [
    {
      id: 1,
      name: 'Andijan State Medical Institute (ASMI)',
      image: asmiImg,
      description: 'Established in 1955, ASMI is one of the oldest and most respected government medical institutions in Uzbekistan. Located in the culturally rich Fergana Valley, it has a long-standing reputation for academic excellence. It offers a comprehensive 6-year English-medium MBBS program (MD) fully recognized by WHO and NMC.',
      highlight: 'Home to over 56 specialized departments, ASMI provides extensive clinical exposure through its large network of teaching hospitals, advanced simulation centers, and digital classrooms.'
    },
    {
      id: 2,
      name: 'Navoi State University',
      image: navoiImg,
      description: 'The medical department at Navoi State University traces its origins to 1983 and has rapidly emerged as a popular destination for international students. It provides a modern, research-oriented medical curriculum taught entirely in English, designed to meet global standards for NExT/FMGE and USMLE.',
      highlight: 'Students benefit from a student-centric learning environment in a safe urban setting, with programs emphasizing both theoretical mastery and practical skills supported by high-tech laboratories.'
    }
  ]
};
