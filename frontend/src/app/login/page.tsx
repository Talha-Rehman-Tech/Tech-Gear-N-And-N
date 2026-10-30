'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      let res: Response;
      try {
        res = await fetch(`${API_BASE_URL}/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        });
      } catch {
        throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.');
      }

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid response from server. Please try again.');
      }

      if (!res.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Save token and user in localStorage and cookie
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      document.cookie = `token=${data.token}; path=/; max-age=2592000; SameSite=Lax`;

      const isAdmin = data.role === 'admin';
      setSuccessMessage(isAdmin ? 'Admin authenticated! Loading dashboard...' : 'Login successful! Redirecting...');

      setTimeout(() => {
        if (redirect) {
          router.push(redirect);
        } else if (isAdmin) {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      }, 700);

    } catch (err: unknown) {
      console.error('Login error:', err);
      const msg = err instanceof Error ? err.message : 'Unable to connect to server. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#fafafa] px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block bg-black text-white font-extrabold px-3 py-1 rounded-lg text-sm mb-3">TechGEAR</div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-sm text-gray-500">Sign in to your customer or admin account</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3.5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 rounded-xl text-sm transition-all outline-none"
                placeholder="you@example.com / admin@techgear.com"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Password</label>
            </div>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 rounded-xl text-sm transition-all outline-none"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-8">
          Don&apos;t have an account? <Link href="/register" className="text-black font-bold hover:underline">Create an account / Sign up as Admin</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fafafa]">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
