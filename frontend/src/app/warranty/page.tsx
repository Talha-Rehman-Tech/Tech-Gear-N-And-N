'use client';

import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { GsapFadeIn, GsapStaggerGrid } from '@/components/GsapAnimations';

export default function WarrantyPage() {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <GsapFadeIn direction="up">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">TechGear Guarantee</span>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Official Warranty Policy</h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              Every accessory we sell is covered under our official warranty against manufacturing hardware failures.
            </p>
          </div>
        </GsapFadeIn>

        <GsapStaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">6 Months</span>
            <h3 className="text-lg font-bold text-gray-900 pt-1">Fast Chargers & Hubs</h3>
            <p className="text-xs text-gray-500">Covers GaN chipsets, port failures, and power delivery dropouts.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">6 Months</span>
            <h3 className="text-lg font-bold text-gray-900 pt-1">Power Banks</h3>
            <p className="text-xs text-gray-500">Covers battery capacity defects, MagSafe wireless coils, and circuit board failures.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">3 Months</span>
            <h3 className="text-lg font-bold text-gray-900 pt-1">Audio & TWS</h3>
            <p className="text-xs text-gray-500">Covers earbud drivers, charging case battery, ANC circuitry, and Bluetooth pairing modules.</p>
          </div>
        </GsapStaggerGrid>

        <GsapFadeIn direction="up">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">What Is & Is Not Covered?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <span className="font-bold text-green-700 block">✓ What IS Covered</span>
                  <ul className="space-y-1.5 text-gray-600 text-xs">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Internal component failures</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Sudden charging power dropouts</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Manufacturing flaws</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-red-600 block">✕ What Is NOT Covered</span>
                  <ul className="space-y-1.5 text-gray-600 text-xs">
                    <li className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-red-500" /> Physical damage, drops, or cracks</li>
                    <li className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-red-500" /> Water / liquid submersion</li>
                    <li className="flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-red-500" /> Electrical surge damage</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </GsapFadeIn>

      </div>
    </div>
  );
}
