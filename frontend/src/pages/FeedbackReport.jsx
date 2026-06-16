import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import { getInterview } from '../services/amieService';

const FeedbackReport = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['feedback', id], queryFn: () => getInterview(id) });
  const feedback = data?.feedback;
  const evaluation = data?.evaluation;
  const resumeMatchAnalysis = feedback?.resumeMatchAnalysis;

  if (isLoading) {
    return <Loader label="Loading feedback..." />;
  }

  const groups = [
    ['Strengths', feedback?.strengths],
    ['Weaknesses', feedback?.weaknesses],
    ['Recommended Topics', feedback?.recommendedTopics],
    ['Improvement Suggestions', feedback?.improvementSuggestions],
  ];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Feedback report</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Interview Summary</h1>
        <p className="mt-3 text-slate-300">{feedback?.interviewSummary}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="text-sm text-slate-400">Technical Score</h2>
            <p className="mt-2 text-3xl font-semibold text-white">{evaluation?.scores?.technicalAccuracy ?? 0}%</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="text-sm text-slate-400">Communication Score</h2>
            <p className="mt-2 text-3xl font-semibold text-white">{evaluation?.scores?.communication ?? 0}%</p>
          </article>
          <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="text-sm text-slate-400">Overall Score</h2>
            <p className="mt-2 text-3xl font-semibold text-white">{evaluation?.totalScore ?? 0}%</p>
          </article>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {groups.map(([title, items]) => (
            <article key={title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <h2 className="font-semibold text-white">{title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {(items || []).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
        {resumeMatchAnalysis && (
          <article className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="font-semibold text-white">Resume Match Analysis</h2>
            <p className="mt-3 text-slate-300">{resumeMatchAnalysis.summary}</p>
            <p className="mt-3 text-sm text-slate-400">Match score: <span className="font-semibold text-sky-300">{resumeMatchAnalysis.score}%</span></p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(resumeMatchAnalysis.matchedSkills || []).map((skill) => <span key={skill} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{skill}</span>)}
            </div>
          </article>
        )}
      </section>
    </main>
  );
};

export default FeedbackReport;
