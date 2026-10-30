'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { CheckCircle, Lock, ShieldCheck, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { GsapFadeIn } from '@/components/GsapAnimations';
import { API_BASE_URL } from '@/lib/api';

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
    postalCode: '54000',
    notes: '',
  });

  const router = useRouter();

  useEffect(() => {
    let isSubscribed = true;

    const initCheckout = async () => {
      let token = localStorage.getItem('userToken');
      if (!token) {
        const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (cookieToken) {
          token = cookieToken.split('=')[1];
        }
      }

      if (!token) {
        router.push('/login?redirect=/checkout');
        return;
      }

      const savedUserInfo = localStorage.getItem('userInfo');
      if (savedUserInfo) {
        try {
          const parsed = JSON.parse(savedUserInfo);
          if (isSubscribed) {
            setUser(parsed);
            const nameParts = (parsed.name || '').split(' ');
            setFormData(prev => ({
              ...prev,
              firstName: nameParts[0] || '',
              lastName: nameParts.slice(1).join(' ') || '',
              email: parsed.email || '',
              phone: parsed.phone || '+92 300 1234567',
              address: parsed.address || '123 Tech Street, Gulberg III',
            }));
          }
        } catch {}
      }

      if (isSubscribed) {
        setLoading(false);
      }
    };

    initCheckout();

    return () => {
      isSubscribed = false;
    };
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCheckoutError(null);

    const token = localStorage.getItem('userToken');
    const shippingCost = getTotalPrice() > 2000 ? 0 : 150;
    const finalTotal = getTotalPrice() + shippingCost;

    const orderPayload = {
      orderItems: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.id,
        variant: { color: item.color || 'Default' }
      })),
      shippingInfo: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: 'Pakistan'
      },
      paymentInfo: {
        method: 'COD',
        status: 'Pending'
      },
      itemsPrice: getTotalPrice(),
      shippingPrice: shippingCost,
      totalPrice: finalTotal
    };

    try {
      if (!token) {
        throw new Error('You must be signed in to place an order.');
      }

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to place order. Please review your shipping details.');
      }

      setOrderPlaced(true);
      clearCart();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while placing your order.';
      setCheckoutError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium text-sm">Verifying checkout session...</p>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <GsapFadeIn direction="up">
        <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-md">
            <CheckCircle className="w-12 h-12" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-3.5 py-1 rounded-full mb-3 inline-flex items-center gap-1.5 border border-green-200">
            <Sparkles className="w-3.5 h-3.5" /> Order Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8 max-w-md text-sm sm:text-base leading-relaxed">
            Thank you for shopping with TechGear, <span className="font-bold text-gray-900">{formData.firstName || user?.name || 'Customer'}</span>! A confirmation email has been dispatched to <span className="font-semibold text-gray-900">{formData.email}</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/profile" className="bg-white border-2 border-black text-black px-7 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm">
              View Order History
            </Link>
            <Link href="/" className="bg-black text-white px-7 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors text-sm shadow-md">
              Continue Shopping
            </Link>
          </div>
        </div>
      </GsapFadeIn>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6 max-w-md">Add items to your cart before proceeding to checkout.</p>
        <Link href="/category/all" className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const shippingCost = getTotalPrice() > 2000 ? 0 : 150;
  const finalTotal = getTotalPrice() + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 min-h-[75vh]">
      
      <GsapFadeIn direction="up">
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <Link href="/cart" className="hover:text-black flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Back to Cart</Link>
              <span>/</span>
              <span>Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Secure Checkout</h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200">
            <Lock className="w-3.5 h-3.5" /> Authenticated User: {user?.name || user?.email || 'Logged In'}
          </div>
        </div>
      </GsapFadeIn>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <GsapFadeIn direction="up">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xs">
              
              {checkoutError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs sm:text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Contact Info */}
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required 
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" 
                      placeholder="John" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      required 
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" 
                      placeholder="Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required 
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" 
                      placeholder="you@example.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Phone Number (For Delivery SMS)</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required 
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" 
                      placeholder="+92 300 1234567" 
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-8 border-t border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">2</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Delivery Street Address</label>
                    <input 
                      type="text" 
                      name="address"
                      required 
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" 
                      placeholder="House / Apartment #, Street address, Area" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">City</label>
                      <input 
                        type="text" 
                        name="city"
                        required 
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" 
                        placeholder="Lahore / Karachi / Islamabad" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Postal Code</label>
                      <input 
                        type="text" 
                        name="postalCode"
                        required 
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" 
                        placeholder="54000" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-8 border-t border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs">3</span>
                  Payment Method
                </h2>
                <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border-2 border-black flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input type="radio" checked readOnly className="w-5 h-5 accent-black" />
                    <div>
                      <span className="font-bold text-gray-900 block text-sm sm:text-base">Cash on Delivery (COD)</span>
                      <span className="text-xs text-gray-500">Pay cash in hand upon product delivery & inspection</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-green-100 text-green-800 px-3 py-1 rounded-full">Recommended</span>
                </div>
              </div>
            </form>
          </GsapFadeIn>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-md sticky top-28 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 pb-4 border-b border-gray-100">
              Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
            </h2>
            
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(item => (
                <div key={`${item.id}-${item.color}`} className="flex justify-between items-center text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{item.quantity}x</span>
                    <div>
                      <span className="text-gray-800 font-medium line-clamp-1 max-w-[140px]">{item.name}</span>
                      {item.color && <span className="text-[11px] text-gray-400 block">{item.color}</span>}
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-xs sm:text-sm border-y border-gray-100 py-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">Rs. {getTotalPrice()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold text-gray-900">
                  {shippingCost === 0 ? <span className="text-green-600">FREE</span> : `Rs. ${shippingCost}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-gray-900">
                Rs. {finalTotal}
              </span>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm hover:bg-gray-900 active:scale-[0.99] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Confirm Order (Rs. {finalTotal})
            </button>

            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-gray-500" />
              <span>100% Secure Checkout Guarantee</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
