import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { getInterview, saveInterviewResponse, submitInterview } from '../services/amieService';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery({ queryKey: ['interview', id], queryFn: () => getInterview(id) });
  const session = data?.session;
  const questions = session?.questions || [];
  const responseAnswers = useMemo(() => Object.fromEntries((data?.responses || []).map((item) => [item.question, item.answer])), [data?.responses]);
  const [manualIndex, setManualIndex] = useState(null);
  const [answers, setAnswers] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const index = manualIndex ?? session?.currentQuestionIndex ?? 0;

  useEffect(() => {
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const current = questions[index];
  const progress = questions.length ? Math.round(((index + 1) / questions.length) * 100) : 0;
  const mergedAnswers = useMemo(() => ({ ...responseAnswers, ...answers }), [answers, responseAnswers]);
  const answerList = useMemo(() => Object.entries(mergedAnswers).map(([questionId, answer]) => ({ questionId, answer, timeSpentSeconds: elapsed })), [mergedAnswers, elapsed]);

  const { mutate: saveAnswer } = useMutation({
    mutationFn: ({ questionId, answer, currentQuestionIndex }) => saveInterviewResponse(id, { questionId, answer, currentQuestionIndex, timeSpentSeconds: elapsed }),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitInterview({ sessionId: id, responses: answerList }),
    onSuccess: () => {
      toast.success('Interview submitted');
      navigate(`/results/${id}`);
    },
    onError: (error) => toast.error(error.message || 'Unable to submit interview'),
  });

  useEffect(() => {
    if (!current || answers[current._id] === undefined) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      saveAnswer({ questionId: current._id, answer: answers[current._id], currentQuestionIndex: index });
    }, 700);

    return () => clearTimeout(timeout);
  }, [answers, current, index, saveAnswer]);

  if (isLoading) {
    return <Loader label="Loading interview..." />;
  }

  if (!session || !current) {
    return <main className="px-6 py-10 text-center text-slate-300">Interview not found.</main>;
  }

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const seconds = String(elapsed % 60).padStart(2, '0');

  const move = (nextIndex) => {
    if (current) {
      saveAnswer({ questionId: current._id, answer: mergedAnswers[current._id] || '', currentQuestionIndex: nextIndex }, { onSuccess: () => refetch() });
    }
    setManualIndex(nextIndex);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8 lg:px-8">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-200">{session.role}</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Question {index + 1} of {questions.length}</h1>
          </div>
          <div className="rounded-xl border border-slate-700 px-4 py-2 font-mono text-lg text-white">{minutes}:{seconds}</div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-sky-400 transition-all" style={{ width: `${progress}%` }} />
        </div>

        <article className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
          <p className="text-lg leading-8 text-white">{current.prompt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {current.skillTags?.map((tag) => <span key={tag} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{tag}</span>)}
          </div>
        </article>

        <textarea
          className="mt-5 min-h-64 w-full rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-slate-100 outline-none focus:border-sky-400"
          value={mergedAnswers[current._id] || ''}
          onChange={(event) => setAnswers((value) => ({ ...value, [current._id]: event.target.value }))}
          placeholder="Type your answer here..."
        />

        <div className="mt-5 flex flex-wrap justify-between gap-3">
          <Button type="button" variant="secondary" disabled={index === 0} onClick={() => move(index - 1)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" disabled={index === questions.length - 1} onClick={() => move(index + 1)}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button type="button" onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}>
              <Send className="mr-2 h-4 w-4" /> {submitMutation.isPending ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default InterviewSession;
