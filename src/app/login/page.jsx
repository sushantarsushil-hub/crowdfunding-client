'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Heart, LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';
import useAuth from '../../hooks/use-auth';
import Input from '../../components/forms/Input';
import Button from '../../components/ui/Button';
import Logo from '../../components/common/Logo';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';
  
  const { login, googleSignIn, refreshUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await login({ email: data.email, password: data.password });
      await refreshUser();
      router.push(from);
    } catch (err) {
      setServerError(err.message || 'Invalid credentials. Please verify your email address and password.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      await googleSignIn(credentialResponse.credential, 'supporter');
      await refreshUser();
      router.push(from);
    } catch (err) {
      setServerError('Google authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 flex flex-col items-center">
        <Logo variant="dark" size="lg" />
        <h2 className="text-xl font-extrabold text-white">Sign In to Your Account</h2>
        <p className="text-xs text-slate-400">Access your supporter dashboard, back campaigns, or manage payouts.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 space-y-6">
          
          {/* Server Error Alert Banner */}
          {serverError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="alex@example.com"
              required
              startIcon={<Mail className="w-4 h-4" />}
              {...register('email', {
                required: 'Email address is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address' },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              startIcon={<Lock className="w-4 h-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
              icon={<LogIn className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-semibold">Or continue with</span></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setServerError('Google Authentication failed.')} />
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
