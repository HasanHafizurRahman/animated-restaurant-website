'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const sampleImages = [
  { id: 1, src: null, alt: 'Wood-fired grill — Ember glow', emoji: '🔥' },
  { id: 2, src: null, alt: 'Plating closeup — Textures', emoji: '🍽️' },
  { id: 3, src: null, alt: 'Seasonal produce — Market', emoji: '🥬' },
  { id: 4, src: null, alt: 'Dessert — Sweet finish', emoji: '🍰' },
  { id: 5, src: null, alt: 'Cocktail — Spirited pour', emoji: '🍹' },
];

export default function GalleryCarousel({ images = sampleImages, speed = 40 }) {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef(null);

  // Create duplicates for seamless looping
  const items = [...images, ...images];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-3 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-sm font-medium w-max">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3v18" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round"/></svg>
            Gallery
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight">A quick look — moments from the kitchen</h2>
          <p className="text-neutral-600 mt-2 max-w-2xl">Fast visuals for a lively impression. Tap to open full-size images or swipe on mobile.</p>
        </div>

        <div className="hidden sm:flex gap-3 items-center">
          <a href="#menu" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition">See gallery</a>
        </div>
      </div>

      <div className="relative">
        {/* Overflow hidden viewport */}
        <div className="overflow-hidden rounded-2xl bg-white/60 shadow-lg p-3" style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}>

          {/* If reduced motion: show a static horizontally scrollable grid */}
          {shouldReduceMotion && (
            <div className="flex gap-4 overflow-x-auto py-4 px-2 scrollbar-hide">
              {images.map((img) => (
                <div key={img.id} className="min-w-[220px] h-40 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl font-bold" style={{ background: 'linear-gradient(180deg,#FFD59E,#F6A04D)' }} title={img.alt}>
                  {img.emoji || '🖼️'}
                </div>
              ))}
            </div>
          )}

          {/* Animated continuous track */}
          {!shouldReduceMotion && (
            <motion.div
              ref={trackRef}
              className="flex gap-4 items-center py-4 px-2"
              // animate x from 0 to -50% of track width using CSS transform; we use a fast linear infinite loop
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: Math.max(10, 100 / speed) }}
            >
              {items.map((img, idx) => (
                <motion.button
                  key={`${img.id}-${idx}`}
                  whileTap={{ scale: 0.96 }}
                  className="min-w-[240px] h-44 rounded-lg flex-shrink-0 overflow-hidden relative shadow-md focus:outline-none"
                  aria-label={img.alt}
                  onClick={() => {
                    // simple UX: scroll the image into center — can be replaced with modal/gallery lightbox
                    const el = trackRef.current?.children[idx];
                    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                  }}
                >
                  {/* placeholder art */}
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white" style={{ background: 'linear-gradient(135deg, rgba(251,113,133,0.95), rgba(253,186,116,0.9))' }}>
                    {img.emoji || '🖼️'}
                  </div>

                  {/* subtle overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-sm text-white/95 font-semibold drop-shadow-sm">{img.alt}</div>
                </motion.button>
              ))}
            </motion.div>
          )}

        </div>

        {/* small caption and CTA */}
        <div className="mt-4 text-sm text-neutral-500 flex items-center justify-between">
          <div>Swipe or hover to explore — images capture the kitchen’s energy.</div>
          <div className="hidden sm:block text-amber-600 font-medium">Want prints? <a href="#contact" className="underline">Contact us</a></div>
        </div>
      </div>
    </section>
  );
}
