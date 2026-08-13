"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Repeat, MapPin, Clock, Calendar, Pause, Play, UserCheck, Info } from "lucide-react";
import StatusNotification from "@/components/bookings/StatusNotification";

interface RecurringItem {
  id: string; pickup: string; dropoff: string; time: string; vehicle: string;
  fare: number; distance: number; days: string; name: string; phone: string;
  isActive: boolean; createdAt: string;
  driver?: { name: string; phone: string; vehicleMake?: string | null; vehicleColor?: string | null } | null;
  bookings?: { status: string; date: string }[];
}

const statusBadge: Record<string, { bg: string; dot: string }> = {
  pending: { bg: "bg-yellow-500/10 text-yellow-400", dot: "bg-yellow-400" },
  confirmed: { bg: "bg-blue-500/10 text-blue-400", dot: "bg-blue-400" },
  assigned: { bg: "bg-purple-500/10 text-purple-400", dot: "bg-purple-400" },
  accepted: { bg: "bg-indigo-500/10 text-indigo-400", dot: "bg-indigo-400" },
  arrived: { bg: "bg-cyan-500/10 text-cyan-400", dot: "bg-cyan-400" },
  "in-progress": { bg: "bg-orange-500/10 text-orange-400", dot: "bg-orange-400 animate-pulse" },
  completed: { bg: "bg-green-500/10 text-green-400", dot: "bg-green-400" },
  cancelled: { bg: "bg-red-500/10 text-red-400", dot: "bg-red-400" },
};

interface StatusUpdate {
  bookingId: string; pickup: string; dropoff: string; oldStatus: string; newStatus: string;
  driver?: { name: string; phone: string; vehicleMake?: string | null; vehicleColor?: string | null } | null;
}

export default function RecurringList() {
  const [items, setItems] = useState<RecurringItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdate | null>(null);
  const prevDrivers = useRef<Record<string, string | null>>({});
  const prevStatuses = useRef<Record<string, string>>({});

  const load = useCallback(async (isInitial = false) => {
    try {
      const [recRes, bookRes] = await Promise.all([
        fetch("/api/recurring"), fetch("/api/my-bookings"),
      ]);
      const recData = await recRes.json();
      const bookData = await bookRes.json();
      const newItems: RecurringItem[] = recData.items || [];
      const bookings: { id: string; status: string; pickup: string; dropoff: string; isRecurring?: boolean; driver?: RecurringItem["driver"] }[] = bookData.bookings || [];
      const recurringBookings = bookings.filter((b) => b.isRecurring);

      // Detect booking status changes
      if (!isInitial && Object.keys(prevStatuses.current).length > 0) {
        for (const b of recurringBookings) {
          const old = prevStatuses.current[b.id];
          if (old && old !== b.status) {
            setStatusUpdate({ bookingId: b.id, pickup: b.pickup, dropoff: b.dropoff, oldStatus: old, newStatus: b.status, driver: b.driver });
            break;
          }
          if (!old && b.status !== "pending") {
            setStatusUpdate({ bookingId: b.id, pickup: b.pickup, dropoff: b.dropoff, oldStatus: "new", newStatus: b.status, driver: b.driver });
            break;
          }
        }
      }
      const sMap: Record<string, string> = {};
      for (const b of recurringBookings) sMap[b.id] = b.status;
      prevStatuses.current = sMap;

      // Detect driver assignment on templates
      if (!isInitial && Object.keys(prevDrivers.current).length > 0) {
        for (const item of newItems) {
          const oldD = prevDrivers.current[item.id];
          const newD = item.driver?.name || null;
          if (oldD !== undefined && !oldD && newD) {
            setStatusUpdate({ bookingId: item.id, pickup: item.pickup, dropoff: item.dropoff, oldStatus: "new", newStatus: "assigned", driver: item.driver });
            break;
          }
        }
      }
      const dMap: Record<string, string | null> = {};
      for (const item of newItems) dMap[item.id] = item.driver?.name || null;
      prevDrivers.current = dMap;

      setItems(newItems);
    } catch {}
    if (isInitial) setLoading(false);
  }, []);

  useEffect(() => {
    load(true);
    const iv = setInterval(() => load(false), 8000);
    return () => clearInterval(iv);
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-20">
        <Repeat className="w-12 h-12 text-white/10 mx-auto mb-4" />
        <p className="text-white/40 font-semibold">No recurring bookings</p>
        <p className="text-white/25 text-sm mt-1">Create one from the Booking page</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 text-blue-300 text-xs">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <p>Your daily rides from these schedules appear in <a href="/my-bookings" className="underline font-semibold">My Bookings</a> with live status updates.</p>
      </div>
      <StatusNotification update={statusUpdate} onClose={() => setStatusUpdate(null)} />
      {items.map((item, i) => {
        const days: string[] = (() => { try { return JSON.parse(item.days); } catch { return []; } })();
        return (
          <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3 gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-full ${
                  item.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                }`}>
                  {item.isActive ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  {item.isActive ? "Active" : "Paused"}
                </span>
                {(() => {
                  const st = item.bookings?.[0]?.status || (item.driver ? "assigned" : "pending");
                  const s = statusBadge[st] || statusBadge.pending;
                  return (
                    <span className={`flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-full ${s.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </span>
                  );
                })()}
                <span className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2 py-1.5 rounded-full bg-purple-500/10 text-purple-400">
                  <Repeat className="w-3 h-3" /> RECURRING
                </span>
                <span className={`text-[11px] sm:text-xs font-semibold px-2 py-1.5 rounded-full ${
                  item.vehicle === "mpv" ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
                }`}>{item.vehicle.toUpperCase()}</span>
              </div>
              <span className="text-gold font-bold text-lg shrink-0">£{item.fare.toFixed(2)}</span>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 ring-4 ring-green-400/10" />
                <span className="text-white text-sm truncate">{item.pickup}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-crimson ring-4 ring-crimson/10" />
                <span className="text-white text-sm truncate">{item.dropoff}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((d) => (
                <span key={d} className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${
                  days.some((day) => day.startsWith(d))
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "bg-white/5 text-white/20 border border-white/5"
                }`}>{d}</span>
              ))}
            </div>
            <div className="flex items-center flex-wrap gap-3 text-white/30 text-xs border-t border-white/[0.06] pt-3">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.distance.toFixed(1)} mi</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
              {item.driver ? (
                <>
                  <span className="flex items-center gap-1 text-purple-400/80 font-semibold">Assigned</span>
                  <span className="flex items-center gap-1 text-green-400/80"><UserCheck className="w-3 h-3" /> {item.driver.name}</span>
                </>
              ) : (
                <span className="flex items-center gap-1 text-yellow-400/60"><UserCheck className="w-3 h-3" /> Unassigned</span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
