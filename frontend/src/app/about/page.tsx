'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Zap, Sparkles, ArrowRight, Truck, CheckCircle2 } from 'lucide-react';
import { GsapFadeIn, GsapStaggerGrid } from '@/components/GsapAnimations';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header */}
        <GsapFadeIn direction="up">
          <div className="bg-gray-950 text-white rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-14 mb-16 relative overflow-hidden shadow-2xl border border-gray-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" /> Empowering Pakistan&apos;s Everyday Carry
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
              Engineering the Future of <br className="hidden sm:block" />
              <span className="text-gray-300">Mobile Accessories.</span>
            </h1>
            <p className="text-gray-300 max-w-2xl text-sm sm:text-base leading-relaxed mb-8">
              Founded in 2024, TechGear set out to eradicate flimsy cables, slow wall chargers, and low-fidelity audio. We curate premium GaN III fast chargers, MFi braided cables, and studio TWS earbuds backed by official warranty.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/category/all" className="bg-white text-black px-7 py-3 rounded-full font-extrabold hover:bg-gray-100 transition-all flex items-center gap-2 text-sm shadow-lg">
                Explore Accessories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </GsapFadeIn>

        {/* Pillars / Values Grid */}
        <GsapStaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-700 rounded-2xl flex items-center justify-center font-bold">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Next-Gen GaN Tech</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We leverage gallium nitride III semiconductor technology to shrink chargers by 50% while pushing up to 100W PD charging speed safely.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Official Warranty</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every item sold comes with a zero-hassle replacement guarantee. If anything fails under normal use, we replace it instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Express Delivery</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Partnered with top logistics providers across Pakistan to deliver orders within 24 to 72 hours with Cash on Delivery (COD).
            </p>
          </div>
        </GsapStaggerGrid>

        {/* Story Section */}
        <GsapFadeIn direction="up">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-100 shadow-xs space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Our Commitment to Quality</h2>
            <div className="prose text-gray-600 leading-relaxed space-y-4 text-sm sm:text-base">
              <p>
                Whether you are a power user needing high-wattage multi-port charging hubs or a music enthusiast looking for noise-canceling wireless earbuds, TechGear delivers uncompromised performance.
              </p>
              <p>
                We inspect every batch, run temperature testing, and verify power delivery metrics before any accessory hits our store shelves.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-6 text-xs font-bold text-gray-700">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> 100% Authentic Products</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> MFi & GaN III Verified</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-600" /> 24/7 Dedicated Support</span>
            </div>
          </div>
        </GsapFadeIn>

      </div>
    </div>
  );
}
