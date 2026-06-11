import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Camera, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorMessage from '../components/ui/ErrorMessage';
import useAuthStore from '../stores/authStore';

const Profile = () => {
  const { user, updateProfile, changePassword, uploadAvatar } = useAuthStore();
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const { register: regProfile, handleSubmit: handleProfile, formState: { errors: profileErrors } } = useForm({
    defaultValues: { fullName: user?.fullName || '', email: user?.email || '' },
  });

  const { register: regPassword, handleSubmit: handlePassword, formState: { errors: passwordErrors }, reset: resetPassword } = useForm();

  const onProfileSubmit = async (values) => {
    setProfileError('');
    setSavingProfile(true);
    try {
      await updateProfile(values);
      toast.success('Profile updated!');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (values) => {
    setPasswordError('');
    if (values.newPassword !== values.confirmNewPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      toast.success('Password changed!');
      resetPassword();
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadAvatar(file);
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="text-center">
          <div className="relative mx-auto w-fit">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sky-400/10 text-sky-300">
                <User className="h-10 w-10" />
              </div>
            )}
            <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-sky-500 text-white hover:bg-sky-400">
              <Camera className="h-4 w-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">{user?.fullName}</h1>
          <p className="text-sm text-slate-400">{user?.email}</p>
        </Card>
      </motion.div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-white">Update Profile</h2>
        {profileError && <ErrorMessage message={profileError} />}
        <form onSubmit={handleProfile(onProfileSubmit)} className="mt-4 space-y-4">
          <Input label="Full Name" {...regProfile('fullName', { required: 'Name is required' })} error={profileErrors.fullName?.message} />
          <Input label="Email" type="email" {...regProfile('email', { required: 'Email is required' })} error={profileErrors.email?.message} />
          <Button type="submit" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save Changes'}</Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-white">Change Password</h2>
        {passwordError && <ErrorMessage message={passwordError} />}
        <form onSubmit={handlePassword(onPasswordSubmit)} className="mt-4 space-y-4">
          <Input label="Current Password" type="password" {...regPassword('currentPassword', { required: 'Required' })} error={passwordErrors.currentPassword?.message} />
          <Input label="New Password" type="password" {...regPassword('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} error={passwordErrors.newPassword?.message} />
          <Input label="Confirm New Password" type="password" {...regPassword('confirmNewPassword', { required: 'Required' })} error={passwordErrors.confirmNewPassword?.message} />
          <Button type="submit" variant="secondary" disabled={savingPassword}>{savingPassword ? 'Changing...' : 'Change Password'}</Button>
        </form>
      </Card>
    </main>
  );
};

export default Profile;
