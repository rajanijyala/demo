import { forwardRef } from 'react';
import { cn } from '../../utils/helpers';

const TextArea = forwardRef(({ label, error, className = '', ...props }, ref) => (
  <label className="block text-left text-sm text-slate-200">
    {label && <span className="mb-1.5 block text-slate-300">{label}</span>}
    <textarea
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 shadow-inner shadow-black/20 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30 min-h-[120px] resize-y',
        error && 'border-rose-500 focus:border-rose-400 focus:ring-rose-400/30',
        className,
      )}
      {...props}
    />
    {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
  </label>
));

TextArea.displayName = 'TextArea';
export default TextArea;
