'use client';

import React from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { GsapFadeIn } from '@/components/GsapAnimations';

export default function ReturnsPage() {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <GsapFadeIn direction="up">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Hassle-Free Policy</span>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Returns & Exchanges</h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              Your satisfaction is guaranteed. If your accessory isn&apos;t right, return or exchange it within 7 days.
            </p>
          </div>
        </GsapFadeIn>

        <div className="space-y-6">
          <GsapFadeIn direction="up">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 font-bold">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">7-Day Guarantee</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                You have 7 days from the date of delivery to request a return or replacement if the item is defective or does not meet your expectations.
              </p>
            </div>
          </GsapFadeIn>

          <GsapFadeIn direction="up">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Return Eligibility Criteria</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Item must be unused and in original product packaging.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>All seals, cables, and bundled accessories must be included.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Order receipt or Order ID must be presented.</span>
                </li>
              </ul>
            </div>
          </GsapFadeIn>

          <GsapFadeIn direction="up">
            <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h3 className="text-lg font-bold">Need to Initiate a Return?</h3>
                <p className="text-gray-300 text-xs sm:text-sm mt-1">Contact our WhatsApp support team with your order number.</p>
              </div>
              <Link href="/contact" className="bg-white text-black px-6 py-3 rounded-xl font-bold text-xs hover:bg-gray-100 transition-colors shrink-0">
                Contact Support →
              </Link>
            </div>
          </GsapFadeIn>
        </div>

      </div>
    </div>
  );
}
