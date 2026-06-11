import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from './useAuth';

export const useAuthForm = ({ authFn, saveKey, successMsg, errorMsg }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm();

  const onSubmit = async (values) => {
    setError('');
    setIsSubmitting(true);
    try {
      const result = await authFn(values);
      auth[saveKey](result.user, result.token);
      toast.success(successMsg);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { ...form, error, isSubmitting, onSubmit };
};
