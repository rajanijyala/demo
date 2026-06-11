import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import AuthFormLayout from '../components/layout/AuthFormLayout';
import { registerUser } from '../services/authService';
import { useAuthForm } from '../hooks/useAuthForm';

const Register = () => {
  const { register, handleSubmit, formState: { errors }, watch, error, isSubmitting, onSubmit } = useAuthForm({
    authFn: registerUser,
    saveKey: 'register',
    successMsg: 'Account created successfully',
    errorMsg: 'Registration failed.',
  });

  return (
    <AuthFormLayout
      subtitle="Create account"
      heading="Start with a polished onboarding flow"
      description="A simple registration form with validation, toasts, and protected access patterns."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-left">
        {error && <ErrorMessage message={error} />}
        <Input label="Full name" placeholder="Jane Doe" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
        <Input label="Email" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
        <Input label="Password" type="password" placeholder="••••••••" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} error={errors.password?.message} />
        <Input label="Confirm password" type="password" placeholder="••••••••" {...register('confirmPassword', { validate: (value) => value === watch('password') || 'Passwords do not match' })} error={errors.confirmPassword?.message} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</Button>
        <p className="text-sm text-slate-400">Already have an account? <Link to="/login" className="text-sky-300">Log in</Link></p>
      </form>
    </AuthFormLayout>
  );
};

export default Register;
