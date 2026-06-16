import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import { verifyLoginOtp } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const VerifyLoginOtp = () => {
  const { setAuthSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: location.state?.email || '',
      otp: '',
    },
  });

  const onSubmit = async (values) => {
    setError('');
    setIsSubmitting(true);
    try {
      const result = await verifyLoginOtp(values);
      setAuthSession(result.user, result.token);
      toast.success(result.message || 'Logged in successfully');
      navigate(location.state?.from?.pathname || '/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to verify OTP.');
      toast.error('OTP verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[75vh] max-w-4xl items-center justify-center px-6 py-12 lg:px-8">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30 lg:p-10">
        <div className="mb-6 text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Login OTP</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Finish signing in</h1>
          <p className="mt-2 text-slate-300">Your JWT will be saved after this OTP is verified.</p>
        </div>

        {location.state?.devOtp && (
          <div className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-left text-amber-100">
            Development OTP: <span className="font-semibold tracking-[0.25em]">{location.state.devOtp}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          {error && <ErrorMessage message={error} />}
          <Input label="Email" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
          <Input label="OTP" inputMode="numeric" maxLength="6" placeholder="123456" {...register('otp', { required: 'OTP is required', minLength: { value: 6, message: 'OTP must be 6 digits' } })} error={errors.otp?.message} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Verifying...' : 'Verify login'}</Button>
          <p className="text-sm text-slate-400">Need a new OTP? <Link to="/login" className="text-sky-300">Log in again</Link></p>
        </form>
      </motion.section>
    </main>
  );
};

export default VerifyLoginOtp;
