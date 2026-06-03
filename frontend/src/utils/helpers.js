import { format } from 'date-fns';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatDate = (date) => format(new Date(date), 'MMM d, yyyy');

export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
