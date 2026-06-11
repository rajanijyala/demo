import { format } from 'date-fns';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return 'Invalid date';
  }
  return format(parsed, 'MMM d, yyyy');
};

export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
