// Shared data structure used by all templates
export const emptyResumeData = {
  title: 'Untitled Resume',
  templateId: 'minimal',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  skills: [],
  experience: [],  // { company, position, startDate, endDate, current, description }
  education: [],   // { institution, degree, field, startDate, endDate, gpa }
  projects: [],    // { name, description, technologies, link }
};

export const TEMPLATE_META = {
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Single column, ATS-friendly, clean whitespace',
    accent: '#1E293B',
    tag: 'ATS Friendly',
    recommended: ['any'],
    isPro: false,
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column sidebar layout, bold header',
    accent: '#4F46E5',
    tag: 'Most Popular',
    recommended: ['tech', 'design'],
    isPro: false,
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Color accents, modern typography, standout design',
    accent: '#7C3AED',
    tag: 'Stand Out',
    recommended: ['design', 'marketing'],
    isPro: true,
  },
  compact: {
    id: 'compact',
    name: 'Compact',
    description: 'Dense one-page layout, maximum content',
    accent: '#0F766E',
    tag: 'One Page',
    recommended: ['senior', 'executive'],
    isPro: false,
  },
  developer: {
    id: 'developer',
    name: 'Developer',
    description: 'Skills & projects focused, tech-first layout',
    accent: '#0EA5E9',
    tag: 'For Devs',
    recommended: ['tech', 'engineering'],
    isPro: true,
  },
};
