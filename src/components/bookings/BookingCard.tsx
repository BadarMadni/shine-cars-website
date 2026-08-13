"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Calendar, Clock, Car, CreditCard, Banknote,
  Route, ChevronDown, Phone, MessageCircle, Repeat,
} from "lucide-react";

export interface Booking {
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
  isRecurring?: boolean;
  createdAt: string;
  driver?: { name: string; phone: string; vehicleMake?: string | null; vehicleColor?: string | null } | null;
}

export const STATUS_STYLES: Record<string, { bg: string; dot: string }> = {
  pending: { bg: "bg-yellow-500/10 text-yellow-400", dot: "bg-yellow-400" },
  confirmed: { bg: "bg-blue-500/10 text-blue-400", dot: "bg-blue-400" },
  assigned: { bg: "bg-purple-500/10 text-purple-400", dot: "bg-purple-400" },
  accepted: { bg: "bg-indigo-500/10 text-indigo-400", dot: "bg-indigo-400" },
  arrived: { bg: "bg-cyan-500/10 text-cyan-400", dot: "bg-cyan-400" },
  "in-progress": { bg: "bg-orange-500/10 text-orange-400", dot: "bg-orange-400 animate-pulse" },
  completed: { bg: "bg-green-500/10 text-green-400", dot: "bg-green-400" },
  cancelled: { bg: "bg-red-500/10 text-red-400", dot: "bg-red-400" },
};

export default function BookingCard({ booking: b, index, expanded, onToggle }: {
  booking: Booking; index: number; expanded: boolean; onToggle: () => void;
}) {
  const style = STATUS_STYLES[b.status] || STATUS_STYLES.pending;

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }} transition={{ delay: index * 0.04 }} onClick={onToggle}
      className="rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] overflow-hidden cursor-pointer hover:border-white/15 transition-all group">
      <div className="p-4 sm:p-5">
        <div className="flex items-start sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${style.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
            </span>
            <span className={`text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full ${
              b.vehicle === "mpv" || b.vehicle === "MPV" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
            }`}>{b.vehicle.toUpperCase()}</span>
            {b.fareType === "meter" && (
              <span className="text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-orange-500/10 text-orange-400">METER</span>
            )}
            {b.isRecurring && (
              <span className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-purple-500/10 text-purple-400">
                <Repeat className="w-3 h-3" /> RECURRING
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-gold font-bold text-base sm:text-lg">
              {b.fareType === "meter" && !b.meterFare
                ? `£${(b.fare * 0.9).toFixed(2)} – £${(b.fare * 1.1).toFixed(2)}`
                : `£${(b.meterFare ?? b.fare).toFixed(2)}`}
            </span>
            <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </div>
        </div>
        <RouteDisplay booking={b} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <DetailItem icon={Calendar} label="Date" value={b.date} />
                <DetailItem icon={Clock} label="Time" value={b.time} />
                <DetailItem icon={Route} label="Distance" value={`${b.distance.toFixed(1)} mi`} />
                <DetailItem icon={b.paymentMethod === "card" ? CreditCard : Banknote} label="Payment"
                  value={`${b.paymentMethod.toUpperCase()} — ${b.paymentStatus.toUpperCase()}`} />
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

      <div className="px-4 sm:px-5 py-3 bg-white/[0.02] border-t border-white/[0.05] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 sm:gap-0">
        <div className="flex items-center gap-4 text-white/30 text-xs">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
            {new Date(b.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {b.distance.toFixed(0)} mi</span>
          {b.driver && <>
            <span className="flex items-center gap-1 text-purple-400/70"><Car className="w-3 h-3" /> {b.driver.name}</span>
            {(b.driver.vehicleMake || b.driver.vehicleColor) && (
              <span className="text-purple-400/50">{[b.driver.vehicleColor, b.driver.vehicleMake].filter(Boolean).join(" ")}</span>
            )}
          </>}
        </div>
        <DriverButtons driver={b.driver} />
      </div>
    </motion.div>
  );
}

function DriverButtons({ driver }: { driver?: { name: string; phone: string; vehicleMake?: string | null; vehicleColor?: string | null } | null }) {
  const phone = driver?.phone || "+441945243006";
  const waPhone = phone.replace(/[^0-9]/g, "");
  return (
    <div className="flex items-center gap-2 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
      <a href={`tel:${phone}`}
        className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 pl-2 pr-3 py-2 sm:py-1.5 rounded-full bg-gradient-to-r ${
          driver ? "from-purple-500/20 to-purple-600/10 border-purple-400/25 text-purple-300" : "from-blue-500/20 to-blue-600/10 border-blue-400/25 text-blue-300"
        } border text-xs font-semibold transition-all`}>
        <span className={`w-5 h-5 rounded-full ${driver ? "bg-purple-500/30" : "bg-blue-500/30"} flex items-center justify-center`}>
          <Phone className="w-2.5 h-2.5" /></span>
        {driver ? "Call Driver" : "Call Us"}
      </a>
      <a href={`https://wa.me/${driver ? waPhone : "441945243006"}`} target="_blank" rel="noopener noreferrer"
        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 pl-2 pr-3 py-2 sm:py-1.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-600/10 border border-green-400/25 text-green-300 text-xs font-semibold transition-all">
        <span className="w-5 h-5 rounded-full bg-green-500/30 flex items-center justify-center">
          <MessageCircle className="w-2.5 h-2.5" /></span>
        {driver ? "WhatsApp Driver" : "WhatsApp"}
      </a>
    </div>
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
