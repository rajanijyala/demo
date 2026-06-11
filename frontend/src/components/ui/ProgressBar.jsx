import { cn } from '../../utils/helpers';

const ProgressBar = ({ value = 0, max = 100, className = '' }) => {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={cn('h-2.5 w-full overflow-hidden rounded-full bg-slate-800', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-400 transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default ProgressBar;
