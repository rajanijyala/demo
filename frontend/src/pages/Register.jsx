import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { registerUser } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const { register: saveUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (values) => {
    setError('');
    setIsSubmitting(true);
    try {
      const result = await registerUser(values);
      saveUser(result.user, result.token);
      toast.success('Account created successfully');
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
          <h1 className="text-3xl font-semibold text-white">Start with a polished onboarding flow</h1>
          <p className="text-slate-300">A simple registration form with validation, toasts, and protected access patterns.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-left">
          {error && <ErrorMessage message={error} />}
          <Input label="Full name" placeholder="Jane Doe" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
          <Input label="Email" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
          <Input label="Password" type="password" placeholder="••••••••" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} error={errors.password?.message} />
          <Input label="Confirm password" type="password" placeholder="••••••••" {...register('confirmPassword', { validate: (value) => value === watch('password') || 'Passwords do not match' })} error={errors.confirmPassword?.message} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</Button>
          <p className="text-sm text-slate-400">Already have an account? <Link to="/login" className="text-sky-300">Log in</Link></p>
        </form>
      </motion.section>
    </main>
  );
};

export default Register;
