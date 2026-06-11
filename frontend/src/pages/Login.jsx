import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import AuthFormLayout from '../components/layout/AuthFormLayout';
import { loginUser } from '../services/authService';
import { useAuthForm } from '../hooks/useAuthForm';

const Login = () => {
  const { register, handleSubmit, formState: { errors }, error, isSubmitting, onSubmit } = useAuthForm({
    authFn: loginUser,
    saveKey: 'login',
    successMsg: 'Welcome back!',
    errorMsg: 'Sign in failed.',
  });

  return (
    <AuthFormLayout
      subtitle="Welcome back"
      heading="Sign in to your workspace"
      description="Use the demo account flow to see the protected dashboard experience."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 text-left">
        {error && <ErrorMessage message={error} />}
        <Input label="Email" type="email" placeholder="you@example.com" {...register('email', { required: 'Email is required' })} error={errors.email?.message} />
        <Input label="Password" type="password" placeholder="••••••••" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} error={errors.password?.message} />
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Continue'}</Button>
        <p className="text-sm text-slate-400">Need an account? <Link to="/register" className="text-sky-300">Create one</Link></p>
      </form>
    </AuthFormLayout>
  );
};

export default Login;
