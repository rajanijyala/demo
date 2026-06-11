import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import useAuthStore from '../stores/authStore';
import { registerSchema } from '../validators/auth';

const Register = () => {
  const { register: signUp } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values) => {
    setError('');
    setIsSubmitting(true);
    try {
      await signUp(values);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to create account.');
      toast.error('Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-5xl items-center justify-center px-6 py-12 lg:px-8">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid w-full gap-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div className="space-y-4 text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Create account</p>
          <h1 className="text-3xl font-semibold text-white">Start your interview prep journey</h1>
          <p className="text-slate-300">Join thousands of developers who improved their interview skills with AI coaching.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-left">
          {error && <ErrorMessage message={error} />}
          <Input label="Full name" placeholder="Jane Doe" {...register('fullName')} error={errors.fullName?.message} />
          <Input label="Email" type="email" placeholder="you@example.com" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
          <Input label="Confirm password" type="password" placeholder="••••••••" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</Button>
          <p className="text-sm text-slate-400">Already have an account? <Link to="/login" className="text-sky-300">Log in</Link></p>
        </form>
      </motion.section>
    </main>
  );
};

export default Register;
