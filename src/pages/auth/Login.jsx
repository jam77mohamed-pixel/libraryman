import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LogIn, Sparkles, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LibraryLogo from '../../components/common/LibraryLogo';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! Successfully logged into Athenaeum.');
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to log in. Please check credentials.');
      toast.error(err.message || 'Login failed.');
    }
  };

  // Quick fill helper for Administrator
  const fillAdminAccount = () => {
    setValue('email', 'admin@library.com');
    setValue('password', 'password123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Unique Bespoke Logo & Title */}
        <div className="flex justify-center">
          <LibraryLogo size="lg" showText={false} />
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Sign in to Athenaeum
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-500">
          Central Library Catalog & Reader Services
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-200/80 sm:px-10">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="admin@library.com"
              required
              autoComplete="email"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              error={errors.email?.message}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                icon={Lock}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                error={errors.password?.message}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={LogIn}
                isLoading={isSubmitting}
                className="w-full text-base font-semibold shadow-md shadow-indigo-100"
              >
                Sign In to Dashboard
              </Button>
            </div>
          </form>

          {/* Admin demo credential quick fill */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Admin Credentials:
              </span>
              <span className="text-[11px] text-orange-600 font-bold">1-Click Auto Fill</span>
            </div>
            <button
              type="button"
              onClick={fillAdminAccount}
              className="w-full p-3 text-left rounded-xl border border-orange-200/90 hover:border-orange-400 bg-orange-50/40 hover:bg-orange-50/80 transition-all text-xs cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="font-extrabold text-slate-900 block">Library Administrator</span>
                <span className="text-[11px] text-slate-500 block">admin@library.com • password123</span>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-white border border-orange-200 px-2.5 py-1 rounded-lg shadow-2xs">
                Fill Admin
              </span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Need an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-800">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
