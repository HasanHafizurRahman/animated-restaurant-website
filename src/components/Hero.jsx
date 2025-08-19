'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useReducedMotion, useSpring } from 'framer-motion';

/**
 * HeroMain.responsive.jsx
 * - Responsive version of your HeroMain component
 * - Keeps the full large-screen design, but simplifies/relaxes visuals on small screens
 * - Key approaches:
 *   • Detect small screens (matchMedia) and reduce motion/visual density
 *   • Hide or trim decorative elements on mobile (steam, many ingredients, chef panel)
 *   • Make CTAs stack and become full-width on narrow viewports
 *   • Reduce parallax amplitude and disable pointer-based parallax on mobile
 *
 * Props: image, chefImage, alt (same as original)
 */

export default function HeroMain({
  image = '/images/hero/plate.png',
  chefImage = '/images/hero/chef.png',
  alt = 'Signature dish',
}) {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  // detect narrow viewports (mobile) so we can change layout + reduce motion
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mm = window.matchMedia('(max-width: 639px)'); // tailwind 'sm' breakpoint
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mm.matches);
    // modern API
    if (mm.addEventListener) mm.addEventListener('change', onChange);
    else mm.addListener(onChange);
    return () => {
      if (mm.removeEventListener) mm.removeEventListener('change', onChange);
      else mm.removeListener(onChange);
    };
  }, []);

  // Raw pointer values (px/py) -> smoothed via spring
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // on mobile or when user prefers reduced motion, we use a tighter spring (less motion)
  const springConfig = shouldReduceMotion || isMobile
    ? { stiffness: 1000, damping: 1000 }
    : { stiffness: 52, damping: 16 };

  const spx = useSpring(px, springConfig);
  const spy = useSpring(py, springConfig);

  // Parallax transforms: smaller amplitudes for elegance and mobile friendliness
  const slowX = useTransform(spx, (v) => v / (isMobile ? 160 : 90));
  const slowY = useTransform(spy, (v) => v / (isMobile ? 180 : 110));
  const plateX = useTransform(spx, (v) => v / (isMobile ? 120 : 36));
  const plateY = useTransform(spy, (v) => v / (isMobile ? 120 : 40));
  const rotY = useTransform(spx, (v) => -v / (isMobile ? 900 : 360));
  const rotX = useTransform(spy, (v) => v / (isMobile ? 1000 : 420));

  // pointer handling: do not enable pointer parallax on mobile
  useEffect(() => {
    if (shouldReduceMotion || isMobile) return; // no pointer-based motion on mobile or prefers-reduced-motion
    const el = containerRef.current;
    if (!el) return;

    function onPointer(e) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // normalized [-1, 1]
      const nx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height / 2)));
      // scale down the normalized values to control amplitude
      px.set(nx * 48);
      py.set(ny * 40);
    }

    function onLeave() {
      px.set(0);
      py.set(0);
    }

    el.addEventListener('pointermove', onPointer);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', onPointer);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [px, py, shouldReduceMotion, isMobile]);

  // entrance variants
  const containerVariant = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // subtle steam timings (we will disable or shrink these on mobile)
  const steamDefs = [
    { delay: 0, duration: 2.1 },
    { delay: 0.6, duration: 2.8 },
    { delay: 1.2, duration: 3.4 },
  ];

  const ingred = [
    { id: 'chili', label: 'Charred Chili', x: -76, y: -34, size: 44 },
    { id: 'herb', label: 'Fresh Herb', x: 94, y: -60, size: 46 },
    { id: 'lemon', label: 'Citrus Zest', x: -36, y: 86, size: 40 },
  ];

  // on mobile show fewer accents to avoid clutter
  const visibleIngred = isMobile ? ingred.slice(0, 1) : ingred;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-24" ref={containerRef}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
        {/* LEFT: copy */}
        <motion.section
          variants={containerVariant}
          initial="hidden"
          animate="show"
          className="space-y-4 sm:space-y-6 lg:col-span-5"
          aria-labelledby="hero-title"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-3 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium w-max"
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v18" stroke="#b45309" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            New Seasonal Menu
          </motion.div>

          <motion.h1
            id="hero-title"
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight"
          >
            <span>Taste the </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-red-500 to-pink-500">
              extraordinary
            </span>
            <br /> at every bite.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-neutral-600 max-w-md sm:max-w-xl">
            We combine wood-fired techniques with seasonal produce — subtle smoke, precise seasoning, and cinematic
            plating.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mt-3">
            <a
              href="#reserve"
              className={`relative inline-flex items-center gap-3 px-5 py-3 rounded-full bg-amber-600 text-white shadow-lg hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-amber-200/40 transition-transform ${isMobile ? 'w-full justify-center' : 'w-auto'}`}
              aria-label="Reserve a table"
            >
              <span
                className="absolute -inset-0.5 rounded-full opacity-30 blur-2xl"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,183,77,0.95), rgba(236,72,153,0.55))',
                  zIndex: -1,
                }}
                aria-hidden
              />
              Reserve a table
            </a>

            <a
              href="#menu"
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-100 transition ${isMobile ? 'w-full justify-center' : ''}`}
              aria-label="View the menu"
            >
              View menu
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-2 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-2">
              <strong className="text-neutral-700">Open tonight</strong>
              <span>• 6:00pm — 11:30pm</span>
            </span>
          </motion.div>
        </motion.section>

        {/* RIGHT: dense visual composition */}
        <section className="relative flex items-center justify-center lg:col-span-7">
          {/* backdrop */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <motion.div
              className="absolute inset-0"
              style={{ x: slowX, y: slowY }}
              animate={shouldReduceMotion || isMobile ? {} : { scale: [1, 1.006, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            >
              <div className="w-full h-full relative">
                <Image
                  src={image}
                  alt="backdrop"
                  fill
                  className={`object-cover ${isMobile ? 'opacity-18 scale-105 blur-sm' : 'opacity-28 scale-105 blur-sm'}`}
                  sizes="100vw"
                  priority={false}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, rgba(255,248,238,0.34), rgba(255,240,245,0.12))', mixBlendMode: 'multiply' }}
                  aria-hidden
                />
              </div>
            </motion.div>

            {/* angled soft frame (subtle on mobile) */}
            <div
              className={`${isMobile ? 'hidden' : 'absolute -left-20 -top-10 w-[36%] h-[140%] transform -skew-x-12 rounded-3xl pointer-events-none'}`}
              style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(251,113,133,0.05))', filter: 'blur(28px)' }}
              aria-hidden
            />
          </div>

          {/* plate composition */}
          <motion.div
            style={{ x: plateX, y: plateY, rotateY: rotY, rotateX: rotX, transformStyle: 'preserve-3d' }}
            animate={shouldReduceMotion || isMobile ? {} : { rotate: [0, 0.45, -0.35, 0], y: [0, -4, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className={`relative z-10 w-full max-w-[420px] sm:max-w-[640px] lg:max-w-[720px] aspect-[1/1] flex items-center justify-center`}
          >
            {/* halo */}
            <div
              className="absolute rounded-full"
              style={{
                width: isMobile ? '92%' : '88%',
                height: isMobile ? '92%' : '88%',
                background: 'radial-gradient(circle at 38% 34%, rgba(255,244,229,0.95), rgba(251,113,133,0.06) 42%)',
                filter: `blur(${isMobile ? 20 : 36}px)`,
                zIndex: 0,
              }}
              aria-hidden
            />

            {/* plate frame */}
            <div
              className="relative rounded-full flex items-center justify-center bg-white/96 shadow-[0_36px_72px_rgba(236,72,153,0.06)]"
              style={{ width: isMobile ? '84%' : '78%', height: isMobile ? '84%' : '78%', backdropFilter: 'blur(6px)' }}
            >
              <div className="relative rounded-full overflow-hidden shadow-2xl" style={{ width: isMobile ? '86%' : '86%', height: isMobile ? '86%' : '86%' }}>
                <Image src={image} alt={alt} fill className="object-cover" sizes="(max-width: 640px) 90vw, 720px" priority />
                {/* inset shading for focus */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ boxShadow: 'inset 0 24px 48px rgba(0,0,0,0.12)', borderRadius: '9999px' }}
                  aria-hidden
                />

                {/* gloss sheen (smaller/shorter on mobile) */}
                {!shouldReduceMotion && !isMobile && (
                  <motion.div
                    initial={{ x: '-160%' }}
                    animate={{ x: ['-160%', '120%'] }}
                    transition={{ repeat: Infinity, ease: 'linear', duration: 2.4 }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.13) 45%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0) 100%)',
                      mixBlendMode: 'screen',
                    }}
                    aria-hidden
                  />
                )}

                {/* subtle texture */}
                <div
                  className="absolute inset-0 opacity-8 pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '3px 3px' }}
                  aria-hidden
                />
              </div>

              {/* interactive hotspots (keyboard accessible) */}
              {!shouldReduceMotion && !isMobile && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                  <button
                    className="px-4 py-2 rounded-full bg-amber-600 text-white font-medium shadow-md hover:scale-[1.025] focus:outline-none focus:ring-4 focus:ring-amber-200/30 transition-transform"
                    aria-label="Order now"
                  >
                    Order Now
                  </button>
                  <button
                    className="px-3 py-2 rounded-full bg-white/30 border border-white/20 text-neutral-900 backdrop-blur-sm hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/20 transition-transform"
                    aria-label="See ingredients"
                  >
                    Ingredients
                  </button>
                </div>
              )}
            </div>

            {/* chef badge (smaller & hidden on mobile) */}
            {!shouldReduceMotion && !isMobile && (
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: [1, 1.01, 1], opacity: 1 }}
                transition={{ duration: 1.0 }}
                className="absolute left-6 top-6 rounded-xl bg-white/72 border border-white/10 px-3 py-2 shadow backdrop-blur-sm flex items-center gap-3"
                role="group"
                aria-label="Chef's signature"
              >
                <div className="w-9 h-9 rounded-md overflow-hidden">
                  <Image src={chefImage} alt="chef avatar" width={36} height={36} className="object-cover" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-800">Chef's Signature</div>
                  <div className="text-sm font-medium">Smoked Ribeye</div>
                </div>
              </motion.div>
            )}

            {/* floating ingredient accents (fewer on mobile) */}
            {!shouldReduceMotion &&
              visibleIngred.map((it, i) => (
                <motion.div
                  key={it.id}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [-4, 0, -3], opacity: [1] }}
                  transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute pointer-events-none"
                  style={{ left: `calc(50% + ${it.x}px)`, top: `calc(50% + ${it.y}px)` }}
                  title={it.label}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-white/96 overflow-hidden" aria-hidden>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" fill="#f97316" />
                      <path d="M6 12c3-4 6-4 12 0" stroke="#fb7185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </motion.div>
              ))}

            {/* steam clusters: smaller + fewer on mobile */}
            {!shouldReduceMotion && !isMobile &&
              steamDefs.map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 18, opacity: 0, scale: 0.98 }}
                  animate={{ y: [-8 - idx * 6, -64 - idx * 24], opacity: [0, 0.9, 0], scale: [0.98, 1.03, 0.99] }}
                  transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute left-[50%] w-36 h-36 rounded-full pointer-events-none"
                  style={{
                    transform: `translateX(${idx * 14}px)`,
                    filter: 'blur(26px)',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)',
                  }}
                  aria-hidden
                />
              ))}
          </motion.div>

          {/* caption placeholder (kept minimal) */}
          <div className="mt-4 text-center text-sm text-neutral-600 w-full" aria-hidden />

          {/* chef panel on the far-right (lg only) */}
          <div className="hidden lg:block absolute right-6 top-12 bottom-12 w-56 pointer-events-auto">
            <motion.div
              initial={{ x: 36, opacity: 0, scale: 0.98 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-full h-full rounded-2xl bg-white/78 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0">
                <Image src={chefImage} alt="Chef cooking" fill className="object-cover" sizes="224px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/28 to-transparent" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-left text-sm text-white">
                <div className="text-xs font-semibold text-amber-300">Meet the Chef</div>
                <div className="font-bold text-lg mt-1">Chef Rahim</div>
                <div className="text-xs text-white/90 mt-1">Flame-grill specialist • Live-fire plating</div>

                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 rounded-full bg-amber-600 text-white text-sm font-semibold shadow-md">Watch</button>
                  <button className="px-2 py-1 rounded-full bg-white/20 text-white text-xs">Bio</button>
                </div>
              </div>

              {!shouldReduceMotion && (
                <motion.div
                  animate={{ y: [0, -6, 0], scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  className="absolute left-4 bottom-14 w-10 h-10 rounded-full bg-amber-50/90 flex items-center justify-center shadow-md"
                  aria-hidden
                >
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
