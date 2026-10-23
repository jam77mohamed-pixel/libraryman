import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserPlus, Mail, Lock, User, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import LibraryLogo from '../../components/common/LibraryLogo';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'Assistant Librarian',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      await registerUser(data.name, data.email, data.password, data.role);
      toast.success('Registration successful! Welcome to the team.');
      navigate('/', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account.');
      toast.error(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LibraryLogo size="lg" showText={false} />
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Staff Account Registration
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-500">
          Join the Athenaeum Central Library Team
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
              label="Full Name"
              icon={User}
              placeholder="e.g. Eleanor Vance"
              required
              {...register('name', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
              error={errors.name?.message}
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="staff@library.com"
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

            <Select
              label="Staff Role"
              options={[
                { value: 'Assistant Librarian', label: 'Assistant Librarian' },
                { value: 'Circulation Desk Staff', label: 'Circulation Desk Staff' },
                { value: 'Cataloger', label: 'Cataloger' },
                { value: 'Head Librarian', label: 'Head Librarian' },
              ]}
              {...register('role')}
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="At least 6 characters"
              required
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              icon={Lock}
              placeholder="Re-enter password"
              required
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === password || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={UserPlus}
                isLoading={isSubmitting}
                className="w-full text-base font-semibold shadow-md shadow-indigo-100"
              >
                Register & Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-800">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
