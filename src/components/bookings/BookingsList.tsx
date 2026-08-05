"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Navigation, Calendar, Clock, Car, PoundSterling,
  CreditCard, Banknote, Route, ChevronDown, Phone, MessageCircle,
} from "lucide-react";

interface Booking {
  id: string;
  pickup: string;
  dropoff: string;
  stops?: string | null;
  date: string;
  time: string;
  distance: number;
  fare: number;
  vehicle: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  fareType?: string;
  meterFare?: number | null;
  createdAt: string;
  driver?: { name: string; phone: string } | null;
}

const STATUS_STYLES: Record<string, { bg: string; dot: string }> = {
  pending: { bg: "bg-yellow-500/10 text-yellow-400", dot: "bg-yellow-400" },
  confirmed: { bg: "bg-blue-500/10 text-blue-400", dot: "bg-blue-400" },
  assigned: { bg: "bg-purple-500/10 text-purple-400", dot: "bg-purple-400" },
  accepted: { bg: "bg-indigo-500/10 text-indigo-400", dot: "bg-indigo-400" },
  arrived: { bg: "bg-cyan-500/10 text-cyan-400", dot: "bg-cyan-400" },
  "in-progress": { bg: "bg-orange-500/10 text-orange-400", dot: "bg-orange-400 animate-pulse" },
  completed: { bg: "bg-green-500/10 text-green-400", dot: "bg-green-400" },
  cancelled: { bg: "bg-red-500/10 text-red-400", dot: "bg-red-400" },
};

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
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
    return true;
  });

  const counts = {
    all: bookings.length,
    active: bookings.filter((b) => isActive(b.status)).length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <>
      {/* Tabs */}
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

      {/* List */}
      {!filtered.length ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-20">
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

function BookingCard({ booking: b, index, expanded, onToggle }: {
  booking: Booking; index: number; expanded: boolean; onToggle: () => void;
}) {
  const style = STATUS_STYLES[b.status] || STATUS_STYLES.pending;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.04 }}
      onClick={onToggle}
      className="rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] overflow-hidden cursor-pointer hover:border-white/15 transition-all group"
    >
      {/* Main Row */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${style.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
            </span>
            <span className={`text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full ${
              b.vehicle === "mpv" || b.vehicle === "MPV"
                ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
            }`}>
              {b.vehicle.toUpperCase()}
            </span>
            {b.fareType === "meter" && (
              <span className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-orange-500/10 text-orange-400">
                METER
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-gold font-bold text-base sm:text-lg">
              {b.fareType === "meter" && !b.meterFare
                ? `£${(b.fare * 0.9).toFixed(2)} – £${(b.fare * 1.1).toFixed(2)}`
                : `£${(b.meterFare ?? b.fare).toFixed(2)}`}
            </span>
            <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`} />
          </div>
        </div>

        {/* Route */}
        <RouteDisplay booking={b} />
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <DetailItem icon={Calendar} label="Date" value={b.date} />
                <DetailItem icon={Clock} label="Time" value={b.time} />
                <DetailItem icon={Route} label="Distance" value={`${b.distance.toFixed(1)} mi`} />
                <DetailItem
                  icon={b.paymentMethod === "card" ? CreditCard : Banknote}
                  label="Payment"
                  value={`${b.paymentMethod.toUpperCase()} — ${b.paymentStatus.toUpperCase()}`}
                />
              </div>
              {b.fareType === "meter" && (
                <p className="text-orange-400/70 text-xs mt-3">
                  {b.meterFare ? `Meter fare: £${b.meterFare.toFixed(2)}` : "Estimated fare — final amount based on actual meter distance"}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="px-4 sm:px-5 py-3 bg-white/[0.02] border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-0">
        <div className="flex items-center gap-4 text-white/30 text-xs">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(b.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {b.distance.toFixed(0)} mi
          </span>
          {b.driver && (
            <span className="flex items-center gap-1 text-purple-400/70">
              <Car className="w-3 h-3" /> {b.driver.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
          {b.driver ? (
            <>
              <a href={`tel:${b.driver.phone}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 pl-2 pr-3 py-2 sm:py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/10 border border-purple-400/25 text-purple-300 text-xs font-semibold hover:from-purple-500/30 hover:to-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10 transition-all">
                <span className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <Phone className="w-2.5 h-2.5" />
                </span>
                Call Driver
              </a>
              <a href={`https://wa.me/${b.driver.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 pl-2 pr-3 py-2 sm:py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-600/10 border border-green-400/25 text-green-300 text-xs font-semibold hover:from-green-500/30 hover:to-emerald-600/20 hover:shadow-lg hover:shadow-green-500/10 transition-all">
                <span className="w-5 h-5 rounded-full bg-green-500/30 flex items-center justify-center">
                  <MessageCircle className="w-2.5 h-2.5" />
                </span>
                WhatsApp Driver
              </a>
            </>
          ) : (
            <>
              <a href="tel:+441945243006"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 pl-2 pr-3 py-2 sm:py-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-400/25 text-blue-300 text-xs font-semibold hover:from-blue-500/30 hover:to-blue-600/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                <span className="w-5 h-5 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <Phone className="w-2.5 h-2.5" />
                </span>
                Call Us
              </a>
              <a href="https://wa.me/441945243006" target="_blank" rel="noopener noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 pl-2 pr-3 py-2 sm:py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-600/10 border border-green-400/25 text-green-300 text-xs font-semibold hover:from-green-500/30 hover:to-emerald-600/20 hover:shadow-lg hover:shadow-green-500/10 transition-all">
                <span className="w-5 h-5 rounded-full bg-green-500/30 flex items-center justify-center">
                  <MessageCircle className="w-2.5 h-2.5" />
                </span>
                WhatsApp
              </a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RouteDisplay({ booking: b }: { booking: Booking }) {
  const parsedStops: string[] = b.stops ? (() => { try { return JSON.parse(b.stops); } catch { return []; } })() : [];
  const points = [
    { label: "Pickup", address: b.pickup, color: "bg-green-400", ring: "ring-green-400/10" },
    ...parsedStops.map((s: string, i: number) => ({ label: `Stop ${i + 1}`, address: s, color: "bg-amber-400", ring: "ring-amber-400/10" })),
    { label: "Drop-off", address: b.dropoff, color: "bg-crimson", ring: "ring-crimson/10" },
  ];
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-1">
        {points.map((p, i) => (
          <div key={i} className="flex flex-col items-center">
            {i > 0 && <div className="w-px h-5 bg-gradient-to-b from-white/20 to-white/10" />}
            <div className={`w-2.5 h-2.5 rounded-full ${p.color} ring-4 ${p.ring}`} />
          </div>
        ))}
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        {points.map((p, i) => (
          <div key={i}>
            <div className="text-white/30 text-[10px] uppercase tracking-widest font-medium">{p.label}</div>
            <div className="text-white text-xs sm:text-sm font-medium leading-snug line-clamp-2">{p.address}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
      <Icon className="w-3.5 h-3.5 text-white/25 mb-1.5" />
      <div className="text-white/35 text-[10px] uppercase tracking-wider">{label}</div>
      <div className="text-white text-sm font-medium mt-0.5">{value}</div>
    </div>
  );
}
