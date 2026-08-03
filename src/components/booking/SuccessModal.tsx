"use client";

import { motion } from "framer-motion";
import { CheckCircle, X, MapPin, Navigation, Calendar, Clock, Phone, User } from "lucide-react";

interface SuccessModalProps {
  name: string;
  phone: string;
  pickup: string;
  dropoff: string;
  stops?: string[];
  date: string;
  time: string;
  distance: number;
  fare: number;
  onClose: () => void;
}

export default function SuccessModal({
  name, phone, pickup, dropoff, stops = [], date, time, distance, fare, onClose,
}: SuccessModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-navy to-navy-light p-8 text-center relative">
          <button onClick={onClose} aria-label="Close"
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <CheckCircle className="w-10 h-10 text-green-400" />
            </motion.div>
          </motion.div>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-extrabold text-white"
          >
            Booking Confirmed!
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-sm mt-2"
          >
            Your ride has been successfully booked.
          </motion.p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <DetailRow icon={<User className="w-4 h-4 text-crimson" />} label="Name" value={name} />
          <DetailRow icon={<Phone className="w-4 h-4 text-crimson" />} label="Phone" value={phone} />
          <DetailRow icon={<MapPin className="w-4 h-4 text-green-500" />} label="Pickup" value={pickup} />
          {stops.map((s, i) => (
            <DetailRow key={i} icon={<MapPin className="w-4 h-4 text-amber-500" />} label={`Stop ${i + 1}`} value={s} />
          ))}
          <DetailRow icon={<Navigation className="w-4 h-4 text-crimson" />} label="Drop-off" value={dropoff} />
          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={<Calendar className="w-4 h-4 text-gold" />} label="Date" value={date} />
            <DetailRow icon={<Clock className="w-4 h-4 text-gold" />} label="Time" value={time} />
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
            <div>
              <div className="text-navy/50 text-xs">Distance</div>
              <div className="text-navy font-semibold text-sm">{distance.toFixed(1)} miles</div>
            </div>
            <div className="text-right">
              <div className="text-navy/50 text-xs">Total Fare</div>
              <div className="text-2xl font-extrabold gradient-text">&pound;{fare.toFixed(2)}</div>
            </div>
          </div>

          <p className="text-navy/40 text-xs text-center">
            A confirmation will be sent to your phone. Our driver will contact you before pickup.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm cursor-pointer"
          >
            Done
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">
        <div className="text-navy/40 text-xs">{label}</div>
        <div className="text-navy font-medium text-sm truncate">{value}</div>
      </div>
    </div>
  );
}
