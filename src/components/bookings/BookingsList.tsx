"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car } from "lucide-react";
import BookingCard, { type Booking } from "@/components/bookings/BookingCard";

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
  { key: "recurring", label: "Recurring" },
];

function isActive(s: string) {
  return ["pending", "confirmed", "assigned", "accepted", "arrived", "in-progress"].includes(s);
}

export default function BookingsList({ bookings, loading }: { bookings: Booking[]; loading: boolean }) {
  const [tab, setTab] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = bookings.filter((b) => {
    if (tab === "active") return isActive(b.status);
    if (tab === "completed") return b.status === "completed";
    if (tab === "cancelled") return b.status === "cancelled";
    if (tab === "recurring") return b.isRecurring;
    return true;
  });

  const counts = {
    all: bookings.length,
    active: bookings.filter((b) => isActive(b.status)).length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    recurring: bookings.filter((b) => b.isRecurring).length,
  };

  return (
    <>
      <div className="flex gap-1.5 sm:gap-2 mb-5 sm:mb-6 overflow-x-auto pb-1 -mx-1 px-1">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 ${
              tab === t.key
                ? "bg-gradient-to-r from-gold/20 to-gold/10 text-gold border border-gold/30 shadow-lg shadow-gold/5"
                : "bg-white/[0.03] text-white/40 border border-white/[0.06] hover:border-white/15 hover:text-white/60"
            }`}>
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              tab === t.key ? "bg-gold/20 text-gold" : "bg-white/10 text-white/30"
            }`}>
              {counts[t.key as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      {!filtered.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <Car className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No bookings found.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((b, i) => (
              <BookingCard key={b.id} booking={b} index={i}
                expanded={expandedId === b.id}
                onToggle={() => setExpandedId(expandedId === b.id ? null : b.id)} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
