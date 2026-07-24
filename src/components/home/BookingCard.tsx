"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Navigation } from "lucide-react";

export default function BookingCard() {
  return (
    <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/20">
      <h3 className="text-white font-bold text-lg mb-1">Book Your Ride</h3>
      <p className="text-white/60 text-sm mb-6">Get a quote in seconds</p>

      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3.5 border border-white/10 focus-within:border-gold/40 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-green-400" />
          </div>
          <label htmlFor="pickup" className="sr-only">Pickup Location</label>
          <input
            id="pickup"
            type="text"
            placeholder="Pickup Location"
            className="bg-transparent text-white text-sm placeholder:text-white/35 outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3.5 border border-white/10 focus-within:border-gold/40 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-crimson/20 flex items-center justify-center shrink-0">
            <Navigation className="w-4 h-4 text-crimson" />
          </div>
          <label htmlFor="dropoff" className="sr-only">Drop-off Location</label>
          <input
            id="dropoff"
            type="text"
            placeholder="Drop-off Location"
            className="bg-transparent text-white text-sm placeholder:text-white/35 outline-none w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl px-4 py-3.5 border border-white/10">
            <label htmlFor="date" className="sr-only">Date</label>
            <input
              id="date"
              type="text"
              placeholder="Date"
              className="bg-transparent text-white text-sm placeholder:text-white/35 outline-none w-full"
            />
          </div>
          <div className="bg-white/10 rounded-xl px-4 py-3.5 border border-white/10">
            <label htmlFor="time" className="sr-only">Time</label>
            <input
              id="time"
              type="text"
              placeholder="Time"
              className="bg-transparent text-white text-sm placeholder:text-white/35 outline-none w-full"
            />
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label="Get instant quote for your ride"
        className="w-full mt-5 py-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-crimson/25 hover:shadow-crimson/40 transition-shadow cursor-pointer"
      >
        Get Instant Quote <ArrowRight className="w-4 h-4" />
      </motion.button>

      <p className="text-center text-white/50 text-xs mt-4">
        No hidden fees. Free cancellation up to 1hr before.
      </p>
    </div>
  );
}
