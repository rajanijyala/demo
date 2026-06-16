import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { configureInterview, startInterview } from '../services/amieService';
import { useInterviewStore } from '../stores/interviewStore';

const options = {
  experienceLevel: ['fresher', 'junior', 'mid', 'senior'],
  interviewType: ['technical', 'behavioral', 'hr', 'system_design', 'mixed'],
};

const InterviewConfig = () => {
  const navigate = useNavigate();
  const { config, setConfig } = useInterviewStore();
  const [form, setForm] = useState(config);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const configured = await configureInterview(values);
      return startInterview({ templateId: configured.template._id });
    },
    onSuccess: (result) => {
      toast.success('Interview started');
      navigate(`/interview/session/${result.session._id}`);
    },
    onError: (error) => toast.error(error.message || 'Unable to start interview'),
  });

  const updateField = (field, value) => {
    const next = { ...form, [field]: value };
    setForm(next);
    setConfig(next);
  };

  const submit = (event) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <motion.form onSubmit={submit} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-left">
        <p className="text-sm uppercase tracking-[0.25em] text-sky-200">Interview configuration</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Create your mock interview</h1>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Input label="Role" value={form.role} onChange={(event) => updateField('role', event.target.value)} required />
          <Input label="Duration minutes" type="number" min="10" max="90" value={form.durationMinutes} onChange={(event) => updateField('durationMinutes', Number(event.target.value))} required />
          <Input label="Question count" type="number" min="3" max="10" value={form.questionCount} onChange={(event) => updateField('questionCount', Number(event.target.value))} required />
          <label className="block text-sm text-slate-200">
            <span className="mb-1.5 block text-slate-300">Experience Level</span>
            <select className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-sky-400" value={form.experienceLevel} onChange={(event) => updateField('experienceLevel', event.target.value)}>
              {options.experienceLevel.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block text-sm text-slate-200 md:col-span-2">
            <span className="mb-1.5 block text-slate-300">Interview Type</span>
            <select className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-sky-400" value={form.interviewType} onChange={(event) => updateField('interviewType', event.target.value)}>
              {options.interviewType.map((item) => <option key={item} value={item}>{item.replace('_', ' ')}</option>)}
            </select>
          </label>
        </div>

        <Button type="submit" className="mt-6" disabled={mutation.isPending}>
          <Play className="mr-2 h-4 w-4" /> {mutation.isPending ? 'Starting...' : 'Start Interview'}
        </Button>
      </motion.form>
    </main>
  );
};

export default InterviewConfig;
