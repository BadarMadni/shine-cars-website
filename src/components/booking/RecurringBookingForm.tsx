"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Repeat, MapPin, Navigation, Clock, User, Phone, CheckCircle, X } from "lucide-react";
import HeroAddressInput from "@/components/home/HeroAddressInput";
import { VEHICLES, type VehicleType, calculateFare, isSundayOrHoliday } from "@/lib/fare";
import { calcMultiSegmentDistance } from "@/lib/distanceCalc";

interface PlaceData { address: string; lat: number; lng: number }
const ALL_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function RecurringBookingForm({ mapsLoaded }: { mapsLoaded: boolean }) {
  const [pickup, setPickup] = useState<PlaceData | null>(null);
  const [dropoff, setDropoff] = useState<PlaceData | null>(null);
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  const [time, setTime] = useState(""); const [vehicle, setVehicle] = useState<VehicleType>("car");
  const [days, setDays] = useState<string[]>([]);
  const [fare, setFare] = useState<number | null>(null); const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(false); const [saving, setSaving] = useState(false);
  const [error, setError] = useState(""); const [success, setSuccess] = useState(false);

  const toggleDay = (d: string) => setDays((p) => p.includes(d) ? p.filter((x) => x !== d) : [...p, d]);

  const getQuote = () => {
    if (!name.trim() || !phone.trim()) { setError("Enter name & phone"); return; }
    if (!pickup || !dropoff) { setError("Select both locations"); return; }
    if (!time) { setError("Select time"); return; }
    if (!days.length) { setError("Select at least one day"); return; }
    setError(""); setLoading(true);
    calcMultiSegmentDistance(
      [pickup, dropoff],
      (miles) => {
        setLoading(false); setDistance(miles);
        setFare(calculateFare(miles, pickup.lat, pickup.lng, vehicle, false));
      },
      () => { setLoading(false); setError("Unable to calculate. Try again."); }
    );
  };

  const handleSubmit = async () => {
    if (!fare || !pickup || !dropoff) return;
    setSaving(true);
    const res = await fetch("/api/recurring", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickup: pickup.address, dropoff: dropoff.address, time, vehicle,
        fare, distance, days, name, phone,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.recurring) { setSuccess(true); }
    else setError(data.error || "Failed to create");
  };

  const inputCls = "bg-transparent text-white text-sm placeholder:text-white/35 outline-none w-full";
  const rowCls = "flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/10 focus-within:border-gold/40 transition-colors";

  return (
    <>
      <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-2 mb-1">
          <Repeat className="w-5 h-5 text-gold" />
          <h3 className="text-white font-bold text-lg">Recurring Booking</h3>
        </div>
        <p className="text-white/60 text-sm mb-5">Schedule regular rides — pay via weekly invoice.</p>

        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div className={rowCls}>
              <User className="w-4 h-4 text-white/30 shrink-0" />
              <input type="text" placeholder="Passenger Name" value={name}
                onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div className={rowCls}>
              <Phone className="w-4 h-4 text-white/30 shrink-0" />
              <input type="tel" placeholder="Phone" value={phone}
                onChange={(e) => setPhone(e.target.value)} className={inputCls} />
            </div>
          </div>

          <HeroAddressInput id="rec-pickup" placeholder="Pickup Location"
            icon={<MapPin className="w-4 h-4 text-green-400" />} iconBg="bg-green-500/20"
            ready={mapsLoaded} onSelect={(p) => { setPickup(p); setFare(null); }} />
          <HeroAddressInput id="rec-dropoff" placeholder="Drop-off Location"
            icon={<Navigation className="w-4 h-4 text-crimson" />} iconBg="bg-crimson/20"
            ready={mapsLoaded} onSelect={(p) => { setDropoff(p); setFare(null); }} />

          <div className="grid grid-cols-2 gap-2.5">
            {(Object.entries(VEHICLES) as [VehicleType, typeof VEHICLES.car][]).map(([key, v]) => (
              <button key={key} type="button" onClick={() => { setVehicle(key); setFare(null); }}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 border text-sm font-medium transition-all cursor-pointer ${
                  vehicle === key ? "bg-gold/20 border-gold/50 text-gold" : "bg-white/10 border-white/10 text-white/60 hover:border-white/25"
                }`}><span>{v.label}</span><span className="text-xs opacity-60">Up to {v.passengers}</span></button>
            ))}
          </div>

          <div className={rowCls}>
            <Clock className="w-4 h-4 text-white/30 shrink-0" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className={`${inputCls} dark-picker ${!time ? "text-white/35" : ""}`} />
          </div>

          <div>
            <p className="text-white/50 text-xs font-medium mb-2">Select Days</p>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((d) => (
                <button key={d} type="button" onClick={() => { toggleDay(d); setFare(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    days.includes(d) ? "bg-gold/20 text-gold border border-gold/40" : "bg-white/10 text-white/40 border border-white/10"
                  }`}>{d.slice(0, 3).toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

        {!fare ? (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={getQuote} disabled={loading}
            className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-crimson/25 cursor-pointer disabled:opacity-60">
            {loading ? "Calculating..." : "Get Fixed Quote"}
          </motion.button>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="bg-white/[0.06] rounded-xl p-4 flex items-center justify-between border border-white/10">
              <div>
                <p className="text-white/40 text-xs">Distance</p>
                <p className="text-white font-semibold text-sm">{distance.toFixed(1)} miles</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-xs">Fixed Fare (per ride)</p>
                <p className="text-2xl font-extrabold gradient-text">&pound;{fare.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-white/30 text-xs text-center">
              {days.length} days/week — Billed via weekly invoice
            </p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleSubmit} disabled={saving}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm cursor-pointer disabled:opacity-60">
              {saving ? "Creating..." : "Confirm Recurring Booking"}
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSuccess(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-8 text-center max-w-sm" onClick={(e) => e.stopPropagation()}>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-extrabold text-navy mb-2">Recurring Booking Created!</h3>
              <p className="text-navy/50 text-sm mb-4">
                Your ride is scheduled. Bookings will be generated automatically on your selected days.
              </p>
              <button onClick={() => setSuccess(false)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm cursor-pointer">
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
