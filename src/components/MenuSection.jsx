'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const ANIM_FAST = {
  short: 0.18,
  mid: 0.28,
  long: 0.7,
};

const sampleMenu = [
  { id: 's1', category: 'Starters', name: 'Charred Octopus', desc: 'Smoky char, lemon aioli', price: '$12', img: '/images/menu/octopus.jpg' },
  { id: 's2', category: 'Starters', name: 'Crisp Calamari', desc: 'Citrus salt, herb dip', price: '$9', img: '/images/menu/calamari.jpg' },
  { id: 'm1', category: 'Mains', name: 'Wood-fire Ribeye', desc: 'Aged beef, char butter', price: '$32', img: '/images/menu/ribeye.jpg' },
  { id: 'm2', category: 'Mains', name: 'Seared Sea Bass', desc: 'Charred lemon, basil oil', price: '$26', img: '/images/menu/seabass.jpg' },
  { id: 'd1', category: 'Desserts', name: 'Smoked Caramel Tart', desc: 'Flakey crust, sea salt', price: '$8', img: '/images/menu/tart.png' },
  { id: 'dr1', category: 'Drinks', name: 'Smoky Old Fashioned', desc: 'House bitters, flamed orange', price: '$11', img: '/images/menu/oldfashioned.jpg' },
];

const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'];

