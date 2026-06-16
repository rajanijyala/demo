import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Upload } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import Input from '../components/ui/Input';
import { startResumeInterview } from '../services/amieService';

const ResumeInterview = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({
    role: 'Resume Based Interview',
    experienceLevel: 'fresher',
    durationMinutes: 30,
    questionCount: 8,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const payload = new FormData();
      payload.append('resume', file);
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      return startResumeInterview(payload);
    },
    onSuccess: (result) => {
      toast.success('Resume interview generated');
      navigate(`/interview/session/${result.session._id}`);
    },
    onError: (error) => toast.error(error.message || 'Unable to generate resume interview'),
  });

  const submit = (event) => {
    event.preventDefault();

    if (!file) {
      toast.error('Please upload a PDF or DOCX resume.');
      return;
    }

    mutation.mutate();
  };

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Resume interview</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Generate questions from your resume</h1>

        <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 px-6 py-10 text-center transition hover:border-sky-400">
          <Upload className="h-8 w-8 text-sky-300" />
          <span className="mt-3 font-semibold text-white">{file ? file.name : 'Upload PDF or DOCX resume'}</span>
          <span className="mt-1 text-sm text-slate-400">Maximum file size 5 MB</span>
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="sr-only"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </label>

        {mutation.error && <div className="mt-4"><ErrorMessage message={mutation.error.message} /></div>}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Input label="Target role" value={form.role} onChange={(event) => updateField('role', event.target.value)} required />
          <label className="block text-sm text-slate-200">
            <span className="mb-1.5 block text-slate-300">Experience Level</span>
            <select className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-sky-400" value={form.experienceLevel} onChange={(event) => updateField('experienceLevel', event.target.value)}>
              {['fresher', 'junior', 'mid', 'senior'].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <Input label="Duration minutes" type="number" min="10" max="90" value={form.durationMinutes} onChange={(event) => updateField('durationMinutes', Number(event.target.value))} required />
          <Input label="Question count" type="number" min="4" max="12" value={form.questionCount} onChange={(event) => updateField('questionCount', Number(event.target.value))} required />
        </div>

        <Button type="submit" className="mt-6" disabled={mutation.isPending}>
          <FileText className="mr-2 h-4 w-4" /> {mutation.isPending ? 'Parsing resume...' : 'Start Resume Interview'}
        </Button>
      </motion.form>
    </main>
  );
};

export default ResumeInterview;
