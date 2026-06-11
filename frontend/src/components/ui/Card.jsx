import { cn } from '../../utils/helpers';

const Card = ({ children, className = '', ...props }) => (
  <div
    className={cn(
      'rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/30',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export default Card;
