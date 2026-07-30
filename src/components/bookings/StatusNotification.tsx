"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Car, MapPin, Navigation, CheckCircle2, Clock, UserCheck } from "lucide-react";

interface StatusUpdate {
  bookingId: string;
  pickup: string;
  dropoff: string;
  oldStatus: string;
  newStatus: string;
}

const STATUS_CONFIG: Record<string, { icon: typeof Car; color: string; bg: string; title: string; message: string }> = {
  assigned: {
    icon: UserCheck, color: "text-purple-400", bg: "from-purple-500/20 to-purple-600/5",
    title: "Driver Assigned", message: "A driver has been assigned to your ride.",
  },
  accepted: {
    icon: UserCheck, color: "text-indigo-400", bg: "from-indigo-500/20 to-indigo-600/5",
    title: "Driver Accepted", message: "Your driver has accepted the ride and is on the way.",
  },
  arrived: {
    icon: MapPin, color: "text-cyan-400", bg: "from-cyan-500/20 to-cyan-600/5",
    title: "Driver Arrived", message: "Your driver has arrived at the pickup location.",
  },
  "in-progress": {
    icon: Navigation, color: "text-orange-400", bg: "from-orange-500/20 to-orange-600/5",
    title: "Ride Started", message: "Your ride is now in progress. Enjoy the journey!",
  },
  completed: {
    icon: CheckCircle2, color: "text-green-400", bg: "from-green-500/20 to-green-600/5",
    title: "Ride Completed", message: "Your ride has been completed. Thank you for choosing Shine Cars!",
  },
  confirmed: {
    icon: Clock, color: "text-blue-400", bg: "from-blue-500/20 to-blue-600/5",
    title: "Booking Confirmed", message: "Your booking has been confirmed by dispatch.",
  },
};

export default function StatusNotification({ update, onClose }: { update: StatusUpdate | null; onClose: () => void }) {
  const config = update ? STATUS_CONFIG[update.newStatus] : null;
  if (!config) return null;

  const Icon = config.icon;

  return (
    <AnimatePresence>
      {update && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm"
          >
            <div className={`relative rounded-2xl border border-white/10 bg-gradient-to-br ${config.bg} backdrop-blur-xl overflow-hidden`}>
              {/* Glow effect */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-20 ${config.color.replace("text-", "bg-")}`} />

              {/* Close button */}
              <button onClick={onClose}
                className="absolute top-3 right-3 text-white/30 hover:text-white/60 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <div className="relative p-6 pt-8 text-center">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.15, damping: 12 }}
                  className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${config.color.replace("text-", "bg-")}/10 ring-2 ${config.color.replace("text-", "ring-")}/30`}
                >
                  <Icon className={`w-8 h-8 ${config.color}`} />
                </motion.div>

                {/* Title & Message */}
                <h3 className="text-white text-xl font-bold mb-1.5">{config.title}</h3>
                <p className="text-white/50 text-sm mb-5">{config.message}</p>

                {/* Route info */}
                <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06] text-left mb-5">
                  <div className="flex gap-2.5">
                    <div className="flex flex-col items-center pt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <div className="w-px h-full bg-white/10 my-0.5 min-h-[16px]" />
                      <div className="w-2 h-2 rounded-full bg-crimson" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-white/70 text-xs truncate">{update.pickup}</p>
                      <p className="text-white/70 text-xs truncate">{update.dropoff}</p>
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-white/30">
                  <span className="uppercase tracking-wider">{update.oldStatus}</span>
                  <span className="text-white/15">&rarr;</span>
                  <span className={`uppercase tracking-wider font-semibold ${config.color}`}>{update.newStatus}</span>
                </div>
              </div>

              {/* Dismiss button */}
              <div className="px-6 pb-5">
                <button onClick={onClose}
                  className={`w-full py-3 rounded-xl font-semibold text-sm text-white ${config.color.replace("text-", "bg-")}/20 hover:${config.color.replace("text-", "bg-")}/30 border border-white/10 transition-all cursor-pointer`}>
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
