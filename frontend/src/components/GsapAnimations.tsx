'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin safely in browser environment
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface FadeInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: number;
}

/**
 * ScrollTrigger FadeIn wrapper using GSAP
 */
export function GsapFadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className = '',
}: FadeInProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    if (direction === 'up') y = 40;
    if (direction === 'down') y = -40;
    if (direction === 'left') x = 40;
    if (direction === 'right') x = -40;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, x, y },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, elRef);

    return () => ctx.revert();
  }, [direction, delay, duration]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  staggerAmount?: number;
}

/**
 * Stagger grid item reveal animation with GSAP ScrollTrigger
 */
export function GsapStaggerGrid({ children, className = '', staggerAmount = 0.12 }: StaggerGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const childrenEls = container.children;
    if (!childrenEls || childrenEls.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        childrenEls,
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: staggerAmount,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [staggerAmount, children]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

interface HeroAnimationProps {
  title: string;
  subtitle: string;
  badge?: string;
  ctaText?: string;
  ctaLink?: string;
}

/**
 * Animated Hero component powered by GSAP
 */
export function GsapHeroSection({
  title,
  subtitle,
  badge = 'Engineered For Speed & Durability',
}: HeroAnimationProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.gsap-hero-badge',
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 }
      )
        .fromTo(
          '.gsap-hero-title',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.3'
        )
        .fromTo(
          '.gsap-hero-desc',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(
          '.gsap-hero-buttons',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.4'
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative z-10 px-6 sm:px-12 md:px-16 max-w-2xl">
      <span className="gsap-hero-badge inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider mb-5 border border-white/20 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
        {badge}
      </span>
      
      <h1 className="gsap-hero-title text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-5 tracking-tight">
        {title}
      </h1>
      
      <p className="gsap-hero-desc text-gray-300 text-sm sm:text-base md:text-lg mb-8 max-w-lg leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}
