import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, BrainCircuit, FileText, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import useAuthStore from '../stores/authStore';
import useAnalyticsStore from '../stores/analyticsStore';
import { formatDate } from '../utils/helpers';

const statIcons = [BrainCircuit, BarChart3, FileText, TrendingUp];

const Dashboard = () => {
  const { user } = useAuthStore();
  const { dashboard, loading, fetchDashboard } = useAnalyticsStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !dashboard) return <Loader className="min-h-[75vh]" />;

  const stats = [
    { label: 'Total Interviews', value: dashboard?.totalInterviews || 0 },
    { label: 'Average Score', value: `${dashboard?.averageScore || 0}%` },
    { label: 'Completed', value: dashboard?.completedInterviews || 0 },
    { label: 'Improvement', value: `${dashboard?.improvementRate || 0}%` },
  ];

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 lg:px-8">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-200">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Welcome, {user?.fullName || 'there'}.</h1>
          <p className="mt-2 max-w-2xl text-slate-300">Track your interview preparation progress and keep improving.</p>
        </Card>
      </motion.section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = statIcons[i];
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card>
                <Icon className="h-5 w-5 text-sky-300" />
                <p className="mt-3 text-sm text-slate-400">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.5fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Interviews</h2>
            <Link to="/interviews"><Button variant="ghost" className="text-xs">View all</Button></Link>
          </div>
          {dashboard?.recentInterviews?.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentInterviews.map((interview) => (
                <Link
                  key={interview._id}
                  to={`/interview/${interview._id}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition hover:bg-slate-900/80"
                >
                  <div>
                    <p className="font-medium text-white">{interview.title}</p>
                    <p className="text-xs text-slate-400">{formatDate(interview.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={interview.status === 'completed' ? 'success' : interview.status === 'in-progress' ? 'warning' : 'default'}>
                      {interview.status}
                    </Badge>
                    {interview.score > 0 && <span className="text-sm font-semibold text-sky-300">{interview.score}%</span>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No interviews yet. Start your first one!</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link to="/create-interview"><Button className="w-full">New Interview</Button></Link>
            <Link to="/resume"><Button variant="secondary" className="w-full">Upload Resume</Button></Link>
            <Link to="/analytics"><Button variant="ghost" className="w-full">View Analytics</Button></Link>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default Dashboard;
