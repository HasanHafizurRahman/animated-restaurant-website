'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// helpers
function minutesFromHM(hm) {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
}
function formatHM(totalMin) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function ReserveSection({
  openTime = '11:30',
  closeTime = '22:00',
  intervalMinutes = 30,
  heroIllustration = null, // optional JSX or null
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [party, setParty] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(null);

  const shouldReduceMotion = useReducedMotion();
  const firstInputRef = useRef(null);

  // generate slots once unless inputs change
  const slots = useMemo(() => {
    const start = minutesFromHM(openTime);
    const end = minutesFromHM(closeTime);
    const arr = [];
    for (let t = start; t <= end; t += intervalMinutes) arr.push(formatHM(t));
    return arr;
  }, [openTime, closeTime, intervalMinutes]);

  // disable past times when selected date is today
  const disabledMap = useMemo(() => {
    const map = {};
    const today = new Date().toISOString().slice(0, 10);
    if (date !== today) return map;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    for (const s of slots) {
      const m = minutesFromHM(s);
      if (m <= nowMin - 15) map[s] = true; // slot considered unavailable if more than 15 minutes passed
    }
    return map;
  }, [date, slots]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    // focus first input when modal opens
    if (open && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [open]);

  function resetForm() {
    setName('');
    setPhone('');
    setParty(2);
    setSelectedSlot(null);
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!name.trim() || !phone.trim() || !date || !selectedSlot) {
      // small inline validation UI would be nicer, keep alert for now
      alert('Please fill name, phone, date and select a time slot.');
      return;
    }

    setSending(true);
    try {
      // simulate network call
      await new Promise((r) => setTimeout(r, 800));
      const msg = `Reservation confirmed — ${date} at ${selectedSlot} for ${party} people.`;
      setSuccess(msg);
      resetForm();

      // leave toast visible, close modal after short delay
      setTimeout(() => {
        setOpen(false);
      }, 900);

      // auto hide success toast after a bit
      setTimeout(() => setSuccess(null), 4200);
    } catch (err) {
      console.error(err);
      alert('Something went wrong — try again.');
    } finally {
      setSending(false);
    }
  }

  // small helpers for party size
  function incParty() {
    setParty((p) => Math.min(20, p + 1));
  }
  function decParty() {
    setParty((p) => Math.max(1, p - 1));
  }

  // small animation variants
  const container = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.06 } },
  };
  const slotVariant = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      <div className="rounded-2xl bg-gradient-to-r from-amber-50/90 to-white p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-lg items-center">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-extrabold">Reserve a table — fast & flexible</h3>
          <p className="text-neutral-700 mt-1 max-w-xl">Select date and time, choose party size, and we’ll prepare the table. Live-fire nights fill up quickly — act fast.</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white/60 border border-amber-100 rounded-full px-3 py-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-amber-600" xmlns="http://www.w3.org/2000/svg"><path d="M12 8v4l3 3" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div className="text-sm text-neutral-700">Open: <span className="font-semibold">{openTime}</span> — <span className="font-semibold">{closeTime}</span></div>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/60 border border-amber-100 rounded-full px-3 py-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v20" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round"/></svg>
              <div className="text-sm text-neutral-700">Slots every <span className="font-semibold">{intervalMinutes}m</span></div>
            </div>

            <div className="inline-flex items-center gap-2 bg-amber-600 text-white rounded-full px-3 py-2 ml-auto cursor-default">
              <div className="text-sm font-semibold">Quick Reserve</div>
            </div>
          </div>

          {/* quick summary of current reservation choices */}
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-lg bg-white px-3 py-2 border border-neutral-100 text-sm">{date}</div>
            <div className="rounded-lg bg-white px-3 py-2 border border-neutral-100 text-sm">{selectedSlot ?? 'No time selected'}</div>
            <div className="rounded-lg bg-white px-3 py-2 border border-neutral-100 text-sm">{party} {party === 1 ? 'guest' : 'guests'}</div>

            <button onClick={() => setOpen(true)} className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600 text-white font-semibold shadow hover:shadow-md transition">Open reserve</button>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-end justify-center gap-4">
          {/* a simple decorative illustration area (can accept custom prop) */}
          <div className="w-48 h-48 rounded-2xl bg-gradient-to-tr from-amber-50 to-white border border-amber-100 p-4 flex items-center justify-center">
            {heroIllustration || (
              <svg width="96" height="96" viewBox="0 0 24 24" fill="none" className="opacity-90" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16v10H4z" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 11h8" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
          </div>

          <div className="text-xs text-neutral-500">We hold the table for 15 minutes after reservation time.</div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

            <motion.div
              className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-label="Reserve a table"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* left panel: decorative + quick instructions */}
                <div className="rounded-xl bg-amber-50 p-4 flex flex-col gap-3 justify-between">
                  <div>
                    <h4 className="text-lg font-bold">Reserve a table</h4>
                    <p className="text-sm text-neutral-600 mt-1">Choose date & time — we’ll hold the table for 15 minutes past reservation.</p>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">Selected</span>
                        <span className="text-neutral-500">{date} • {selectedSlot ?? '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">Party</span>
                        <span className="text-neutral-500">{party} {party === 1 ? 'guest' : 'guests'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-neutral-500">Tip: pick an earlier slot to secure an outdoor table on busy nights.</div>
                </div>

                {/* right panel: form */}
                <form onSubmit={handleSubmit} className="p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Your name</label>
                      <input ref={firstInputRef} value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2" placeholder="Full name" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-neutral-700">Phone</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2" placeholder="e.g. +8801xxxxxxxxx" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-neutral-700">Date</label>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-neutral-700">Party size</label>
                      <div className="mt-2 inline-flex items-center gap-2">
                        <button type="button" onClick={decParty} className="px-3 py-2 rounded-lg border border-neutral-200">−</button>
                        <div className="px-3 py-2 rounded-lg border border-neutral-200 min-w-[56px] text-center">{party}</div>
                        <button type="button" onClick={incParty} className="px-3 py-2 rounded-lg border border-neutral-200">+</button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium text-neutral-700">Available time slots</label>

                      <motion.div initial="hidden" animate="show" variants={container} className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {slots.map((t, i) => {
                          const disabled = !!disabledMap[t];
                          const active = selectedSlot === t;
                          return (
                            <motion.button
                              key={t}
                              type="button"
                              onClick={() => !disabled && setSelectedSlot(t)}
                              variants={slotVariant}
                              whileHover={shouldReduceMotion || disabled ? {} : { scale: 1.06 }}
                              whileTap={shouldReduceMotion || disabled ? {} : { scale: 0.96 }}
                              className={`px-2 py-2 rounded-lg text-sm border text-center transition-colors ${disabled ? 'bg-neutral-100 text-neutral-400 border-neutral-100 cursor-not-allowed' : active ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}
                              aria-pressed={active}
                              aria-disabled={disabled}
                            >
                              {t}
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-3 justify-end">
                      <button type="button" onClick={() => { resetForm(); setOpen(false); }} className="px-4 py-2 rounded-lg border border-neutral-200">Cancel</button>
                      <button type="submit" disabled={sending} className="px-6 py-2 rounded-lg bg-amber-600 text-white font-semibold shadow-md">{sending ? 'Sending…' : 'Confirm'}</button>
                    </div>

                    {success && (
                      <div className="sm:col-span-2 text-sm text-green-700 font-medium">{success}</div>
                    )}

                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* toast-style success (floating) */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.24 }} className="fixed right-6 top-6 z-50">
            <div className="rounded-lg bg-white px-4 py-3 shadow-lg border border-green-100 text-green-800 font-medium">{success}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
