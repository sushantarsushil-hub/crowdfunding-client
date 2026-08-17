'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { User, Mail, Lock, Heart, UserPlus, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import useAuth from '../../hooks/use-auth';
import Input from '../../components/forms/Input';
import Button from '../../components/ui/Button';
import ImageUploader from '../../components/common/ImageUploader';
import evaluatePasswordStrength from '../../utils/password-strength';
import Logo from '../../components/common/Logo';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  const { register: registerAuth, googleSignIn, refreshUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: 'supporter',
      photoUrl: '',
    },
  });

  const selectedRole = watch('role');
  const photoUrl = watch('photoUrl');
  const passwordValue = watch('password', '');
  const passwordStrength = evaluatePasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    setServerError('');
    
    // Strict Guard: Never allow public registration as Admin
    if (data.role === 'admin') {
      setServerError('Administrative roles cannot be registered publicly.');
      return;
    }

    try {
      await registerAuth({
        name: data.name,
        email: data.email,
        photoUrl: data.photoUrl,
        password: data.password,
        role: data.role,
      });
      await refreshUser();
      router.push(from);
    } catch (err) {
      setServerError(err.message || 'Registration failed. Email address may already be registered.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse.credential) return;
    try {
      await googleSignIn(credentialResponse.credential, selectedRole || 'supporter');
      await refreshUser();
      router.push(from);
    } catch (err) {
      setServerError('Google registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 flex flex-col items-center">
        <Logo variant="dark" size="lg" />
        <h2 className="text-xl font-extrabold text-white">Create Your Account</h2>
        <p className="text-xs text-slate-400">Join FundFlow to back causes or launch social initiatives.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 space-y-6">
          
          {/* Server Validation Error Banner */}
          {serverError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Account Role Selector (Supporter vs Creator ONLY — Admin strictly prohibited) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Account Role *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setValue('role', 'supporter')}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                    selectedRole === 'supporter'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Supporter (+50 Cr)
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'creator')}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                    selectedRole === 'creator'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Creator (+20 Cr)
                </button>
              </div>
            </div>

            <Input
              label="Full Name"
              placeholder="Alex Morgan"
              required
              startIcon={<User className="w-4 h-4" />}
              {...register('name', { required: 'Full name is required' })}
              error={errors.name?.message}
            />

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

            {/* ImgBB Image Uploader with Preview */}
            <ImageUploader
              label="Profile Picture (ImgBB)"
              value={photoUrl}
              onChange={(url) => setValue('photoUrl', url)}
            />

            {/* Password Field with Visibility Toggle */}
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
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                },
              })}
              error={errors.password?.message}
            />

            {/* Password Strength Indicator Meter */}
            {passwordValue && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-500">Password Strength</span>
                  <span className={passwordStrength.score >= 3 ? 'text-emerald-600' : 'text-rose-500'}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${passwordStrength.percentage}%` }}
                  />
                </div>
              </div>
            )}

            {/* Confirm Password Field */}
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              required
              startIcon={<Lock className="w-4 h-4" />}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (val) => val === passwordValue || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
              icon={<UserPlus className="w-4 h-4" />}
            >
              Register & Claim Bonus Credits
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-semibold">Or continue with</span></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setServerError('Google Registration failed.')} />
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
