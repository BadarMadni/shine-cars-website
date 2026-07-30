"use client";

import { motion } from "framer-motion";
import { Car, PoundSterling, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Booking {
  fare: number;
  status: string;
  distance: number;
}

export default function BookingsHeader({ bookings, loading }: { bookings: Booking[]; loading: boolean }) {
  const { customer } = useAuth();

  const total = bookings.length;
  const completed = bookings.filter((b) => b.status === "completed").length;
  const active = bookings.filter((b) =>
    ["pending", "confirmed", "assigned", "accepted", "arrived", "in-progress"].includes(b.status),
  ).length;
  const spent = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.fare, 0);

  const stats = [
    { icon: Car, label: "Total Rides", value: total, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
    { icon: Clock, label: "Active", value: active, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
    { icon: CheckCircle, label: "Completed", value: completed, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
    { icon: PoundSterling, label: "Total Spent", value: `£${spent.toFixed(0)}`, color: "text-gold", bg: "bg-gold/10 border-gold/20" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">My Bookings</h1>
        {customer && (
          <p className="text-white/40 text-sm mt-1">
            Welcome back, <span className="text-gold/70">{customer.name}</span>
          </p>
        )}
      </motion.div>

      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-5 sm:mt-6">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-xl sm:rounded-2xl border p-3 sm:p-4 ${s.bg}`}
            >
              <s.icon className={`w-4 sm:w-5 h-4 sm:h-5 ${s.color} mb-1.5 sm:mb-2`} />
              <div className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-white/40 text-[10px] sm:text-xs mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