export default function MenuSection({
  menu = sampleMenu,
  title = 'Explore the full menu',
  subtitle = 'All dishes grouped by course — pick, peek, and order quickly.',
  variant = 'cards', // 'cards' | 'compact'
}) {
  const [active, setActive] = useState('Starters');
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerSpring = useSpring(pointerX, { stiffness: 60, damping: 18 });
  const mouseX = useTransform(pointerSpring, (v) => `${v / 22}px`);
  const trackRef = useRef(null);

  // detect touch device to avoid hover/parallax on mobile
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(!!touch);
  }, []);

  // pointer move only when non-touch, cards variant, and not reduced motion
  useEffect(() => {
    if (shouldReduceMotion || variant !== 'cards' || isTouch) return;
    const el = trackRef.current;
    if (!el) return;

    function onMove(e) {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      // scale down raw input to keep motion gentle
      pointerX.set(x * 0.35);
    }

    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, [pointerX, shouldReduceMotion, variant, isTouch]);

  const visible = useMemo(() => menu.filter((m) => m.category === active), [menu, active]);

  // pick preview image (first item of visible or fallback)
  const preview = visible[0] || menu[0];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const card = {
    hidden: { opacity: 0, y: 12, scale: 0.995 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: ANIM_FAST.short, type: 'spring', stiffness: 220, damping: 20 } },
    exit: { opacity: 0, y: 10, scale: 0.995, transition: { duration: ANIM_FAST.short } },
  };

  const listItem = {
    hidden: { opacity: 0, x: 18 },
    show: { opacity: 1, x: 0, transition: { duration: ANIM_FAST.short } },
    exit: { opacity: 0, x: -12, transition: { duration: ANIM_FAST.short } },
  };

  return (
    <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16" ref={trackRef}>
      {/* Layout: left content + right visual overlay on lg+ */}
      <div className="relative">
        <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4 pr-0 lg:pr-80">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">{title}</h2>
            <p className="text-neutral-600 mt-2 max-w-2xl text-sm md:text-base">{subtitle}</p>
          </div>

          <div className="flex gap-2 md:gap-3 items-center">
            {categories.map((c) => (
              <motion.button
                key={c}
                onClick={() => setActive(c)}
                layout
                whileTap={{ scale: 0.98 }}
                className={`px-3 md:px-4 py-2 rounded-full text-sm md:text-sm font-semibold ${active === c ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'}`}
                aria-pressed={active === c}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Marquee / Garnish — only show on non-touch & cards */}
        {!shouldReduceMotion && !isTouch && variant === 'cards' && (
          <motion.div
            style={{ x: mouseX }}
            className="absolute -right-6 -top-6 w-40 h-40 rounded-full opacity-70 pointer-events-none hidden md:block"
            animate={{ rotate: [0, 18, -8, 0] }}
            transition={{ duration: ANIM_FAST.long, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        )}

        <div className="lg:pr-80">{/* reserve space on the right for visual panel on large screens */}
          {/* CARDS: responsive grid on md+, horizontal swipe on small screens */}
          {variant === 'cards' ? (
            <>
              {/* mobile: horizontally scrollable cards for swipe + large tap targets */}
              <div className="sm:hidden -mx-4 px-4 overflow-x-auto flex gap-4 pb-4 touch-pan-x scroll-pl-4">
                <AnimatePresence initial={false} mode="popLayout">
                  {visible.map((dish) => (
                    <motion.article
                      key={dish.id}
                      layout
                      variants={card}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      whileTap={{ scale: 0.995 }}
                      className="min-w-[86%] flex-shrink-0 bg-white/90 rounded-2xl overflow-hidden shadow-md cursor-pointer"
                      style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${dish.name} — ${dish.desc} — ${dish.price}`}
                    >
                      <div className="relative h-44 sm:h-44 w-full">
                        <Image src={dish.img} alt={dish.name} fill className="object-cover" sizes="(max-width: 640px) 86vw, 33vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 text-xs font-medium bg-white/80 text-amber-700 px-2 py-1 rounded-full">{dish.category}</div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white drop-shadow truncate">{dish.name}</h3>
                            <p className="text-sm text-white/90 truncate">{dish.desc}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-extrabold text-white drop-shadow">{dish.price}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 flex items-center gap-3">
                        <button className="px-3 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold hover:scale-[1.02] transition">View</button>
                        <motion.button whileTap={{ scale: 0.98 }} className="ml-auto px-4 py-2 rounded-full bg-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition">Reserve</motion.button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* desktop / tablet: grid */}
              <motion.div variants={container} initial="hidden" animate={shouldReduceMotion ? undefined : 'show'} className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {visible.map((dish) => (
                    <motion.article
                      key={dish.id}
                      layout
                      variants={card}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      whileHover={!isTouch && !shouldReduceMotion ? { scale: 1.03, y: -6 } : {}}
                      whileTap={{ scale: 0.995 }}
                      className="relative bg-white/80 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                      style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${dish.name} — ${dish.desc} — ${dish.price}`}
                    >
                      <div className="relative h-44 md:h-48 w-full">
                        <Image src={dish.img} alt={dish.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 text-xs font-medium bg-white/70 text-amber-700 px-2 py-1 rounded-full">{dish.category}</div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-white drop-shadow truncate">{dish.name}</h3>
                            <p className="text-sm text-white/90 truncate">{dish.desc}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-extrabold text-white drop-shadow">{dish.price}</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex items-center gap-3">
                        <button className="px-3 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold hover:scale-105 transition">View</button>
                        <motion.button whileTap={{ scale: 0.96 }} className="ml-auto px-4 py-2 rounded-full bg-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition">
                          Add
                        </motion.button>
                      </div>

                      <motion.div layoutId={`badge-${dish.id}`} className="absolute top-3 right-3 text-xs font-semibold text-white bg-amber-500/90 px-2 py-1 rounded-full shadow-sm">
                        Quick
                      </motion.div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          ) : (
            /* COMPACT VARIANT */
            <div>
              <motion.ul initial="hidden" animate={shouldReduceMotion ? 'show' : 'show'} className="space-y-3">
                <AnimatePresence>
                  {visible.map((dish) => (
                    <motion.li
                      key={dish.id}
                      variants={listItem}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="bg-white/90 rounded-xl p-3 shadow flex items-center gap-3"
                      style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}
                    >
                      <div className="relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={dish.img} alt={dish.name} fill className="object-cover" sizes="80px" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-semibold truncate">{dish.name}</h4>
                            <p className="text-xs text-neutral-500 truncate">{dish.desc}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-extrabold">{dish.price}</div>
                            <div className="text-xs text-neutral-400">{dish.category}</div>
                          </div>
                        </div>

                        <div className="mt-2 flex gap-2">
                          <button className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">View</button>
                          <motion.button whileTap={{ scale: 0.96 }} className="px-3 py-1 rounded-full bg-amber-600 text-white text-xs font-semibold">Add</motion.button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            </div>
          )}

          <div className="mt-6 text-sm text-neutral-500 text-center sm:text-left">
            Pro tip: swipe cards on mobile or hover on desktop to interact — fully responsive and touch-friendly.
          </div>
        </div>

        {/* RIGHT VISUAL PANEL - reacts to category changes */}
        <div className="hidden lg:flex absolute right-0 top-0 bottom-0 w-80 pr-6 items-center justify-center pointer-events-none">
          <div className="w-full h-full relative rounded-l-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, x: 30, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -18, scale: 0.98 }} transition={{ duration: 0.6, ease: 'easeInOut' }} className="absolute inset-0">
                {/* blurred preview background */}
                <div className="absolute inset-0">
                  <Image src={preview.img} alt={preview.name} fill className="object-cover blur-sm scale-105" sizes="320px" priority={false} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.18))', mixBlendMode: 'multiply' }} />
                </div>

                {/* focused preview card */}
                <div className="absolute left-4 top-6 w-[calc(100%-32px)] rounded-2xl bg-white/80 p-3 backdrop-blur-md shadow-lg" style={{ transform: 'translateZ(0)' }}>
                  <div className="relative w-full h-36 rounded-xl overflow-hidden">
                    <Image src={preview.img} alt={preview.name} fill className="object-cover" sizes="320px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  <div className="mt-3">
                    <div className="text-xs text-amber-600 font-semibold">{active}</div>
                    <div className="text-sm font-bold mt-1">{preview.name}</div>
                    <div className="text-sm text-neutral-600 mt-1">{preview.desc}</div>
                    <div className="text-lg font-extrabold text-amber-600 mt-2">{preview.price}</div>
                  </div>
                </div>

                {/* subtle floating garnish for each category */}
                <motion.div initial={{ y: 6, opacity: 0 }} animate={{ y: [6, 0, 6], opacity: [0.9, 1, 0.9] }} transition={{ repeat: Infinity, duration: 3.8 }} className="absolute bottom-6 left-6 w-12 h-12 rounded-full bg-amber-50 shadow-md flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="#f97316"/><path d="M6 12c3-4 6-4 12 0" stroke="#fb7185" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
