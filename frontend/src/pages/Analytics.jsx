import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import useAnalyticsStore from '../stores/analyticsStore';

const Analytics = () => {
  const { dashboard, loading, fetchDashboard } = useAnalyticsStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading && !dashboard) return <Loader className="min-h-[75vh]" />;

  const scoreHistory = (dashboard?.scoreHistory || []).map((h, i) => ({
    name: `#${i + 1}`,
    score: h.score,
  }));

  const topicData = (dashboard?.topicScores || []).map((t) => ({
    name: t.topic,
    score: t.averageScore,
    attempts: t.attempts,
  }));

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-200">Analytics</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Performance Insights</h1>
          <p className="mt-2 text-slate-300">Understand your strengths, weaknesses, and track improvement over time.</p>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-white">Score Trend</h2>
          {scoreHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={2} dot={{ fill: '#38bdf8' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">Complete interviews to see your score trend.</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-white">Topic Performance</h2>
          {topicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="score" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">Complete interviews to see topic performance.</p>
          )}
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold text-white">Strongest Topics</h2>
          <div className="flex flex-wrap gap-2">
            {dashboard?.strongestTopics?.length > 0 ? (
              dashboard.strongestTopics.map((topic) => (
                <Badge key={topic} variant="success">{topic}</Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400">Not enough data yet.</p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-semibold text-white">Weakest Topics</h2>
          <div className="flex flex-wrap gap-2">
            {dashboard?.weakestTopics?.length > 0 ? (
              dashboard.weakestTopics.map((topic) => (
                <Badge key={topic} variant="danger">{topic}</Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400">Not enough data yet.</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-white">Interview History</h2>
        {dashboard?.recentInterviews?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 pr-4">Interview</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Score</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {dashboard.recentInterviews.map((interview) => (
                  <tr key={interview._id} className="border-b border-slate-800/50">
                    <td className="py-3 pr-4">{interview.title}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={interview.status === 'completed' ? 'success' : 'warning'}>
                        {interview.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 font-semibold text-sky-300">{interview.score}%</td>
                    <td className="py-3 text-slate-400">{new Date(interview.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-slate-400">No interview history yet.</p>
        )}
      </Card>
    </main>
  );
};

export default Analytics;
