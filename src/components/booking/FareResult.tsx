"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Route, PoundSterling, ArrowRight } from "lucide-react";
import SuccessModal from "@/components/booking/SuccessModal";

interface FareResultProps {
  pickup: string;
  dropoff: string;
  distanceMiles: number;
  fare: number;
  vehicle?: string;
  surcharge?: boolean;
  name: string;
  phone: string;
  date: string;
  time: string;
  onReset?: () => void;
}

export default function FareResult({
  pickup, dropoff, distanceMiles, fare, vehicle, surcharge, name, phone, date, time, onReset,
}: FareResultProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [booked, setBooked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [fare]);

  const confirmBooking = async () => {
    setSaving(true);
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone, pickup, dropoff, date, time,
          distance: distanceMiles, fare, source: "booking-page",
        }),
      });
    } catch {}
    setSaving(false);
    setBooked(true);
  };

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 rounded-2xl bg-gradient-to-br from-navy to-navy-light p-6 sm:p-8 text-white"
      >
        <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
          <PoundSterling className="w-5 h-5 text-gold" />
          Fare Estimate
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-white/50 text-xs">Pickup</div>
              <div className="text-sm font-medium">{pickup}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Navigation className="w-4 h-4 text-crimson mt-0.5 shrink-0" />
            <div>
              <div className="text-white/50 text-xs">Drop-off</div>
              <div className="text-sm font-medium">{dropoff}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Route className="w-4 h-4 text-gold mt-0.5 shrink-0" />
            <div>
              <div className="text-white/50 text-xs">Distance</div>
              <div className="text-sm font-medium">{distanceMiles.toFixed(1)} miles</div>
            </div>
          </div>
          {vehicle && (
            <div className="flex items-start gap-3">
              <Route className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <div>
                <div className="text-white/50 text-xs">Vehicle</div>
                <div className="text-sm font-medium">{vehicle}</div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 pt-5 mb-5 flex items-end justify-between">
          <div>
            <div className="text-white/50 text-xs mb-1">Estimated Fare</div>
            <div className="text-4xl font-extrabold gradient-text">
              &pound;{fare.toFixed(2)}
            </div>
            {surcharge && (
              <div className="text-yellow-400/80 text-xs mt-1">
                Includes £2.00 out-of-area surcharge
              </div>
            )}
          </div>
          <div className="text-white/40 text-xs text-right max-w-[180px]">
            Final fare may vary based on traffic, waiting time, and route changes.
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={confirmBooking}
          disabled={saving}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-green-500/20 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Confirm Booking"} {!saving && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {booked && (
          <SuccessModal
            name={name} phone={phone}
            pickup={pickup} dropoff={dropoff}
            date={date} time={time}
            distance={distanceMiles} fare={fare}
            onClose={() => { setBooked(false); onReset?.(); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
