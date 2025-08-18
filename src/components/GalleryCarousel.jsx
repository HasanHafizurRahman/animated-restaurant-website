'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

const sampleImages = [
  { id: 1, src: '/images/gallery1.jpg', alt: 'Wood-fired grill — Ember glow' },
  { id: 2, src: '/images/gallery2.jpg', alt: 'Plating closeup — Textures' },
  { id: 3, src: '/images/gallery3.jpg', alt: 'Seasonal produce — Market' },
  { id: 4, src: '/images/gallery4.jpg', alt: 'Dessert — Sweet finish' },
  { id: 5, src: '/images/gallery5.jpg', alt: 'Cocktail — Spirited pour' },
];

export default function GalleryCarousel({ images = sampleImages, speed = 40 }) {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef(null);

  // Duplicate list for seamless loop
  const items = [...images, ...images];

  // Compute a sane duration (lower -> faster). This simple formula gives a snappy feel.
  const duration = Math.max(8, 120 / speed);

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
        <div className="overflow-hidden rounded-2xl bg-white/60 shadow-lg p-3" style={{ WebkitBackdropFilter: 'blur(6px)', backdropFilter: 'blur(6px)' }}>

          {shouldReduceMotion && (
            <div className="flex gap-4 overflow-x-auto py-4 px-2 scrollbar-hide">
              {images.map((img) => (
                <div key={img.id} className="min-w-[220px] h-40 rounded-lg flex-shrink-0 relative overflow-hidden bg-neutral-100">
                  <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="(max-width: 640px) 220px, 320px" priority={false} />
                  <div className="absolute bottom-2 left-3 text-sm text-white font-semibold drop-shadow-sm">{img.alt}</div>
                </div>
              ))}
            </div>
          )}

          {!shouldReduceMotion && (
            <motion.div
              ref={trackRef}
              className="flex gap-4 items-center py-4 px-2"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration }}
            >
              {items.map((img, idx) => (
                <motion.button
                  key={`${img.src}-${idx}`}
                  whileTap={{ scale: 0.96 }}
                  className="min-w-[240px] h-44 rounded-lg flex-shrink-0 overflow-hidden relative shadow-md focus:outline-none"
                  aria-label={img.alt}
                  onClick={() => {
                    // Simple focus behavior — for a real lightbox, replace this with modal open logic
                    const el = trackRef.current?.children[idx];
                    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                  }}
                >
                  <div className="absolute inset-0">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 240px, 360px"
                      // allow passing a blurDataURL in the image object for a nicer LCP experience
                      {...(img.blurDataURL ? { placeholder: 'blur', blurDataURL: img.blurDataURL } : {})}
                    />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-sm text-white/95 font-semibold drop-shadow-sm">{img.alt}</div>
                </motion.button>
              ))}
            </motion.div>
          )}

        </div>

        <div className="mt-4 text-sm text-neutral-500 flex items-center justify-between">
          <div>Swipe or hover to explore — images capture the kitchen’s energy.</div>
          <div className="hidden sm:block text-amber-600 font-medium">Want prints? <a href="#contact" className="underline">Contact us</a></div>
        </div>
      </div>
    </section>
  );
}
