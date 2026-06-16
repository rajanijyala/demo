import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import { getInterview, getInterviewHistory } from '../services/amieService';

const PracticePlan = () => {
  const { id } = useParams();
  const historyQuery = useQuery({ queryKey: ['practice-history'], queryFn: getInterviewHistory, enabled: id === 'latest' });
  const latestId = historyQuery.data?.history?.find((item) => item.status === 'evaluated')?._id;
  const sessionId = id === 'latest' ? latestId : id;
  const { data, isLoading } = useQuery({ queryKey: ['practice-plan', sessionId], queryFn: () => getInterview(sessionId), enabled: Boolean(sessionId) });
  const tasks = data?.practicePlan || [];

  if (isLoading || historyQuery.isLoading) {
    return <Loader label="Loading practice plan..." />;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Seven-day practice plan</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Practice Tasks</h1>
        <div className="mt-6 grid gap-4">
          {tasks.length ? tasks.map((task) => (
            <article key={task._id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-sm text-sky-300">Day {task.day}</p>
              <h2 className="mt-1 font-semibold text-white">{task.title}</h2>
              <p className="mt-2 text-slate-300">{task.description}</p>
            </article>
          )) : <p className="text-slate-300">Complete an interview to generate a practice plan.</p>}
        </div>
      </section>
    </main>
  );
};

export default PracticePlan;
