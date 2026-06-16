export const APP_NAME = import.meta.env.VITE_APP_NAME || 'AMIE';

export const NAV_LINKS = [
  { label: 'Home', to: '/', protected: false },
  { label: 'Dashboard', to: '/dashboard', protected: true },
  { label: 'Interview', to: '/interview/configure', protected: true },
  { label: 'Resume', to: '/interview/resume', protected: true },
  { label: 'Questions', to: '/questions', protected: true },
  { label: 'Analytics', to: '/analytics', protected: true },
];

export const FEATURE_CARDS = [
  {
    title: 'Real interview sessions',
    description: 'Configure, start, resume, submit, and review interviews through live APIs.',
  },
  {
    title: 'Deterministic scoring',
    description: 'Technical accuracy, communication, problem solving, confidence, and completeness are scored consistently.',
  },
  {
    title: 'Practice plan',
    description: 'Every completed interview creates feedback and a seven-day improvement plan.',
  },
];
