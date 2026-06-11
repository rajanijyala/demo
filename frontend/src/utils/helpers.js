import { format } from 'date-fns';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatDate = (date) => format(new Date(date), 'MMM d, yyyy');

export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sanitizeEmail = (raw) => {
  if (typeof raw !== 'string') return '';
  const trimmed = raw.trim().toLowerCase();
  return EMAIL_RE.test(trimmed) ? trimmed : '';
};

export const generateToken = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};
