import { useQuery } from '@tanstack/react-query';
import { BarChart3 } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Loader from '../components/ui/Loader';
import { getDashboard } from '../services/amieService';

const AnalyticsDashboard = () => {
  const { data, isLoading } = useQuery({ queryKey: ['analytics'], queryFn: getDashboard });
  const dashboard = data?.dashboard;
  const trend = dashboard?.improvementTrend || [];

  if (isLoading) {
    return <Loader label="Loading analytics..." />;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-sky-300" />
          <h1 className="text-3xl font-semibold text-white">Analytics Dashboard</h1>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {[
            ['Total Interviews', dashboard?.totalInterviews || 0],
            ['Average Score', `${dashboard?.averageScore || 0}%`],
            ['Best Score', `${dashboard?.bestScore || 0}%`],
            ['Practice Consistency', `${dashboard?.practiceConsistency || 0}%`],
            ['Completion Rate', `${dashboard?.completionRate || 0}%`],
          ].map(([label, value]) => (
            <article key={label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 h-80 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          {trend.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid stroke="#1f2937" />
                <XAxis dataKey="label" stroke="#94a3b8" />
                <YAxis domain={[0, 100]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#020617', border: '1px solid #1e293b', color: '#fff' }} />
                <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="p-6 text-slate-300">Submit interviews to build a score trend.</p>}
        </div>
      </section>
    </main>
  );
};

export default AnalyticsDashboard;
