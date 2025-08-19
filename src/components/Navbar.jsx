'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useMotionValue } from 'framer-motion';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // pointer-based parallax
  const containerRef = useRef(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

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
    <div className="bg-gradient-to-b from-[#fffaf0] to-white/90">
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
    </div>
  );
}
