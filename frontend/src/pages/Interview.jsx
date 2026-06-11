import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import TextArea from '../components/ui/TextArea';
import ProgressBar from '../components/ui/ProgressBar';
import Loader from '../components/ui/Loader';
import useInterviewStore from '../stores/interviewStore';

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentInterview, questions, responses, currentQuestionIndex,
    loading, getInterview, startInterview, submitAnswer, finishInterview,
    nextQuestion, prevQuestion,
  } = useInterviewStore();

  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    getInterview(id);
  }, [id, getInterview]);

  useEffect(() => {
    if (currentInterview?.status === 'in-progress') {
      const interval = setInterval(() => setTimer((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [currentInterview?.status]);

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, []);

  const handleStart = async () => {
    try {
      await startInterview(id);
      toast.success('Interview started!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return toast.error('Please write an answer');
    setSubmitting(true);
    try {
      const question = questions[currentQuestionIndex];
      await submitAnswer(question._id, answer);
      setAnswer('');
      toast.success('Answer submitted!');
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestion();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinish = async () => {
    try {
      await finishInterview(id);
      toast.success('Interview completed!');
      navigate(`/interview/${id}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader className="min-h-[75vh]" />;
  if (!currentInterview) return <p className="py-20 text-center text-slate-400">Interview not found.</p>;

  const currentQuestion = questions[currentQuestionIndex];
  const answeredIds = new Set(responses.map((r) => r.questionId));
  const progress = questions.length > 0 ? responses.length : 0;

  if (currentInterview.status === 'completed') {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <Badge variant="success">Completed</Badge>
            <h1 className="mt-3 text-3xl font-semibold text-white">{currentInterview.title}</h1>
            <p className="mt-1 text-slate-400">{currentInterview.role} &bull; {currentInterview.difficulty}</p>
            <div className="mt-4 flex gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-4 text-center">
                <p className="text-3xl font-bold text-sky-300">{currentInterview.score}%</p>
                <p className="text-xs text-slate-400">Overall Score</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 px-6 py-4 text-center">
                <p className="text-3xl font-bold text-white">{responses.length}/{questions.length}</p>
                <p className="text-xs text-slate-400">Answered</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="space-y-4">
          {questions.map((q, i) => {
            const resp = responses.find((r) => r.questionId === q._id);
            return (
              <Card key={q._id}>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge>{q.category}</Badge>
                    <p className="mt-2 font-medium text-white">Q{i + 1}: {q.question}</p>
                  </div>
                  {resp && <span className="text-lg font-bold text-sky-300">{resp.score}%</span>}
                </div>
                {resp && (
                  <div className="mt-4 space-y-3 border-t border-slate-800 pt-4">
                    <div>
                      <p className="text-xs text-slate-400">Your Answer</p>
                      <p className="text-sm text-slate-200">{resp.answer}</p>
                    </div>
                    {resp.aiFeedback && (
                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <p className="text-xs text-slate-400">Strengths</p>
                          <ul className="mt-1 space-y-1">
                            {resp.aiFeedback.strengths?.map((s, j) => (
                              <li key={j} className="text-xs text-emerald-300">{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Weaknesses</p>
                          <ul className="mt-1 space-y-1">
                            {resp.aiFeedback.weaknesses?.map((w, j) => (
                              <li key={j} className="text-xs text-rose-300">{w}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Improvements</p>
                          <ul className="mt-1 space-y-1">
                            {resp.aiFeedback.improvements?.map((imp, j) => (
                              <li key={j} className="text-xs text-amber-300">{imp}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </main>
    );
  }

  if (currentInterview.status === 'pending') {
    return (
      <main className="mx-auto flex min-h-[75vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-12 text-center lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="max-w-lg text-center">
            <h1 className="text-3xl font-semibold text-white">{currentInterview.title}</h1>
            <p className="mt-2 text-slate-300">{currentInterview.role} &bull; {currentInterview.difficulty} &bull; {questions.length} questions</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {currentInterview.technologies?.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
            <Button onClick={handleStart} className="mt-6 w-full">Start Interview</Button>
          </Card>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">{currentInterview.title}</h1>
          <p className="text-sm text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Clock className="h-4 w-4" /> {formatTime(timer)}
        </div>
      </div>

      <ProgressBar value={progress} max={questions.length} />

      {currentQuestion && (
        <motion.div key={currentQuestion._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Badge>{currentQuestion.category}</Badge>
              {answeredIds.has(currentQuestion._id) && <Badge variant="success">Answered</Badge>}
            </div>
            <p className="text-lg font-medium text-white">{currentQuestion.question}</p>

            <div className="mt-6">
              <TextArea
                label="Your Answer"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Button variant="ghost" onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Previous
              </Button>

              <div className="flex gap-3">
                <Button onClick={handleSubmitAnswer} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Answer'}
                </Button>
                {currentQuestionIndex === questions.length - 1 && (
                  <Button variant="secondary" onClick={handleFinish}>Finish Interview</Button>
                )}
              </div>

              <Button variant="ghost" onClick={nextQuestion} disabled={currentQuestionIndex === questions.length - 1}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </main>
  );
};

export default Interview;
