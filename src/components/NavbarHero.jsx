'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'framer-motion';

export default function NavbarHero() {
  const [open, setOpen] = useState(false);

  // pointer-based parallax
  const containerRef = useRef(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const floatX = useTransform(pointerX, (v) => `${v / 14}px`);
  const floatY = useTransform(pointerY, (v) => `${v / 20}px`);
  const slowX = useTransform(pointerX, (v) => `${v / 30}px`);
  const slowY = useTransform(pointerY, (v) => `${v / 38}px`);

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onMove(e) {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      pointerX.set(x);
      pointerY.set(y);
    }
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, [pointerX, pointerY]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf0] to-white/90">
      {/* NAVBAR */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-amber-700">
            {/* simple logo */}
            <svg aria-hidden width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
              <circle cx="12" cy="12" r="10" fill="url(#g)" />
              <path d="M8 12c0-2 2-3 4-3s4 1 4 3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              <defs>
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#F59E0B" />
                  <stop offset="1" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </svg>
            <span className="sr-only">Restaurant</span>
            <span className="hidden sm:inline">Aroma & Co.</span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-neutral-600">
            <a href="#menu" className="hover:text-amber-600 transition">Menu</a>
            <a href="#about" className="hover:text-amber-600 transition">About</a>
            <a href="#private-dining" className="hover:text-amber-600 transition">Private Dining</a>
            <a href="#contact" className="hover:text-amber-600 transition">Contact</a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-100 text-amber-700 font-medium shadow-sm hover:shadow-md transition">
            Reserve Table
          </button>

          <button
            aria-label="menu"
            onClick={() => setOpen((s) => !s)}
            className="md:hidden p-2 rounded-lg bg-white/60 backdrop-blur text-amber-700 shadow-sm"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="#C2410C" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-6">
          <div className="bg-white/80 rounded-xl p-4 shadow-lg">
            <a className="block py-2" href="#menu">Menu</a>
            <a className="block py-2" href="#about">About</a>
            <a className="block py-2" href="#private-dining">Private Dining</a>
            <a className="block py-2" href="#contact">Contact</a>
            <button className="mt-3 w-full py-2 rounded-lg bg-amber-500 text-white font-semibold">Reserve Table</button>
          </div>
        </div>
      )}

      {/* HERO */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* left column */}
        <section className="space-y-6">
          <div className="inline-flex items-center gap-3 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium w-max">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3v18" stroke="#b45309" strokeWidth="1.4" strokeLinecap="round"/></svg>
            New Seasonal Menu
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Taste the <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-red-500 to-pink-500">extraordinary</span>
            <br /> at every bite.
          </h1>

          <p className="text-neutral-600 max-w-xl">We compose modern plates with timeless techniques — wood-fired, locally sourced ingredients, and a dash of theatre. Reserve your table and let the evening unfold.</p>

          <div className="flex gap-4 items-center">
            <a href="#reserve" className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-amber-600 text-white shadow-lg hover:scale-[1.02] transition">
              Reserve a table
            </a>
            <a href="#menu" className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition">
              View menu
            </a>
          </div>

          <div className="mt-6 flex gap-4 items-center text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 7h18M6 7v10a3 3 0 003 3h6a3 3 0 003-3V7" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Open today 11:30 — 22:00</span>
            </div>

            <div className="h-4 w-px bg-neutral-200" />

            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v6M12 22v-6" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <span>Chef’s tasting from $45</span>
            </div>
          </div>
        </section>

        {/* right column: animation focal point */}
        <section ref={containerRef} className="relative flex items-center justify-center">
          {/* soft morphing gradient blob (background) */}
          <motion.div
            style={{ x: slowX, y: slowY }}
            className="absolute -right-10 -top-10 w-[36rem] h-[36rem] rounded-full pointer-events-none"
            animate={{ rotate: [0, 2, -3, 0], scale: [1, 1.03, 0.98, 1] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          >
            <div className="w-full h-full rounded-full filter blur-3xl opacity-80" style={{ background: 'radial-gradient(circle at 20% 20%, rgba(254,215,170,0.9), rgba(253,186,116,0.7) 20%, rgba(251,113,133,0.6) 55%, rgba(236,72,153,0.4))' }} />
          </motion.div>

          {/* plate & elements */}
          <div className="relative w-[340px] h-[340px] flex items-center justify-center">

            {/* animated food hero (burger stack) */}
            <motion.div
              className="relative z-20 w-40 h-40 flex items-center justify-center"
              style={{ x: floatX, y: floatY }}
              animate={{ y: [-6, 6, -4, 0], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* plate base */}
              <div className="absolute bottom-0 w-44 h-6 rounded-full bg-white/70 shadow-inner" style={{ transform: 'translateY(28px)' }} />

              {/* burger stack (each layer separately animated) */}
              <motion.div className="relative flex flex-col items-center" initial={{ y: 0 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                {/* top bun */}
                <motion.div
                  className="w-36 h-10 rounded-t-2xl rounded-b-lg shadow-md flex items-center justify-center"
                  style={{ background: 'linear-gradient(180deg,#FFD59E,#F6A04D)' }}
                  animate={{ rotate: [0, -2, 1, 0], translateY: [0, -2, 0, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {/* sesame seeds */}
                  <svg width="80" height="24" viewBox="0 0 80 24" className="opacity-75">
                    <ellipse cx="18" cy="8" rx="1.8" ry="0.9" fill="#fff7e6" />
                    <ellipse cx="32" cy="6" rx="1.5" ry="0.8" fill="#fff7e6" />
                    <ellipse cx="50" cy="8" rx="1.6" ry="0.9" fill="#fff7e6" />
                    <ellipse cx="64" cy="7" rx="1.4" ry="0.8" fill="#fff7e6" />
                  </svg>
                </motion.div>

                {/* lettuce */}
                <motion.div className="w-36 h-6 rounded-md -mt-1" style={{ background: 'linear-gradient(180deg,#A7F3D0,#34D399)' }} animate={{ rotate: [-1, 1, -1] }} transition={{ duration: 3, repeat: Infinity }} />

                {/* tomato slice */}
                <motion.div className="w-32 h-4 rounded-full -mt-1 flex items-center justify-center" style={{ background: 'linear-gradient(180deg,#FF6B6B,#FF4D4D)' }} animate={{ scale: [1, 1.03, 0.98, 1] }} transition={{ duration: 2.6, repeat: Infinity }}>
                  <svg width="120" height="10" viewBox="0 0 120 10" className="opacity-90">
                    <circle cx="20" cy="5" r="0.9" fill="#FFDEDE" />
                    <circle cx="40" cy="5" r="0.9" fill="#FFDEDE" />
                    <circle cx="60" cy="5" r="0.9" fill="#FFDEDE" />
                    <circle cx="80" cy="5" r="0.9" fill="#FFDEDE" />
                  </svg>
                </motion.div>

                {/* patty */}
                <motion.div className="w-32 h-6 rounded-md -mt-1 shadow-inner" style={{ background: 'linear-gradient(180deg,#7C3E3E,#4C1F1F)' }} animate={{ translateY: [0, -2, 0] }} transition={{ duration: 3, repeat: Infinity }} />

                {/* cheese */}
                <motion.div className="w-30 h-2 -mt-1 transform rotate-[2deg] rounded-sm" style={{ background: 'linear-gradient(180deg,#FFD166,#FFB84D)' }} animate={{ rotate: [2, -1, 2] }} transition={{ duration: 2.8, repeat: Infinity }} />

                {/* bottom bun */}
                <motion.div className="w-36 h-6 rounded-b-2xl rounded-t-lg mt-2 shadow-sm" style={{ background: 'linear-gradient(180deg,#F6C08A,#E5964B)' }} animate={{ rotate: [0, 1, -1, 0] }} transition={{ duration: 4, repeat: Infinity }} />
              </motion.div>

              {/* small garnish particles (sizzle) */}
              <motion.div className="absolute -top-6 left-6 w-2 h-2 rounded-full" animate={{ y: [-6, -12, -6], opacity: [0.9, 0.2, 0.9] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ background: 'radial-gradient(circle,#fff7ed,#ffd59e)' }} />
              <motion.div className="absolute -top-4 right-6 w-1.5 h-1.5 rounded-full" animate={{ y: [-4, -10, -4], opacity: [0.9, 0.2, 0.9] }} transition={{ duration: 1.6, repeat: Infinity }} style={{ background: 'radial-gradient(circle,#fff7ed,#ffd59e)' }} />

            </motion.div>

            {/* QUICK 'GIF-LIKE' INGREDIENT TOSS (fast loop) */}
            <div className="absolute -bottom-6 right-0 w-56 h-24 pointer-events-none">
              {/* three fast ingredient icons that swoosh into the plate */}
              {!shouldReduceMotion && (
                <>
                  <motion.div
                    className="absolute w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                    initial={{ x: 120, y: 40, opacity: 0, scale: 0.6 }}
                    animate={{ x: [120, 40, 10, -20], y: [40, 10, -6, -10], opacity: [0, 1, 1, 0], scale: [0.6, 1, 0.95, 0.6], rotate: [0, 20, -10, 25] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: 0, ease: 'easeOut' }}
                    style={{ background: 'linear-gradient(180deg,#FFD59E,#F6A04D)' }}
                  >
                    {/* small cheese slice */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 3l18 9-9 9L3 12V3z" fill="#FFD166" />
                    </svg>
                  </motion.div>

                  <motion.div
                    className="absolute w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                    initial={{ x: 140, y: 20, opacity: 0, scale: 0.6 }}
                    animate={{ x: [140, 60, 20, -10], y: [20, -6, -18, -20], opacity: [0, 1, 1, 0], scale: [0.6, 1, 0.95, 0.6], rotate: [0, -10, 10, -25] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: 0.15, ease: 'easeOut' }}
                    style={{ background: 'linear-gradient(180deg,#A7F3D0,#34D399)' }}
                  >
                    {/* small basil leaf */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12c4-6 10-8 16-4-4 2-6 6-16 4z" fill="#34D399" />
                    </svg>
                  </motion.div>

                  <motion.div
                    className="absolute w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                    initial={{ x: 160, y: 10, opacity: 0, scale: 0.6 }}
                    animate={{ x: [160, 80, 30, -5], y: [10, -8, -20, -26], opacity: [0, 1, 1, 0], scale: [0.6, 1, 0.95, 0.6], rotate: [0, 30, -20, 40] }}
                    transition={{ duration: 1.3, repeat: Infinity, delay: 0.28, ease: 'easeOut' }}
                    style={{ background: 'linear-gradient(180deg,#FF6B6B,#FF4D4D)' }}
                  >
                    {/* small chili/tomato */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="6" fill="#FF4D4D" />
                    </svg>
                  </motion.div>
                </>
              )}

              {/* if user prefers reduced motion, show static icons as fallback */}
              {shouldReduceMotion && (
                <div className="absolute right-4 bottom-2 flex gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(180deg,#FFD59E,#F6A04D)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 9-9 9L3 12V3z" fill="#FFD166" /></svg>
                  </div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(180deg,#A7F3D0,#34D399)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12c4-6 10-8 16-4-4 2-6 6-16 4z" fill="#34D399" /></svg>
                  </div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(180deg,#FF6B6B,#FF4D4D)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" fill="#FF4D4D" /></svg>
                  </div>
                </div>
              )}
            </div>

            {/* rotating plate */}
            <motion.div
              style={{ x: floatX, y: floatY }}
              animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.02, 0.99, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-64 h-64 rounded-full bg-white/80 shadow-2xl flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0.6), rgba(255,255,255,0.1))' }} />

              {/* plate rim */}
              <svg width="220" height="220" viewBox="0 0 220 220" className="relative z-10">
                <defs>
                  <radialGradient id="rim2" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#f3f4f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.6" />
                  </radialGradient>
                </defs>
                <circle cx="110" cy="110" r="96" fill="url(#rim2)" stroke="#fde68a" strokeWidth="6" />
                <circle cx="110" cy="110" r="48" fill="#fff7ed" />
              </svg>
            </motion.div>

          </div>

          {/* subtle caption under the animation for context */}
          <div className="mt-6 text-center text-sm text-neutral-500">
            Artful plates • Live-fire techniques • Seasonal produce
          </div>
        </section>
      </main>

      {/* small footer note */}
      <div className="max-w-7xl mx-auto px-6 pb-12 text-xs text-neutral-400">
        <p>Built with TailwindCSS & Framer Motion — tweak gradients, timings and artwork to match your brand.</p>
      </div>
    </div>
  );
}
