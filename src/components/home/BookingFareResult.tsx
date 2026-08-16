"use client";

import { motion } from "framer-motion";
import {
  ArrowRight, MapPin, Navigation, Route, PoundSterling,
  Banknote, CreditCard,
} from "lucide-react";
import { isOutsideOfficeRadius, pickupSurcharge } from "@/lib/fare";

interface BookingFareResultProps {
  result: { distance: number; fare: number };
  pickup: { address: string; lat: number; lng: number };
  paymentMethod: "cash" | "card";
  onPaymentMethodChange: (method: "cash" | "card") => void;
  onConfirm: () => void;
  saving: boolean;
  activeEvent?: { name: string; increasePercent: number } | null;
}

export default function BookingFareResult({
  result,
  pickup,
  paymentMethod,
  onPaymentMethodChange,
  onConfirm,
  saving,
  activeEvent,
}: BookingFareResultProps) {
  return (
    <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
      {result.distance > 0 && (
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <Route className="w-3.5 h-3.5 text-gold" /> {result.distance.toFixed(1)} miles
        </div>
      )}

      {isOutsideOfficeRadius(pickup.lat, pickup.lng) && (
        <div className="text-yellow-400/80 text-xs">
          +£{pickupSurcharge(pickup.lat, pickup.lng).toFixed(2)} out-of-area surcharge applied
        </div>
      )}

      {activeEvent && (
        <div className="flex items-center gap-2 text-amber-400/90 text-xs">
          <span className="font-bold">{activeEvent.name}</span>
          <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">+{activeEvent.increasePercent}% applied</span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-1">
        <PoundSterling className="w-5 h-5 text-gold" />
        {result.fare === 0 ? (
          <span className="text-xl font-bold text-white/70">Fare confirmed by dispatch</span>
        ) : paymentMethod === "cash" ? (
          <span className="text-3xl font-extrabold gradient-text">
            &pound;{(result.fare * 0.9).toFixed(2)} – £{(result.fare * 1.1).toFixed(2)}
          </span>
        ) : (
          <span className="text-3xl font-extrabold gradient-text">
            &pound;{result.fare.toFixed(2)}
          </span>
        )}
      </div>
      {result.fare === 0 && (
        <p className="text-white/40 text-xs mb-2">Manual address — our team will confirm your fare</p>
      )}
      {result.fare > 0 && paymentMethod === "cash" && (
        <p className="text-white/40 text-xs mb-2">Meter fare — final amount based on actual distance</p>
      )}

      {/* Payment Method */}
      <div className={`grid grid-cols-2 gap-2 mb-3 ${result.fare === 0 ? "hidden" : ""}`}>
        <button
          type="button"
          onClick={() => onPaymentMethodChange("cash")}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 border text-xs font-medium transition-all cursor-pointer ${
            paymentMethod === "cash"
              ? "bg-gold/20 border-gold/50 text-gold"
              : "bg-white/10 border-white/10 text-white/60 hover:border-white/25"
          }`}
        >
          <Banknote className="w-3.5 h-3.5" /> Cash
        </button>
        <button
          type="button"
          onClick={() => onPaymentMethodChange("card")}
          className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 border text-xs font-medium transition-all cursor-pointer ${
            paymentMethod === "card"
              ? "bg-gold/20 border-gold/50 text-gold"
              : "bg-white/10 border-white/10 text-white/60 hover:border-white/25"
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" /> Card
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onConfirm}
        disabled={saving}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
      >
        {saving
          ? paymentMethod === "card" ? "Redirecting..." : "Saving..."
          : paymentMethod === "card" ? "Pay with Card" : "Confirm Booking"}
        {!saving && <ArrowRight className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}
