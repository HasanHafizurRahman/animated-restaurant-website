'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const sampleDishes = [
  {
    id: 1,
    name: "Smoky Ember Burger",
    desc: "Oak-smoked patty, melted cheese, pickled slaw",
    price: "$14",
    tag: "Chef's Pick",
  },
  {
    id: 2,
    name: "Fire-Roasted Salmon",
    desc: "Citrus glaze, charred lemon, herb oil",
    price: "$22",
    tag: "New",
  },
  {
    id: 3,
    name: "Saffron Risotto",
    desc: "Creamy arborio, roasted mushrooms, gremolata",
    price: "$18",
    tag: "Seasonal",
  },
];

export default function FeaturedDishes({ items = sampleDishes }) {
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const card = {
    hidden: { y: 28, opacity: 0, scale: 0.98 },
    show: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 14 } },
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-3 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium w-max">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3v18" stroke="#b45309" strokeWidth="1.4" strokeLinecap="round"/></svg>
            Featured Dishes
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight">
            Today's highlights — bold flavors, quick theater.
          </h2>
          <p className="text-neutral-600 mt-2 max-w-2xl">Fast-moving plating and big, confident tastes. Tap a card to peek the details or reserve directly.</p>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <a href="#menu" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition">View full menu</a>
          <a href="#reserve" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600 text-white shadow hover:shadow-md transition">Reserve</a>
        </div>
      </div>

      {/* card grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={shouldReduceMotion ? undefined : 'show'}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {items.map((d, i) => (
          <motion.article
            key={d.id}
            variants={card}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04, y: -6, rotate: [-1, 1, -1] }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="relative overflow-hidden rounded-2xl bg-white/80 p-4 shadow-lg hover:shadow-2xl transition-transform cursor-pointer"
            style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}
            role="button"
            tabIndex={0}
            aria-label={`${d.name} — ${d.desc} — ${d.price}`}
          >
            {/* fast accent swirls (animated) */}
            {!shouldReduceMotion && (
              <motion.div
                className="pointer-events-none absolute -left-10 -top-6 w-48 h-48 rounded-full opacity-60"
                animate={{ rotate: [0, 40, -30, 0], x: [0, -8, 6, 0], y: [0, -6, 0, 0] }}
                transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ background: 'radial-gradient(circle at 30% 30%, rgba(253,186,116,0.9), rgba(251,113,133,0.4))' }}
              />
            )}

            <div className="relative z-10 flex items-start gap-4">
              {/* placeholder art: circle with emoji — swap for real image tag if you have images */}
              <div className="flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold text-white shadow-md"
                style={{ background: 'linear-gradient(180deg,#FFD59E,#F6A04D)' }}>
                {i === 0 ? '🍔' : i === 1 ? '🐟' : '🍚'}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{d.name}</h3>
                  <span className="text-sm font-medium text-amber-600">{d.price}</span>
                </div>

                <p className="text-sm text-neutral-500 mt-1">{d.desc}</p>

                <div className="mt-3 flex items-center gap-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">{d.tag}</span>

                  <a href="#reserve" className="ml-auto inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 text-sm text-neutral-700 hover:bg-neutral-50 transition">Reserve</a>
                </div>
              </div>
            </div>

            {/* quick badge top-right */}
            <div className="absolute top-3 right-3 text-xs font-semibold text-amber-700 bg-white/60 px-2 py-1 rounded-full shadow-sm">{i + 1}</div>
          </motion.article>
        ))}
      </motion.div>

      {/* small footer CTA */}
      <div className="mt-8 text-sm text-neutral-500 text-center sm:text-left">
        <span>Want a bespoke tasting menu? </span>
        <a href="#contact" className="text-amber-600 font-medium hover:underline">Contact our chef</a>
      </div>
    </section>
  );
}
