import directorImg from '../assets/team/director.png';
import branchHeadImg from '../assets/team/branch_head.png';
import prHrHeadImg from '../assets/team/pr_hr_head.png';

export const leadershipMembers = [
  {
    id: 'lead-1',
    name: 'Director',
    role: 'Director',
    imageUrl: directorImg,
    description: 'Leading Orion Medical Education with a vision to provide world-class medical consultation and support to every aspiring student.',
    order: 1
  },
  {
    id: 'lead-2',
    name: 'Branch Head',
    role: 'Branch Head',
    imageUrl: branchHeadImg,
    description: 'Overseeing operations and ensuring the highest standards of student service and institutional partnerships across our branches.',
    order: 2
  },
  {
    id: 'lead-3',
    name: 'PR and HR Head',
    role: 'PR and HR Head',
    imageUrl: prHrHeadImg,
    description: 'Managing public relations and human resources to build a strong community and a supportive environment for our staff and students.',
    order: 3
  }
];
