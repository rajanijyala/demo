import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import useInterviewStore from '../stores/interviewStore';
import { formatDate } from '../utils/helpers';

const Interviews = () => {
  const { interviews, loading, getUserInterviews } = useInterviewStore();

  useEffect(() => {
    getUserInterviews();
  }, [getUserInterviews]);

  if (loading && interviews.length === 0) return <Loader className="min-h-[75vh]" />;

  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-200">Interviews</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Your Interviews</h1>
        </div>
        <Link to="/create-interview">
          <Button><Plus className="mr-2 h-4 w-4" /> New Interview</Button>
        </Link>
      </div>

      {interviews.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview, i) => (
            <motion.div key={interview._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link to={`/interview/${interview._id}`}>
                <Card className="h-full transition hover:border-sky-400/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{interview.title}</h3>
                      <p className="mt-1 text-xs text-slate-400">{interview.role} &bull; {interview.difficulty}</p>
                    </div>
                    <Badge variant={interview.status === 'completed' ? 'success' : interview.status === 'in-progress' ? 'warning' : 'default'}>
                      {interview.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {interview.technologies?.slice(0, 4).map((tech) => (
                      <span key={tech} className="rounded-lg bg-slate-800 px-2 py-0.5 text-xs text-slate-300">{tech}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>{formatDate(interview.createdAt)}</span>
                    {interview.score > 0 && <span className="font-semibold text-sky-300">{interview.score}%</span>}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <p className="text-slate-400">No interviews yet. Create your first one to get started!</p>
          <Link to="/create-interview" className="mt-4 inline-block">
            <Button>Create Interview</Button>
          </Link>
        </Card>
      )}
    </main>
  );
};

export default Interviews;
