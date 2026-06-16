import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { sendOTP, register: signup } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP Verification
  const [sendingOtp, setSendingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      otp: '',
    },
  });

  const emailValue = watch('email');
  const nameValue = watch('name');
  const passwordValue = watch('password');

  // Step 1: Submit details and send OTP
  const handleSendOtp = async () => {
    if (!nameValue || !emailValue || !passwordValue) {
      toast.error('Please enter name, email, and password first.');
      return;
    }
    setSendingOtp(true);
    try {
      await sendOTP(emailValue);
      toast.success(`Verification code sent to ${emailValue}`);
      setStep(2);
    } catch (err) {
      toast.error(err || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  // Step 2: Final Submit with OTP
  const onSubmit = async (data) => {
    try {
      await signup(data.name, data.email, data.password, data.otp);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative overflow-hidden">
        {/* Logo and Greeting */}
        <div className="flex flex-col items-center space-y-2 mb-6 text-center">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {step === 1 ? 'Create Account' : 'Verify Email'}
          </h2>
          <p className="text-slate-500 text-xs font-semibold">
            {step === 1 
              ? 'Join Expense Tracker to track, analyze, and manage expenses'
              : `Enter the 6-digit code sent to ${emailValue}`}
          </p>
        </div>

        {step === 1 ? (
          /* Step 1 Form */
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1.5">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1.5">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
              />
              {errors.password && <p className="text-xs text-rose-500 mt-1.5">{errors.password.message}</p>}
            </div>

            {/* OTP Trigger Button */}
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className="glow-btn w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {sendingOtp ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </div>
        ) : (
          /* Step 2 Form */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Verification Code (OTP)
              </label>
              <input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="123456"
                {...register('otp', {
                  required: 'OTP code is required',
                  minLength: { value: 6, message: 'OTP must be 6 digits' },
                })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors tracking-[0.25em] text-center font-bold"
              />
              {errors.otp && <p className="text-xs text-rose-500 mt-1.5">{errors.otp.message}</p>}
            </div>

            {/* Action Buttons */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="glow-btn w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Register'}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-550 hover:text-slate-700 transition-colors w-full py-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Go Back to Details
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-500 mt-6 font-semibold">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
