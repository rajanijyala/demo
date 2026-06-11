import { cn } from '../../utils/helpers';

const variants = {
  default: 'bg-sky-400/10 text-sky-200 border-sky-400/30',
  success: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/30',
  warning: 'bg-amber-400/10 text-amber-200 border-amber-400/30',
  danger: 'bg-rose-400/10 text-rose-200 border-rose-400/30',
};

const Badge = ({ children, variant = 'default', className = '' }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
      className,
    )}
  >
    {children}
  </span>
);

export default Badge;
