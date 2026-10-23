'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { LimoWordmark } from '@/components/LimoWordmark';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Clock,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRoleParam = searchParams.get('role') as UserRole | null;

  const {
    user,
    isAuthenticated,
    role,
    activeOtpPhone,
    demoOtpCode,
    sendOtp,
    verifyOtp,
    loginWithGoogle,
  } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+1 555 111 0001');
  const [targetRole, setTargetRole] = useState<UserRole>(initialRoleParam || 'client');
  const [fullName, setFullName] = useState('Sarah Jenkins');

  // OTP inputs
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [expirySeconds, setExpirySeconds] = useState(300);
  const [cooldownSeconds, setCooldownSeconds] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Expiry timer
  useEffect(() => {
    if (step !== 'otp' || expirySeconds <= 0) return;
    const interval = setInterval(() => {
      setExpirySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, expirySeconds]);

  // Cooldown timer
  useEffect(() => {
    if (step !== 'otp' || cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, cooldownSeconds]);

  const navigateToDashboard = (userRole: UserRole) => {
    if (userRole === 'admin') router.push('/dashboard/admin');
    else if (userRole === 'freelancer') router.push('/dashboard/freelancer');
    else router.push('/dashboard/client');
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    const res = await sendOtp(phoneNumber);
    setIsSending(false);

    if (res.success) {
      setStep('otp');
      setExpirySeconds(300);
      setCooldownSeconds(60);
      // Auto-fill demo code if present for convenience
      if (res.demoOtpPreview) {
        setOtpDigits(res.demoOtpPreview.split(''));
      }
    } else {
      setError(res.error || 'Failed to send OTP. Please check the number.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setError(null);

    const res = await verifyOtp(code, targetRole, fullName);
    setIsVerifying(false);

    if (res.success && res.user) {
      navigateToDashboard(res.user.role);
    } else {
      setError(res.error || 'Invalid verification code.');
    }
  };

  const handleDigitChange = (val: string, index: number) => {
    const cleaned = val.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      // Pasted full 6-digit code
      const pasted = cleaned.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setOtpDigits(newDigits);
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    setError(null);

    // Auto-focus next input element
    if (cleaned && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleGoogleSignIn = async () => {
    const res = await loginWithGoogle(targetRole);
    if (res.success) {
      navigateToDashboard(targetRole);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-limo-cardDark border border-slate-200 dark:border-limo-borderDark p-8 sm:p-10 rounded-3xl shadow-xl">
        {/* Brand & Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <LimoWordmark size="md" />
          </div>
          <h2 className="text-2xl font-bold text-limo-navy dark:text-white">
            {step === 'phone' ? 'Sign In to LIMO' : 'Verify Mobile OTP'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {step === 'phone'
              ? 'Select your account role and verify with cryptographic Phone OTP or Google.'
              : `Enter the 6-digit code dispatched to ${activeOtpPhone || phoneNumber}`}
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: PHONE NUMBER & ROLE ONBOARDING */}
        {step === 'phone' && (
          <div className="space-y-5">
            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                I am signing in as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetRole('client')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    targetRole === 'client'
                      ? 'border-limo-blue bg-blue-50 dark:bg-blue-950/40 text-limo-blue font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Client / Hirer
                </button>
                <button
                  type="button"
                  onClick={() => setTargetRole('freelancer')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    targetRole === 'freelancer'
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-600 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Freelance Specialist
                </button>
              </div>
            </div>

            {/* OPTION A: MOBILE OTP FORM */}
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mobile Number (with Country Code) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 555 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                  />
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Demo number: <code>+1 555 111 0001</code> (Client) or <code>+1 555 222 0001</code> (Specialist)
                </span>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                <span>{isSending ? 'Dispatching OTP...' : 'Continue with Mobile OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* DIVIDER */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-limo-cardDark px-3 text-[11px] uppercase tracking-wider text-slate-400 shrink-0">
                Or
              </span>
            </div>

            {/* OPTION B: CONTINUE WITH GOOGLE */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-3 transition shadow-sm"
              >
                {/* Google SVG Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION SCREEN */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* Demo Code Inspector Toast */}
            {demoOtpCode && (
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-limo-blue" />
                  <span>Sandbox Code Preview</span>
                </div>
                <p>
                  Instant code generated: <strong className="font-mono text-sm tracking-wider text-limo-blue">{demoOtpCode}</strong>
                </p>
              </div>
            )}

            {/* 6 Digit Input Boxes */}
            <div className="flex items-center justify-center gap-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(e.target.value, idx)}
                  className="w-11 h-13 text-center text-xl font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-limo-navy dark:text-white focus:outline-none focus:ring-2 focus:ring-limo-blue"
                />
              ))}
            </div>

            {/* Timers & Resend */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Expires: {Math.floor(expirySeconds / 60)}:{(expirySeconds % 60).toString().padStart(2, '0')}</span>
              </div>

              {cooldownSeconds > 0 ? (
                <span>Resend in {cooldownSeconds}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="font-semibold text-limo-blue hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resend Fresh Code</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-limo-blue hover:bg-limo-blueHover text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-60"
            >
              <span>{isVerifying ? 'Validating...' : 'Verify & Enter Dashboard'}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setError(null);
              }}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Change Phone Number
            </button>
          </form>
        )}

        {/* Security badge footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-limo-blue" />
          <span>Single-use cryptographic challenge • Zero plaintext logging</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center text-sm text-slate-500">Loading authentication...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}
