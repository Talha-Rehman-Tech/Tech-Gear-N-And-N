'use client';

import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, Mail, UploadCloud, CheckCircle, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export default function ShopSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shopData, setShopData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  });

  useEffect(() => {
    let isSubscribed = true;

    fetch(`${API_BASE_URL}/shop/settings`)
      .then(res => res.json())
      .then(data => {
        if (isSubscribed && data && data.shopName) {
          setShopData({
            shopName: data.shopName || '',
            ownerName: data.ownerName || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            description: data.description || '',
          });
        }
      })
      .catch(() => {});

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShopData({ ...shopData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('userToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/shop/settings`, {
        method: 'POST',
        headers,
        body: JSON.stringify(shopData)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save shop settings.');
      }

      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating shop profile.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center mx-auto mt-10">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop Settings Saved Successfully!</h2>
        <p className="text-gray-500 mb-8">Your store business profile has been updated and synchronized with the backend database.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors"
        >
          Back to Settings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
          <Store className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Register as a Shop / Seller</h2>
          <p className="text-sm text-gray-500 mt-1">Set up your business profile to start selling products.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
            <div className="relative">
              <input 
                name="shopName" value={shopData.shopName} onChange={handleChange} required
                type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-black rounded-xl outline-none" placeholder="e.g. TechGear Official" 
              />
              <Store className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Owner&apos;s Full Name</label>
            <input 
              name="ownerName" value={shopData.ownerName} onChange={handleChange} required
              type="text" className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-black rounded-xl outline-none" placeholder="John Doe" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
            <div className="relative">
              <input 
                name="email" value={shopData.email} onChange={handleChange} required
                type="email" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-black rounded-xl outline-none" placeholder="contact@shop.com" 
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp Number</label>
            <div className="relative">
              <input 
                name="phone" value={shopData.phone} onChange={handleChange} required
                type="tel" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-black rounded-xl outline-none" placeholder="+92 300 1234567" 
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address / Location</label>
            <div className="relative">
              <input 
                name="address" value={shopData.address} onChange={handleChange} required
                type="text" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-black rounded-xl outline-none" placeholder="Shop #12, IT Tower, Lahore" 
              />
              <MapPin className="w-4 h-4 text-gray-400 absolute left-4 top-4" />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Shop Logo / Branding Image</label>
            <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-black hover:text-black transition-colors">
              <UploadCloud className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Click to upload logo</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">About the Shop</label>
            <textarea 
              name="description" value={shopData.description} onChange={handleChange} required
              rows={4} className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-black rounded-xl outline-none resize-none" placeholder="Write a short description about what you sell..."
            ></textarea>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button type="submit" disabled={loading} className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-70 flex items-center gap-2">
            {loading ? 'Saving...' : 'Save Shop Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
