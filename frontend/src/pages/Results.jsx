import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { getInterview } from '../services/amieService';

const Results = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['results', id], queryFn: () => getInterview(id) });

  if (isLoading) {
    return <Loader label="Loading results..." />;
  }

  const evaluation = data?.evaluation;
  const feedback = data?.feedback;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Results</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">{evaluation?.totalScore || 0}%</h1>
        <p className="mt-2 text-slate-300">{feedback?.interviewSummary || 'Evaluation is being prepared.'}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {evaluation?.scores && Object.entries(evaluation.scores).map(([key, value]) => (
            <article key={key} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm capitalize text-slate-400">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{value}%</p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/feedback/${id}`}><Button>Feedback Report</Button></Link>
          <Link to={`/practice-plan/${id}`}><Button variant="secondary">Practice Plan</Button></Link>
          <Link to="/analytics"><Button variant="secondary">Analytics</Button></Link>
        </div>
      </section>
    </main>
  );
};

export default Results;
