import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';
import ErrorMessage from '../components/ui/ErrorMessage';
import useInterviewStore from '../stores/interviewStore';
import { createInterviewSchema } from '../validators/interview';

const experienceLevels = [
  { value: 'junior', label: 'Junior (0-2 years)' },
  { value: 'mid', label: 'Mid-level (2-5 years)' },
  { value: 'senior', label: 'Senior (5-8 years)' },
  { value: 'lead', label: 'Lead (8+ years)' },
];

const difficulties = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const CreateInterview = () => {
  const { generateInterview } = useInterviewStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createInterviewSchema),
    defaultValues: { experienceLevel: 'mid', difficulty: 'medium' },
  });

  const onSubmit = async (values) => {
    setError('');
    setIsSubmitting(true);
    try {
      const technologies = values.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      const result = await generateInterview({ ...values, technologies });
      toast.success('Interview generated!');
      navigate(`/interview/${result.interview._id}`);
    } catch (err) {
      setError(err.message || 'Failed to generate interview.');
      toast.error('Generation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-3xl flex-col gap-8 px-6 py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-200">New Interview</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Create your interview</h1>
          <p className="mt-2 text-slate-300">Customize your interview by selecting the role, experience, and technologies.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {error && <ErrorMessage message={error} />}
            <Input label="Job Role" placeholder="e.g. Frontend Developer" {...register('role')} error={errors.role?.message} />
            <Select label="Experience Level" options={experienceLevels} {...register('experienceLevel')} error={errors.experienceLevel?.message} />
            <Select label="Difficulty" options={difficulties} {...register('difficulty')} error={errors.difficulty?.message} />
            <Input label="Technologies (comma-separated)" placeholder="React, JavaScript, HTML, CSS" {...register('technologies')} error={errors.technologies?.message} />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Generating questions...' : 'Generate Interview'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </main>
  );
};

export default CreateInterview;
