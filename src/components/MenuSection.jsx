'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useTransform } from 'framer-motion';

/**
 * MenuSection (with `variant` support)
 *
 * Props:
 *  - menu: array of dish objects { id, category, name, desc, price, img, [blurDataURL] }
 *  - title: section title
 *  - subtitle: section subtitle
 *  - variant: 'cards' | 'compact'  (default: 'cards')
 *
 * Usage:
 *  <MenuSection variant="cards" />
 *  or
 *  <MenuSection variant="compact" />
 *
 * Notes:
 *  - Put your images in /public/images/menu/ (or pass external URLs and configure next.config.js)
 *  - The component respects prefers-reduced-motion
 */

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
  const mouseX = useTransform(pointerX, (v) => `${v / 22}px`);
  const trackRef = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion || variant !== 'cards') return;
    const el = trackRef.current;
    if (!el) return;
    function onMove(e) {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      pointerX.set(x);
    }
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, [pointerX, shouldReduceMotion, variant]);

  const visible = useMemo(() => menu.filter((m) => m.category === active), [menu, active]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const card = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: ANIM_FAST.short, type: 'spring', stiffness: 200, damping: 18 },
    },
    exit: { opacity: 0, y: 12, scale: 0.985, transition: { duration: ANIM_FAST.short } },
  };

  const listItem = {
    hidden: { opacity: 0, x: 18 },
    show: { opacity: 1, x: 0, transition: { duration: ANIM_FAST.short } },
    exit: { opacity: 0, x: -12, transition: { duration: ANIM_FAST.short } },
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div className="flex items-center justify-between mb-6 flex-col sm:flex-row gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">{title}</h2>
          <p className="text-neutral-600 mt-2 max-w-2xl">{subtitle}</p>
        </div>

        <div className="flex gap-3 items-center">
          {categories.map((c) => (
            <motion.button
              key={c}
              onClick={() => setActive(c)}
              layout
              whileTap={{ scale: 0.96 }}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${active === c ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50'}`}
              aria-pressed={active === c}
            >
              {c}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="relative" ref={trackRef}>
        {/* fast marquee garnish (cards-only) */}
        {variant === 'cards' && !shouldReduceMotion && (
          <motion.div
            style={{
              x: mouseX,
              background: 'radial-gradient(circle at 20% 20%, rgba(253,186,116,0.9), rgba(251,113,133,0.4))',
            }}
            className="absolute -right-8 -top-6 w-48 h-48 rounded-full opacity-70 pointer-events-none"
            animate={{ rotate: [0, 20, -10, 0] }}
            transition={{ duration: ANIM_FAST.long, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        )}

        {/* CARDS VARIANT */}
        {variant === 'cards' ? (
          <motion.div variants={container} initial="hidden" animate={shouldReduceMotion ? undefined : 'show'} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {visible.map((dish) => (
                <motion.article
                  key={dish.id}
                  layout
                  variants={card}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -6, rotate: [-1, 1, -1] }}
                  className="relative bg-white/80 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform"
                  style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${dish.name} — ${dish.desc} — ${dish.price}`}
                >
                  <div className="relative h-44 w-full">
                    <Image
                      src={dish.img}
                      alt={dish.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                      {...(dish.blurDataURL ? { placeholder: 'blur', blurDataURL: dish.blurDataURL } : {})}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 text-xs font-medium bg-white/70 text-amber-700 px-2 py-1 rounded-full">{dish.category}</div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white drop-shadow">{dish.name}</h3>
                        <p className="text-sm text-white/90">{dish.desc}</p>
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
                    className="bg-white/80 rounded-xl p-3 shadow flex items-center gap-3"
                    style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}
                  >
                    <div className="relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={dish.img}
                        alt={dish.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        {...(dish.blurDataURL ? { placeholder: 'blur', blurDataURL: dish.blurDataURL } : {})}
                      />
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
      </div>

      <div className="mt-8 text-sm text-neutral-500 text-center sm:text-left">
        Pro tip: hover quickly over cards to reveal snappy micro-animations — designed for a lively impression.
      </div>
    </section>
  );
}
