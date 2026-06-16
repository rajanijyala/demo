import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, CheckCircle2, Clock, FileText, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { getDashboard, getInterviewHistory } from '../services/amieService';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });
  const { data: historyData } = useQuery({ queryKey: ['interview-history'], queryFn: getInterviewHistory });
  const dashboard = data?.dashboard;
  const history = historyData?.history || [];

  if (isLoading) {
    return <Loader label="Loading dashboard..." />;
  }

  const stats = [
    { label: 'Total Interviews', value: dashboard?.totalInterviews || 0, icon: Clock },
    { label: 'Average Score', value: `${dashboard?.averageScore || 0}%`, icon: BarChart3 },
    { label: 'Best Score', value: `${dashboard?.bestScore || 0}%`, icon: Trophy },
    { label: 'Completion Rate', value: `${dashboard?.completionRate || 0}%`, icon: CheckCircle2 },
  ];

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="text-left">
          <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Candidate dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Welcome, {user?.name || 'candidate'}.</h1>
          <p className="mt-2 max-w-2xl text-slate-300">Your interview history, scoring trend, feedback, and practice plan are connected to MongoDB.</p>
        </div>
        <div className="flex items-center justify-start gap-3 lg:justify-end">
          <Link to="/interview/configure">
            <Button><ArrowRight className="mr-2 h-4 w-4" /> Start Interview</Button>
          </Link>
          <Link to="/interview/resume">
            <Button variant="secondary"><FileText className="mr-2 h-4 w-4" /> Resume Interview</Button>
          </Link>
          <Link to="/analytics">
            <Button variant="secondary">Analytics</Button>
          </Link>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-left">
            <item.icon className="h-5 w-5 text-sky-300" />
            <p className="mt-3 text-sm text-slate-400">{item.label}</p>
            <p className="text-2xl font-semibold text-white">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left">
          <h2 className="text-xl font-semibold text-white">Recent Interviews</h2>
          <div className="mt-4 space-y-3">
            {history.length ? history.slice(0, 5).map((session) => (
              <Link key={session._id} to={`/results/${session._id}`} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-sky-500/60">
                <div>
                  <p className="font-semibold text-white">{session.role}</p>
                  <p className="text-sm capitalize text-slate-400">{session.interviewType.replace('_', ' ')} · {session.experienceLevel}</p>
                </div>
                <span className="text-sm text-sky-300">{session.totalScore ?? 'In progress'}</span>
              </Link>
            )) : <p className="text-slate-400">No interviews yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left">
          <h2 className="text-xl font-semibold text-white">Practice Consistency</h2>
          <p className="mt-4 text-5xl font-semibold text-white">{dashboard?.practiceConsistency || 0}%</p>
          <p className="mt-2 text-slate-300">Completed practice tasks from generated plans.</p>
          <Link to="/practice-plan/latest" className="mt-5 inline-block">
            <Button variant="secondary">Open Practice Plans</Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
