'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Lock, Mail, KeyRound, ShieldAlert, CheckCircle2, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<'user' | 'admin'>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    if (accountType === 'admin' && !adminSecretKey.trim()) {
      setErrorMessage('Please enter the Admin Secret Passcode (e.g. admin123)');
      setLoading(false);
      return;
    }

    try {
      let res: Response;
      try {
        res = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            role: accountType,
            adminSecretKey: adminSecretKey.trim()
          }),
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
        throw new Error(data.message || 'Failed to create account');
      }

      // Store in localStorage & cookies
      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data));
      document.cookie = `token=${data.token}; path=/; max-age=2592000; SameSite=Lax`;

      setSuccessMessage(
        accountType === 'admin' 
          ? 'Admin account created successfully! Opening Admin Dashboard...'
          : 'Account created successfully! Redirecting...'
      );

      setTimeout(() => {
        if (accountType === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
        router.refresh();
      }, 700);

    } catch (err: unknown) {
      console.error('Registration error:', err);
      const msg = err instanceof Error ? err.message : 'Error creating account. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#fafafa] px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-100">
        <div className="text-center mb-6">
          <div className="inline-block bg-black text-white font-extrabold px-3 py-1 rounded-lg text-sm mb-3">TechGEAR</div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Create Account</h1>
          <p className="text-xs sm:text-sm text-gray-500">Choose your account type to get started</p>
        </div>

        {/* Account Type Selector Tab */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setAccountType('user'); setErrorMessage(''); }}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'user' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" /> Customer
          </button>
          <button
            type="button"
            onClick={() => { setAccountType('admin'); setErrorMessage(''); }}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              accountType === 'admin' 
                ? 'bg-black text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Admin Portal
          </button>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-red-700">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 rounded-xl text-sm transition-all outline-none"
                placeholder={accountType === 'admin' ? "Admin Talha" : "John Doe"}
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 rounded-xl text-sm transition-all outline-none"
                placeholder={accountType === 'admin' ? "admin@techgear.com" : "you@example.com"}
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 rounded-xl text-sm transition-all outline-none"
                placeholder="At least 6 characters"
                minLength={6}
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Admin Secret Passcode Field */}
          {accountType === 'admin' && (
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl animate-in fade-in duration-200">
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-900">Admin Secret Passcode</label>
                <span className="text-[11px] font-semibold text-amber-700">Restricted Access</span>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-amber-300 focus:border-black rounded-xl text-sm outline-none transition-all"
                  placeholder="Enter Secret Key"
                />
                <KeyRound className="w-4 h-4 text-amber-600 absolute left-3.5 top-3" />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md mt-2"
          >
            {loading ? 'Creating account...' : accountType === 'admin' ? 'Register as Admin' : 'Create Customer Account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6">
          Already have an account? <Link href="/login" className="text-black font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
