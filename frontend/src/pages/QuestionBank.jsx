import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { generateQuestions, getQuestions } from '../services/amieService';
import { useInterviewStore } from '../stores/interviewStore';

const QuestionBank = () => {
  const queryClient = useQueryClient();
  const { config } = useInterviewStore();
  const [preview, setPreview] = useState([]);
  const { data, isLoading } = useQuery({ queryKey: ['questions'], queryFn: getQuestions });
  const mutation = useMutation({
    mutationFn: () => generateQuestions(config),
    onSuccess: (result) => {
      setPreview(result.questions || []);
      toast.success('Question preview generated');
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error) => toast.error(error.message || 'Unable to generate questions'),
  });

  if (isLoading) {
    return <Loader label="Loading question bank..." />;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Question bank</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Generated Questions</h1>
          </div>
          <Button type="button" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Generating...' : 'Generate Preview'}
          </Button>
        </div>
        <div className="mt-6 grid gap-4">
          {preview.map((question) => (
            <article key={`${question.order}-${question.prompt}`} className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-sky-200">Preview</p>
              <p className="mt-2 text-white">{question.prompt}</p>
              <p className="mt-2 text-sm capitalize text-slate-300">{question.interviewType?.replace('_', ' ')} · {question.difficulty}</p>
            </article>
          ))}
          {(data?.questions || []).map((question) => (
            <article key={question._id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="text-white">{question.prompt}</p>
              <p className="mt-2 text-sm capitalize text-slate-400">{question.interviewType?.replace('_', ' ')} · {question.difficulty}</p>
            </article>
          ))}
          {!preview.length && !data?.questions?.length && <p className="text-slate-300">Generated session questions will appear here.</p>}
        </div>
      </section>
    </main>
  );
};

export default QuestionBank;
