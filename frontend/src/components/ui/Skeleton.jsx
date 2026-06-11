import { cn } from '../../utils/helpers';

const Skeleton = ({ className = '' }) => (
  <div className={cn('animate-pulse rounded-xl bg-slate-800/60', className)} />
);

export default Skeleton;
