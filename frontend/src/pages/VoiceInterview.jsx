import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Loader from '../components/ui/Loader';
import useInterviewStore from '../stores/interviewStore';

const VoiceInterview = () => {
  const { id } = useParams();
  const {
    currentInterview, questions, responses, currentQuestionIndex,
    loading, getInterview, startInterview, submitAnswer, finishInterview, nextQuestion,
  } = useInterviewStore();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    getInterview(id);
  }, [id, getInterview]);

  const startRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      toast.error(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => setIsRecording(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
    toast.success('Recording started');
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  const handleStart = async () => {
    try {
      await startInterview(id);
      toast.success('Voice interview started!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmitVoiceAnswer = async () => {
    if (!transcript.trim()) return toast.error('No transcript to submit');
    setSubmitting(true);
    try {
      const question = questions[currentQuestionIndex];
      await submitAnswer(question._id, transcript);
      setTranscript('');
      toast.success('Answer submitted!');
      if (currentQuestionIndex < questions.length - 1) nextQuestion();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader className="min-h-[75vh]" />;
  if (!currentInterview) return <p className="py-20 text-center text-slate-400">Interview not found.</p>;

  if (currentInterview.status === 'pending') {
    return (
      <main className="mx-auto flex min-h-[75vh] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-12 text-center lg:px-8">
        <Card className="max-w-lg text-center">
          <Volume2 className="mx-auto h-12 w-12 text-sky-300" />
          <h1 className="mt-4 text-3xl font-semibold text-white">Voice Interview</h1>
          <p className="mt-2 text-slate-300">{currentInterview.title} &bull; {questions.length} questions</p>
          <p className="mt-2 text-sm text-slate-400">Speak your answers aloud. Your speech will be transcribed and evaluated by AI.</p>
          <Button onClick={handleStart} className="mt-6 w-full">Start Voice Interview</Button>
        </Card>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = responses.length;

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-12 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Voice Interview</h1>
        <Badge>Q{currentQuestionIndex + 1}/{questions.length}</Badge>
      </div>

      <ProgressBar value={progress} max={questions.length} />

      {currentQuestion && (
        <motion.div key={currentQuestion._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <Badge className="mb-3">{currentQuestion.category}</Badge>
            <p className="text-lg font-medium text-white">{currentQuestion.question}</p>

            <div className="mt-6 flex flex-col items-center gap-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex h-20 w-20 items-center justify-center rounded-full transition ${
                  isRecording
                    ? 'animate-pulse bg-rose-500/20 text-rose-400 ring-4 ring-rose-500/30'
                    : 'bg-sky-400/10 text-sky-300 hover:bg-sky-400/20'
                }`}
              >
                {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </button>
              <p className="text-sm text-slate-400">{isRecording ? 'Listening... click to stop' : 'Click to start recording'}</p>
            </div>

            {transcript && (
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <p className="text-xs text-slate-400 mb-2">Transcript</p>
                <p className="text-sm text-slate-200">{transcript}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <Button onClick={handleSubmitVoiceAnswer} disabled={submitting || !transcript.trim()} className="flex-1">
                {submitting ? 'Submitting...' : 'Submit Answer'}
              </Button>
              {currentQuestionIndex === questions.length - 1 && (
                <Button variant="secondary" onClick={() => finishInterview(id)}>Finish</Button>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </main>
  );
};

export default VoiceInterview;
