import { useQuery } from '@tanstack/react-query';
import Loader from '../components/ui/Loader';
import { getInterviewTemplates, getQuestions } from '../services/amieService';
import { useAuth } from '../hooks/useAuth';

const AdminConsole = () => {
  const { user } = useAuth();
  const templatesQuery = useQuery({ queryKey: ['admin-templates'], queryFn: getInterviewTemplates });
  const questionsQuery = useQuery({ queryKey: ['admin-questions'], queryFn: getQuestions });

  if (templatesQuery.isLoading || questionsQuery.isLoading) {
    return <Loader label="Loading admin console..." />;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Admin console</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Content Operations</h1>
        <p className="mt-2 text-slate-300">Signed in as {user?.role || 'candidate'}.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Templates</p>
            <p className="mt-2 text-3xl font-semibold text-white">{templatesQuery.data?.templates?.length || 0}</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Questions</p>
            <p className="mt-2 text-3xl font-semibold text-white">{questionsQuery.data?.questions?.length || 0}</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default AdminConsole;
