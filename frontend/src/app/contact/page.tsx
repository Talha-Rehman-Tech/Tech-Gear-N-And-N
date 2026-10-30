'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { GsapFadeIn } from '@/components/GsapAnimations';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
    }, 3500);
  };

  return (
    <div className="w-full min-h-screen bg-[#fafafa] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <GsapFadeIn direction="up">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Customer Service</span>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Get in Touch</h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Have a question about fast chargers, order tracking, or warranty replacement? Our team is ready to assist you.
            </p>
          </div>
        </GsapFadeIn>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Info Cards */}
          <GsapFadeIn direction="right">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="flex items-start gap-5 p-5 bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Phone & WhatsApp Support</h3>
                  <p className="text-gray-700 text-sm mt-0.5 font-medium">+92 300 1234567</p>
                  <p className="text-xs text-gray-400 mt-1">Monday – Saturday (9:00 AM to 7:00 PM PKT)</p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-5 bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Email Assistance</h3>
                  <p className="text-gray-700 text-sm mt-0.5 font-medium">support@techgear.pk</p>
                  <p className="text-xs text-gray-400 mt-1">Direct replies within 24 hours guaranteed</p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-5 bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Headquarters</h3>
                  <p className="text-gray-700 text-sm mt-0.5 font-medium">TechGear Towers, Block C3, Gulberg III</p>
                  <p className="text-xs text-gray-400 mt-1">Lahore, Pakistan</p>
                </div>
              </div>
            </div>
          </GsapFadeIn>

          {/* Form */}
          <GsapFadeIn direction="left">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm relative">
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-sm font-semibold text-green-800 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <span>Thank you! Your message has been sent. We&apos;ll reply shortly.</span>
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" 
                      placeholder="John" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none transition-all" 
                    placeholder="you@example.com" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">Your Message</label>
                  <textarea 
                    rows={4} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-xl text-sm outline-none resize-none transition-all" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-900 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Send className="w-4 h-4" /> Send Inquiry
                </button>
              </form>
            </div>
          </GsapFadeIn>

        </div>
      </div>
    </div>
  );
}
