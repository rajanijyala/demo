import { cn } from '../../utils/helpers';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-400/70';
  const variants = {
    primary: 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-lg shadow-sky-500/20',
    secondary: 'border border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800',
    ghost: 'bg-transparent text-slate-200 hover:bg-slate-800/80',
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
