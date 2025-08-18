'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const sampleTestimonials = [
  {
    id: 1,
    name: 'Maya R.',
    title: 'Food Blogger',
    text: "Aroma & Co. surprised me — the ember burger was theatrical and perfectly seasoned. Service was rapid and friendly.",
    avatar: '/images/testimonials/maya.jpg',
  },
  {
    id: 2,
    name: 'Liam K.',
    title: 'Designer',
    text: "The chef's tasting blew my mind — layers of flavour and show. Book early for weekend nights.",
    avatar: '/images/testimonials/liam.png',
  },
  {
    id: 3,
    name: 'Ava S.',
    title: 'Local Guide',
    text: "Fast, exciting plating — great for date night. The cocktails were bold and perfectly balanced.",
    avatar: '/images/testimonials/ava.png',
  },
];

export function TestimonialsSection({ testimonials = sampleTestimonials, autoMs = 2600 }) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // fast auto-advance
  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, Math.max(1200, autoMs)); // keep it snappy but not too fast
    return () => clearInterval(id);
  }, [testimonials.length, autoMs, shouldReduceMotion]);

  const container = {
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
      <div className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold">What people are saying</h2>
        <p className="text-neutral-600 mt-2 max-w-2xl">Fast-paced service, bold flavors — hear it from our guests.</p>
      </div>

      <div className="relative">
        <div className="overflow-hidden rounded-2xl bg-white/80 shadow-lg p-6" style={{ backdropFilter: 'blur(6px)' }}>
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden ring-2 ring-amber-100 shadow">
              <Image src={testimonials[index].avatar} alt={testimonials[index].name} width={80} height={80} className="object-cover" />
            </div>

            {/* Testimonial card (animated) */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={testimonials[index].id}
                  initial={{ opacity: 0, y: 10, scale: 0.995 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.995 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.32, ease: 'easeOut' }}
                  className="text-neutral-800"
                >
                  <p className="text-lg sm:text-xl font-medium">“{testimonials[index].text}”</p>
                  <footer className="mt-3 text-sm text-neutral-600">— {testimonials[index].name}, <span className="font-semibold">{testimonials[index].title}</span></footer>
                </motion.blockquote>
              </AnimatePresence>

              {/* controls */}
              <div className="mt-4 flex items-center gap-3">
                <div className="flex gap-2">
                  {testimonials.map((t, i) => (
                    <button
                      key={t.id}
                      onClick={() => setIndex(i)}
                      aria-label={`Show testimonial ${i + 1}`}
                      className={`w-2 h-2 rounded-full ${i === index ? 'bg-amber-600' : 'bg-neutral-300'} transition-all`}
                    />
                  ))}
                </div>

                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => setIndex((s) => (s - 1 + testimonials.length) % testimonials.length)}
                    className="px-3 py-2 rounded-full bg-white border border-neutral-200 shadow-sm hover:scale-95 transition"
                    aria-label="Previous testimonial"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setIndex((s) => (s + 1) % testimonials.length)}
                    className="px-3 py-2 rounded-full bg-amber-600 text-white shadow-md hover:scale-105 transition"
                    aria-label="Next testimonial"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* fast decorative confetti motion */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0], y: [0, -6, -18] }}
            transition={{ repeat: Infinity, duration: 2.6 }}
            className="pointer-events-none absolute -right-6 -top-6 w-36 h-36 rounded-full"
            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(254,243,199,0.9), rgba(254,215,170,0.7))' }}
            aria-hidden
          />
        )}
      </div>
    </section>
  );
}