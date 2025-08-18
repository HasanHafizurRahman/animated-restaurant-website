"use client"
import { useReducedMotion } from "framer-motion";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email) return;
    // simulate subscribe
    setSent(true);
    setTimeout(() => setSent(false), 2200);
    setEmail('');
  }

  return (
    <footer className="bg-neutral-900 text-neutral-200 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <h3 className="text-xl font-bold text-white">Aroma & Co.</h3>
          <p className="text-sm text-neutral-400 mt-2 max-w-sm">Wood-fired kitchen, seasonal produce, and theatrical plating. Come hungry.</p>

          <div className="mt-4 text-sm text-neutral-400">
            <div>📍 12 Ember Lane, Dhaka</div>
            <div>📞 +8801XXXXXXXXX</div>
            <div>✉️ hello@aroma.co</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white">Opening hours</h4>
          <div className="mt-3 text-sm text-neutral-400">
            <div>Mon — Fri: 11:30 — 22:00</div>
            <div>Sat — Sun: 12:00 — 23:00</div>
          </div>

          <h4 className="mt-6 font-semibold text-white">Quick links</h4>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <a href="#menu" className="hover:underline">Menu</a>
            <a href="#reserve" className="hover:underline">Reserve</a>
            <a href="#contact" className="hover:underline">Contact</a>
            <a href="#about" className="hover:underline">Private Dining</a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white">Join our list</h4>
          <p className="text-sm text-neutral-400 mt-2">Get news, events, and special menus — fast updates with occasional surprises.</p>

          <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="w-full rounded-lg px-3 py-2 text-neutral-900" />
            <button type="submit" className={`px-4 py-2 rounded-lg ${sent ? 'bg-emerald-500' : 'bg-amber-600'} text-white font-semibold`}>
              {sent ? 'Thanks!' : 'Subscribe'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-sm text-neutral-400">
            <a href="#" aria-label="Instagram" className="hover:text-white">Instagram</a>
            <a href="#" aria-label="Facebook" className="hover:text-white">Facebook</a>
            <a href="#" aria-label="Twitter" className="hover:text-white">X</a>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 py-4">
        <div className="max-w-7xl mx-auto px-6 text-xs text-neutral-500 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Aroma & Co. — All rights reserved.</div>
          <div>Built with Next.js & Framer Motion</div>
        </div>
      </div>
    </footer>
  );
}