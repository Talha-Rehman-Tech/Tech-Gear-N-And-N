'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, PlusCircle, Settings, LogOut, Lock, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface AdminUserProfile {
  name?: string;
  email?: string;
  role?: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUserProfile | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    const verifyAdmin = async () => {
      let token = localStorage.getItem('userToken');
      if (!token) {
        const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (cookieToken) {
          token = cookieToken.split('=')[1];
        }
      }

      if (!token) {
        if (isSubscribed) {
          setIsAuthorized(false);
          setCheckingAuth(false);
        }
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Unauthorized');
        const profile = await res.json();
        if (isSubscribed) {
          if (profile && profile.role === 'admin') {
            setAdminUser(profile);
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
          setCheckingAuth(false);
        }
      } catch {
        if (isSubscribed) {
          setIsAuthorized(false);
          setCheckingAuth(false);
        }
      }
    };

    verifyAdmin();

    return () => {
      isSubscribed = false;
    };
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Add Product', href: '/admin/add-product', icon: PlusCircle },
    { name: 'Customer Orders', href: '/admin/orders', icon: Package },
    { name: 'Shop Settings', href: '/admin/shop-settings', icon: Settings },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium text-sm">Verifying Admin privileges...</p>
      </div>
    );
  }

  // Unauthorized Barrier
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Lock className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full mb-3 inline-block">
            Restricted Area
          </span>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Admin Authorization Required</h1>
          <p className="text-gray-500 text-xs sm:text-sm mb-8 leading-relaxed">
            You need an authenticated Administrator account to access the merchant console and manage store inventory.
          </p>

          <div className="space-y-3">
            <Link 
              href="/register" 
              className="w-full bg-black text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-gray-900 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <ShieldCheck className="w-4 h-4" /> Sign up as Admin
            </Link>
            <Link 
              href="/login?redirect=/admin" 
              className="w-full bg-gray-100 text-gray-800 py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              Sign In to Existing Admin Account
            </Link>
            <Link 
              href="/" 
              className="block text-xs font-semibold text-gray-400 hover:text-black pt-2"
            >
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200/80 hidden md:flex flex-col shadow-sm">
        <div className="h-20 flex items-center px-6 border-b border-gray-100 justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2 group">
            <span className="bg-black text-white px-2.5 py-1 rounded-lg text-sm font-black">Tech</span>
            <span className="text-gray-900 text-lg font-black tracking-wider">ADMIN</span>
          </Link>
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" title="System Online"></span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                  isActive ? 'bg-black text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="px-3 py-2 bg-gray-50 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Logged In As</span>
            <p className="text-xs font-bold text-gray-900 truncate">{adminUser?.name || 'Administrator'}</p>
            <p className="text-[11px] text-gray-500 truncate">{adminUser?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Exit & Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200/80 flex items-center justify-between px-6 md:px-8 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              {navItems.find(i => i.href === pathname)?.name || 'Admin Console'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center font-black text-xs">
                {(adminUser?.name || 'A').charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-gray-800 pr-1">{adminUser?.name?.split(' ')[0] || 'Admin'}</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
