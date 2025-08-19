'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useReducedMotion, useSpring } from 'framer-motion';

export default function HeroMain({
  image = '/images/hero/plate.png',
  chefImage = '/images/hero/chef.png',
  alt = 'Signature dish',
}) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // pointer-based micro-parallax (raw values)
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // smooth the pointer values with a spring for gentle, lagged motion
  const springConfig = shouldReduceMotion ? { stiffness: 1000, damping: 1000 } : { stiffness: 60, damping: 18 };
  const spx = useSpring(px, springConfig);
  const spy = useSpring(py, springConfig);

  // layered parallax offsets using the smoothed values (smaller amplitude for gentle motion)
  const slowX = useTransform(spx, (v) => v / 60);
  const slowY = useTransform(spy, (v) => v / 72);
  const plateX = useTransform(spx, (v) => v / 28);
  const plateY = useTransform(spy, (v) => v / 32);
  const midX = useTransform(spx, (v) => v / 18);
  const midY = useTransform(spy, (v) => v / 20);

  // very subtle 3D tilt angles (reduced intensity)
  const rotY = useTransform(spx, (v) => -v / 220);
  const rotX = useTransform(spy, (v) => v / 300);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const el = containerRef.current;
    if (!el) return;

    let raf = null;
    function onPointer(e) {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      // scale down raw input a bit so motion is less aggressive
      px.set(x * 0.7);
      py.set(y * 0.65);
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {});
    }

    el.addEventListener('pointermove', onPointer);
    return () => {
      el.removeEventListener('pointermove', onPointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [px, py, shouldReduceMotion]);

  // entrance variants for text + CTAs
  const containerVariant = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // steam / particle defs (gentler)
  const steamDefs = [
    { delay: 0, duration: 1.8 },
    { delay: 0.5, duration: 2.2 },
    { delay: 1.0, duration: 2.6 },
  ];

  // floating ingredient defs (positions are relative)
  const ingred = [
    { id: 'chili', label: 'Charred Chili', x: -86, y: -40, size: 44 },
    { id: 'herb', label: 'Fresh Herb', x: 100, y: -68, size: 46 },
    { id: 'lemon', label: 'Citrus Zest', x: -40, y: 90, size: 40 },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-14 lg:py-24" ref={containerRef}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* LEFT: copy */}
        <motion.section variants={containerVariant} initial="hidden" animate="show" className="space-y-6 lg:col-span-5">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium w-max">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3v18" stroke="#b45309" strokeWidth="1.4" strokeLinecap="round"/></svg>
            New Seasonal Menu
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            <span>Taste the </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-red-500 to-pink-500">extraordinary</span>
            <br /> at every bite.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-neutral-600 max-w-xl">
            We combine wood-fired techniques with seasonal produce — subtle smoke, precise seasoning, and cinematic plating.
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-4 items-center mt-4">
            <a href="#reserve" className="relative inline-flex items-center gap-3 px-5 py-3 rounded-full bg-amber-600 text-white shadow-2xl hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-amber-200/40 transition-transform" aria-label="Reserve a table">
              <span className="absolute -inset-0.5 rounded-full opacity-30 blur-2xl" style={{ background: 'linear-gradient(90deg, rgba(255,183,77,0.9), rgba(236,72,153,0.6))', zIndex: -1 }} />
              Reserve a table
            </a>

            <a href="#menu" className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-100 transition">
              View menu
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-3 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-2">
              <strong className="text-neutral-700">Open tonight</strong>
              <span>• 6:00pm — 11:30pm</span>
            </span>
          </motion.div>
        </motion.section>

        {/* RIGHT: denser visual composition with chef panel */}
        <section className="relative flex items-center justify-center lg:col-span-7">
          {/* background photographic panel (large, fills column) */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-0"
              style={{ x: slowX, y: slowY }}
              animate={shouldReduceMotion ? {} : { scale: [1, 1.01, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            >
              <div className="w-full h-full relative">
                <Image src={image} alt="backdrop" fill className="object-cover opacity-28 scale-105 blur-sm" sizes="100vw" priority={false} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,248,238,0.34), rgba(255,240,245,0.12))', mixBlendMode: 'multiply' }} aria-hidden />
              </div>
            </motion.div>

            {/* decorative angled gradient shape to frame the plate */}
            <div className="absolute -left-24 -top-12 w-[36%] h-[140%] transform -skew-x-12 rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(251,113,133,0.05))', filter: 'blur(26px)' }} />
          </div>

          {/* center plate composition */}
          <motion.div
            style={{ x: plateX, y: plateY, rotateY: rotY, rotateX: rotX, transformStyle: 'preserve-3d' }}
            animate={shouldReduceMotion ? {} : { rotate: [0, 0.6, -0.45, 0], y: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-full max-w-[720px] aspect-[1/1] flex items-center justify-center"
          >
            {/* soft halo behind plate */}
            <div className="absolute rounded-full w-[88%] h-[88%]" style={{ background: 'radial-gradient(circle at 40% 35%, rgba(255,244,229,0.95), rgba(251,113,133,0.06) 40%)', filter: 'blur(36px)', zIndex: 0 }} aria-hidden />

            {/* plate frame */}
            <div className="relative rounded-full w-[78%] h-[78%] flex items-center justify-center bg-white/96 shadow-[0_40px_80px_rgba(236,72,153,0.06)]" style={{ backdropFilter: 'blur(6px)' }}>
              <div className="relative w-[86%] h-[86%] rounded-full overflow-hidden shadow-2xl">
                <Image src={image} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 60vw, 720px" priority={true} />
                <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 34px 58px rgba(0,0,0,0.16)', borderRadius: '9999px' }} aria-hidden />

                {!shouldReduceMotion && (
                  <motion.div
                    initial={{ x: '-140%' }}
                    animate={{ x: ['-140%', '120%'] }}
                    transition={{ repeat: Infinity, ease: 'linear', duration: 2.6 }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 45%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0) 100%)', mixBlendMode: 'screen' }}
                    aria-hidden
                  />
                )}

                <div className="absolute inset-0 opacity-8 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '3px 3px' }} aria-hidden />
              </div>

              {/* interactive hotspots */}
              {!shouldReduceMotion && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <button className="px-4 py-2 rounded-full bg-amber-600 text-white font-medium shadow-lg hover:scale-[1.025] focus:outline-none focus:ring-4 focus:ring-amber-200/30 transition-transform">Order Now</button>
                  <button className="px-3 py-2 rounded-full bg-white/30 border border-white/20 text-neutral-900 backdrop-blur-sm hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/20 transition-transform">Ingredients</button>
                </div>
              )}
            </div>

            {/* chef badge */}
            {!shouldReduceMotion && (
              <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: [1, 1.01, 1], opacity: 1 }} transition={{ duration: 1.0 }} className="absolute left-6 top-6 rounded-xl bg-white/72 border border-white/10 px-3 py-2 shadow backdrop-blur-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-md overflow-hidden">
                  <Image src={image} alt="mini" width={36} height={36} className="object-cover" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-800">Chef's Signature</div>
                  <div className="text-sm font-medium">Smoked Ribeye</div>
                </div>
              </motion.div>
            )}

            {/* floating ingredient accents */}
            {!shouldReduceMotion && ingred.map((it, i) => (
              <motion.div key={it.id} initial={{ y: 0, opacity: 0 }} animate={{ y: [ -4, 0, -3 ], opacity: [1] }} transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }} className="absolute pointer-events-none" style={{ left: `calc(50% + ${it.x}px)`, top: `calc(50% + ${it.y}px)` }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white/96 overflow-hidden" title={it.label}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="#f97316"/><path d="M6 12c3-4 6-4 12 0" stroke="#fb7185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </motion.div>
            ))}

            {/* steam clusters */}
            {!shouldReduceMotion && steamDefs.map((s, idx) => (
              <motion.div key={idx} initial={{ y: 18, opacity: 0, scale: 0.98 }} animate={{ y: [-6 - idx * 6, -68 - idx * 28], opacity: [0, 0.9, 0], scale: [0.98, 1.03, 0.99] }} transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeOut' }} className="absolute left-[50%] w-36 h-36 rounded-full pointer-events-none" style={{ transform: `translateX(${idx * 14}px)`, filter: 'blur(26px)', background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)' }} aria-hidden />
            ))}

          </motion.div>

          {/* caption */}
          <div className="mt-6 text-center text-sm text-neutral-600 w-full"></div>

          {/* NEW: Chef panel on the far-right overlapping the hero (visible on lg+) */}
          <div className="hidden lg:block absolute right-6 top-12 bottom-12 w-52 pointer-events-auto">
            <motion.div initial={{ x: 36, opacity: 0, scale: 0.98 }} animate={{ x: 0, opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="relative w-full h-full rounded-2xl bg-white/75 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
              {/* chef image (portrait) */}
              <div className="absolute inset-0">
                <Image src={chefImage} alt="Chef cooking" fill className="object-cover" sizes="208px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* overlay content */}
              <div className="absolute bottom-4 left-4 right-4 text-left text-sm text-white">
                <div className="text-xs font-semibold text-amber-300">Meet the Chef</div>
                <div className="font-bold text-lg mt-1">Chef Rahim</div>
                <div className="text-xs text-white/90 mt-1">Flame-grill specialist • Live-fire plating</div>

                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 rounded-full bg-amber-600 text-white text-sm font-semibold shadow-md">Watch</button>
                  <button className="px-2 py-1 rounded-full bg-white/20 text-white text-xs">Bio</button>
                </div>
              </div>

              {/* small animated flame near bottom-left to hint action */}
              {!shouldReduceMotion && (
                <motion.div animate={{ y: [0, -6, 0], scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }} className="absolute left-4 bottom-14 w-10 h-10 rounded-full bg-amber-50/90 flex items-center justify-center shadow-md">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3c-2 3-6 5-5 9 1 4 6 5 6 9 0-4 5-5 6-9 1-4-3-6-7-9z" fill="#fb7185" />
                    <path d="M12 6c-1.2 1.7-3 2.5-2.5 4 0.6 1.6 2.5 1.8 3 3 0-1.6 1.5-1.8 2.2-3 0.7-1.2-1.5-2.2-2.7-4z" fill="#f97316" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
