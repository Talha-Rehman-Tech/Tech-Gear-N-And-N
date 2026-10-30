'use client';

import React from 'react';
import { Truck, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { GsapFadeIn, GsapStaggerGrid } from '@/components/GsapAnimations';

export default function ShippingPage() {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <GsapFadeIn direction="up">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Logistics Policy</span>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Shipping & Fast Delivery</h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              We ensure fast, tracked dispatch across all major cities and remote areas in Pakistan.
            </p>
          </div>
        </GsapFadeIn>

        <GsapStaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Delivery Timelines</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span><strong>Major Cities:</strong> 1 - 2 Working Days</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span><strong>Other Regions:</strong> 3 - 5 Working Days</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-3">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Shipping Charges</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span><strong>Standard Shipping:</strong> Rs. 150</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span><strong>Free Delivery:</strong> On all orders above Rs. 2,000</span>
              </li>
            </ul>
          </div>
        </GsapStaggerGrid>

        <GsapFadeIn direction="up">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-700" /> Cash on Delivery (COD)
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We offer Cash on Delivery across Pakistan. Please ensure you provide an active phone number at checkout so our courier partner can notify you prior to delivery.
            </p>
          </div>
        </GsapFadeIn>

      </div>
    </div>
  );
}
