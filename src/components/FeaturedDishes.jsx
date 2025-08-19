'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const sampleDishes = [
  { id: 1, name: 'Smoky Ember Burger', desc: 'Oak-smoked patty, melted cheese, pickled slaw', price: '$14', tag: "Chef's Pick", image: '/images/dishes/burger.png' },
  { id: 2, name: 'Fire-Roasted Salmon', desc: 'Citrus glaze, charred lemon, herb oil', price: '$22', tag: 'New', image: '/images/dishes/salmon.png' },
  { id: 3, name: 'Saffron Risotto', desc: 'Creamy arborio, roasted mushrooms, gremolata', price: '$18', tag: 'Seasonal', image: '/images/dishes/risotto.jpg' },
];

// Utility: clamp
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

// morphing background blob (kept for page-level decor)
function LiquidBlob({ reduced, style = {} }) {
  if (reduced) return null;
  const paths = [
    'M421.5 279.5Q384 329 341 350.5Q298 372 246 383.5Q194 395 142.5 370.5Q91 346 73.5 296.5Q56 247 76 197Q96 147 142 119Q188 91 238.5 78.5Q289 66 335.5 84Q382 102 418.5 137Q455 172 443.5 218Q432 264 421.5 279.5Z',
    'M427 281.5Q389 333 351 360Q313 387 260 385.5Q207 384 173 354Q139 324 102 285Q65 246 86.5 196.5Q108 147 152.5 120Q197 93 246.5 80.5Q296 68 335 92Q374 116 404 150.5Q434 185 423 237Q412 289 427 281.5Z',
    'M412.5 285Q384 330 343.5 357Q303 384 254 383.5Q205 383 162 359.5Q119 336 88 294Q57 252 73 204Q89 156 129.5 129.5Q170 103 218 96.5Q266 90 315.5 99.5Q365 109 397.5 140.5Q430 172 427 220Q424 268 412.5 285Z',
  ];

  return (
    <motion.svg viewBox="0 0 512 512" preserveAspectRatio="xMidYMid slice" aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
      style={{ zIndex: 0, mixBlendMode: 'multiply', opacity: 0.22, filter: 'blur(48px)', ...style }}
    >
      <defs>
        <linearGradient id="liquidGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="rgb(255, 213, 158)" />
          <stop offset="100%" stopColor="rgb(251,113,133)" />
        </linearGradient>
      </defs>

      <motion.path fill="url(#liquidGrad)" d={paths[0]}
        animate={{ d: [paths[0], paths[1], paths[2], paths[0]] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

// === NEW: LiquidBody ===
// Fluid wave that lives inside the white card body, anchored left and covering 40% width.
function LiquidBody({ index = 0, reduced = false }) {
  if (reduced) return null;

  // three morphing wave shapes (kept modest)
  const wavePaths = [
    'M0 72 C 45 30, 105 108, 180 72 C 255 36, 315 120, 360 72 L 360 180 L 0 180 Z',
    'M0 60 C 48 8, 120 84, 180 60 C 240 36, 312 96, 360 60 L 360 180 L 0 180 Z',
    'M0 80 C 52 44, 128 124, 180 80 C 232 36, 308 92, 360 80 L 360 180 L 0 180 Z',
  ];

  // unique gradient id per index to avoid collisions
  const gradId = `liquidBodyGrad-${index}`;

  return (
    // svg sized to fill the body column allocated (we will wrap this in a container that is 40% width)
    <svg viewBox="0 0 360 180" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <defs>
        <linearGradient id={gradId} x1="0" x2="1">
          {/* left-to-right base color #FEDBC5 */}
          <stop offset="0%" stopColor="#FEDBC5" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#FEDBC5" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FEDBC5" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      <motion.g animate={{ x: [0, 10, 0] }} transition={{ duration: 6 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.path
          d={wavePaths[0]}
          fill={`url(#${gradId})`}
          style={{ mixBlendMode: 'screen', opacity: 0.95 }}
          animate={{ d: [wavePaths[0], wavePaths[1], wavePaths[2], wavePaths[0]] }}
          transition={{ duration: 5 + index * 0.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
    </svg>
  );
}

export default function FeaturedDishes({ items = sampleDishes }) {
  const shouldReduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setSelected(null); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const container = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06, when: 'beforeChildren' } },
  };

  return (
    <section className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div className="absolute inset-0 -z-10">
        <LiquidBlob reduced={shouldReduceMotion} style={{ transform: 'translateY(-12%) scale(1.2)' }} />
      </div>

      {!shouldReduceMotion && (
        <>
          <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-none absolute -left-6 -top-6 w-28 h-28 rounded-full bg-amber-100/60 blur-3xl" />
          <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-none absolute right-8 -top-4 w-20 h-20 rounded-full bg-amber-50/70 blur-2xl" />
          <motion.div aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-none absolute -right-10 bottom-8 w-32 h-32 rounded-full bg-amber-50/60 blur-3xl" />
        </>
      )}

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-3 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium w-max">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3v18" stroke="#b45309" strokeWidth="1.4" strokeLinecap="round"/></svg>
            Featured Dishes
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight">Today's highlights — bold flavors, quick theater.</h2>
          <p className="text-neutral-600 mt-2 max-w-2xl">Fast-moving plating and big, confident tastes. Tap a card to peek the details or reserve directly.</p>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <a href="#menu" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition">View full menu</a>
          <a href="#reserve" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600 text-white shadow hover:shadow-md transition">Reserve</a>
        </div>
      </div>

      <motion.div variants={container} initial="hidden" animate={shouldReduceMotion ? undefined : 'show'} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {items.map((d, i) => (
          <DishCard key={d.id} d={d} index={i} onSelect={() => setSelected(d)} shouldReduceMotion={shouldReduceMotion} />
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />

            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: 'easeOut' }} role="dialog" aria-modal="true"
              className="relative bg-white rounded-2xl shadow-2xl w-[min(720px,95%)] max-h-[90vh] overflow-auto"
            >
              <div className="relative w-full h-64 sm:h-72">
                <motion.div initial={shouldReduceMotion ? {} : { scale: 1 }} animate={shouldReduceMotion ? {} : { scale: 1.025 }} transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} className="absolute inset-0">
                  <Image src={selected.image} alt={selected.name} fill className="object-cover rounded-t-2xl" sizes="(max-width: 720px) 100vw, 720px" />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <button onClick={() => setSelected(null)} className="absolute right-3 top-3 bg-white/60 rounded-full p-2 shadow">✕</button>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-extrabold">{selected.name}</h3>
                    <p className="text-neutral-600 mt-2">{selected.desc}</p>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="text-amber-600 font-semibold text-lg">{selected.price}</div>
                      <div className="px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">{selected.tag}</div>
                    </div>

                    <div className="mt-4 text-sm text-neutral-500">Want this as part of a tasting? <a href="#contact" className="text-amber-600 font-medium">Contact our chef</a></div>

                    <div className="mt-6 flex gap-3">
                      <a href="#reserve" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600 text-white shadow">Reserve</a>
                      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200">Add to order</button>
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end gap-2">
                    <div className="text-xs text-neutral-400">Estimated cook</div>
                    <div className="text-sm font-semibold">12–16 min</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 text-sm text-neutral-500 text-center sm:text-left relative z-10">
        <span>Want a bespoke tasting menu? </span>
        <a href="#contact" className="text-amber-600 font-medium hover:underline">Contact our chef</a>
      </div>
    </section>
  );
}

/* DishCard component: pointer-driven 3D tilt, shimmer, badge pulse + liquid body overlay */
function DishCard({ d, index, onSelect, shouldReduceMotion }) {
  const cardRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useTransform(mx, [-1, 1], [10, -10]);
  const rotateX = useTransform(my, [-1, 1], [-8, 8]);
  const cardScale = useSpring(useTransform(mx, [-1, 1], [1.01, 1.01]), { stiffness: 120, damping: 18 });

  const imgX = useTransform(mx, [-1, 1], [-8, 8]);
  const imgY = useTransform(my, [-1, 1], [-6, 6]);

  function handlePointerMove(e) {
    if (shouldReduceMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set((px - 0.5) * 2);
    my.set((py - 0.5) * 2 * -1);
  }
  function handlePointerLeave() { if (shouldReduceMotion) return; mx.set(0); my.set(0); }

  const cardVariant = { hidden: { y: 18, opacity: 0, scale: 0.99 }, show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 110, damping: 16 } } };

  return (
    <motion.article ref={cardRef} variants={cardVariant} whileHover={!shouldReduceMotion ? { scale: 1.03 } : undefined}
      onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }} role="button" tabIndex={0}
      aria-label={`${d.name} — ${d.desc} — ${d.price}`}
      style={{ rotateX: shouldReduceMotion ? 0 : rotateX, rotateY: shouldReduceMotion ? 0 : rotateY, scale: shouldReduceMotion ? 1 : cardScale, transformPerspective: 900 }}
      className="relative overflow-hidden rounded-2xl bg-white/80 p-0 shadow-lg hover:shadow-2xl transition-transform cursor-pointer"
    >
      {/* image area */}
      <div className="relative h-44 sm:h-48 lg:h-56 w-full">
        <motion.div style={{ x: shouldReduceMotion ? 0 : imgX, y: shouldReduceMotion ? 0 : imgY }} className="absolute inset-0">
          <Image src={d.image} alt={d.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" priority={false} />
        </motion.div>

        {/* overlay gradient & tag */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/22 to-transparent" aria-hidden />
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold bg-white/80 text-amber-700">{d.tag}</div>

        {/* shimmer sweep */}
        {!shouldReduceMotion && (
          <motion.div aria-hidden initial={{ x: '-120%' }} animate={{ x: '120%' }} transition={{ duration: 1.6, ease: 'linear', repeat: Infinity, repeatType: 'loop', delay: index * 0.12 }} className="pointer-events-none absolute inset-0" style={{ mixBlendMode: 'overlay' }}>
            <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent transform-gpu blur-md" />
          </motion.div>
        )}
      </div>

      {/* body */}
      <div className="p-4 relative z-10">
        <div className="absolute left-0 top-10 h-full pointer-events-none overflow-hidden" style={{ width: '80%' }}>
          <LiquidBody index={index} reduced={shouldReduceMotion} />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{d.name}</h3>
            <p className="text-sm text-neutral-500 mt-1">{d.desc}</p>
          </div>

          <div className="text-amber-600 font-medium text-lg ml-3">{d.price}</div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <a href="#reserve" onClick={(e) => e.stopPropagation()} className="ml-auto inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50 transition">Reserve</a>
          <button onClick={(e) => { e.stopPropagation(); onSelect(); }} className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">Details</button>
        </div>
      </div>

      {/* numeric badge — subtle pulse */}
      <motion.div aria-hidden initial={shouldReduceMotion ? {} : { scale: 1 }} animate={shouldReduceMotion ? {} : { scale: [1, 1.06, 1] }} transition={shouldReduceMotion ? {} : { duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.08 }} className="absolute top-3 right-3 text-xs font-semibold text-amber-700 bg-white/60 px-2 py-1 rounded-full shadow-sm">
        {index + 1}
      </motion.div>
    </motion.article>
  );
}
