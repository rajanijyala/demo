import { useQuery } from '@tanstack/react-query';
import Loader from '../components/ui/Loader';
import { getNotifications } from '../services/amieService';

const Notifications = () => {
  const { data, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: getNotifications });

  if (isLoading) {
    return <Loader label="Loading notifications..." />;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Notifications</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Activity</h1>
        <div className="mt-6 space-y-3">
          {(data?.notifications || []).map((item) => (
            <article key={item._id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <h2 className="font-semibold text-white">{item.title}</h2>
              <p className="mt-1 text-slate-300">{item.message}</p>
            </article>
          ))}
          {!data?.notifications?.length && <p className="text-slate-300">No notifications yet.</p>}
        </div>
      </section>
    </main>
  );
};

export default Notifications;
