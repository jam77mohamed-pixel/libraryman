import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { KeyRound, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LibraryLogo from '../../components/common/LibraryLogo';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await resetPassword(data.email, data.newPassword);
      setSuccessMsg('Your password has been successfully reset! You can now log in.');
      toast.success('Password updated successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to reset password.');
      toast.error(err.message || 'Reset failed.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LibraryLogo size="lg" showText={false} />
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Reset Your Password
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-500">
          Enter your registered librarian email and choose a new password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-200/80 sm:px-10">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Registered Email"
              type="email"
              icon={Mail}
              placeholder="admin@library.com"
              required
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="New Password"
              type="password"
              icon={Lock}
              placeholder="Enter at least 6 characters"
              required
              {...register('newPassword', {
                required: 'New password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              error={errors.newPassword?.message}
            />

            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              placeholder="Re-enter new password"
              required
              {...register('confirmPassword', {
                required: 'Please confirm new password',
                validate: (val) => val === newPassword || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={KeyRound}
                isLoading={isSubmitting}
                className="w-full text-base font-semibold shadow-md shadow-indigo-100"
              >
                Reset Password
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
