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
}

export default function BookingFareResult({
  result,
  pickup,
  paymentMethod,
  onPaymentMethodChange,
  onConfirm,
  saving,
}: BookingFareResultProps) {
  return (
    <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
      <div className="flex items-center gap-2 text-white/60 text-xs">
        <Route className="w-3.5 h-3.5 text-gold" /> {result.distance.toFixed(1)} miles
      </div>

      {isOutsideOfficeRadius(pickup.lat, pickup.lng) && (
        <div className="text-yellow-400/80 text-xs">
          +£{pickupSurcharge(pickup.lat, pickup.lng).toFixed(2)} out-of-area surcharge applied
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <PoundSterling className="w-5 h-5 text-gold" />
        <span className="text-3xl font-extrabold gradient-text">
          &pound;{result.fare.toFixed(2)}
        </span>
      </div>

      {/* Payment Method */}
      <div className="grid grid-cols-2 gap-2 mb-3">
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
