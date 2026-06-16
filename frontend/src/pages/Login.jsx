import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { loginUser } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setError('');
    setIsSubmitting(true);
    try {
      const result = await loginUser(values);
      toast.success(result.message || 'Login OTP sent to your email');
      navigate('/verify-login-otp', { state: { email: values.email, devOtp: result.devOtp, from: location.state?.from } });
    } catch (err) {
      if (err.data?.needsEmailVerification) {
        toast.success(err.message || 'Registration OTP sent to your email');
        navigate('/verify-register-otp', { state: { email: values.email, devOtp: err.data.devOtp } });
        return;
      }

      setError(err.message || 'Unable to sign in.');
      toast.error(err.message || 'Sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-5xl items-center justify-center px-6 py-12 lg:px-8">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid w-full gap-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div className="space-y-4 text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Welcome back</p>
          <h1 className="text-3xl font-semibold text-white">Sign in with password and email OTP</h1>
          <p className="text-slate-300">Your JWT is issued only after the OTP is verified.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-left">
          {error && <ErrorMessage message={error} />}
          <Input label="Email" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
          <Input label="Password" type="password" placeholder="********" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} error={errors.password?.message} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Sending OTP...' : 'Continue'}</Button>
          <p className="text-sm text-slate-400">Need an account? <Link to="/register" className="text-sky-300">Create one</Link></p>
        </form>
      </motion.section>
    </main>
  );
};

export default Login;
