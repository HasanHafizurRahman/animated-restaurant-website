'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

function minutesFromHM(hm) {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
}

function formatHM(totalMin) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export default function ReserveSection({ openTime = '11:30', closeTime = '22:00', intervalMinutes = 30 }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [party, setParty] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(null);

  const shouldReduceMotion = useReducedMotion();

  const slots = useMemo(() => {
    const start = minutesFromHM(openTime);
    const end = minutesFromHM(closeTime);
    const arr = [];
    for (let t = start; t <= end; t += intervalMinutes) {
      arr.push(formatHM(t));
    }
    return arr;
  }, [openTime, closeTime, intervalMinutes]);

  function resetForm() {
    setName('');
    setPhone('');
    setParty(2);
    setSelectedSlot(null);
  }

  async function handleSubmit(e) {
    e?.preventDefault();
    if (!name || !phone || !date || !selectedSlot) {
      alert('Please fill name, phone, date and select a time slot.');
      return;
    }

    // Simulate sending; replace this block with your API call
    setSending(true);
    try {
      await new Promise((res) => setTimeout(res, 700));
      setSuccess(`Reservation confirmed — ${date} at ${selectedSlot} for ${party} people.`);
      resetForm();
      setTimeout(() => setOpen(false), 900); // close after success feedback
    } catch (err) {
      console.error(err);
      alert('Something went wrong — try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
      <div className="rounded-2xl bg-amber-50/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <h3 className="text-2xl font-extrabold">Reserve a table — fast & flexible</h3>
          <p className="text-neutral-700 mt-1 max-w-xl">Select date and time, choose party size, and we’ll prepare the table. Live-fire nights fill up quickly — act fast.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-600 text-white font-semibold shadow-md hover:scale-105 transition-transform"
            aria-haspopup="dialog"
          >
            Quick Reserve
          </button>

          <a href="#contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-200 text-amber-700 hover:bg-amber-50 transition">Call Us</a>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label="Reserve a table"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold">Reserve a table</h4>
                  <p className="text-sm text-neutral-500">Choose date & time — we’ll hold the table for 15 minutes past reservation.</p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
                  aria-label="Close reservation dialog"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Your name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2" placeholder="Full name" />
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
                  <select value={party} onChange={(e) => setParty(Number(e.target.value))} className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} person{ i > 0 ? 's' : '' }</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-neutral-700">Available time slots</label>

                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {slots.map((t) => (
                      <motion.button
                        key={t}
                        type="button"
                        onClick={() => setSelectedSlot(t)}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.06 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className={`px-2 py-2 rounded-lg text-sm border ${selectedSlot === t ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'}`}
                        aria-pressed={selectedSlot === t}
                      >
                        {t}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 justify-end">
                  <button type="button" onClick={() => { resetForm(); setOpen(false); }} className="px-4 py-2 rounded-lg border border-neutral-200">Cancel</button>
                  <button type="submit" disabled={sending} className="px-6 py-2 rounded-lg bg-amber-600 text-white font-semibold shadow-md">{sending ? 'Sending…' : 'Confirm'}</button>
                </div>

                {success && (
                  <div className="sm:col-span-2 text-sm text-green-700 font-medium">{success}</div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
