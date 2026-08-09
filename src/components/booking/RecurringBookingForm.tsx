"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Repeat, MapPin, Navigation, Clock, User, Phone, CheckCircle, Calendar } from "lucide-react";
import AddressInput from "@/components/booking/AddressInput";
import { VEHICLES, type VehicleType, calculateFare } from "@/lib/fare";
import { calcMultiSegmentDistance } from "@/lib/distanceCalc";

interface PlaceData { address: string; lat: number; lng: number }
const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function RecurringBookingForm({ mapsLoaded }: { mapsLoaded: boolean }) {
  const [pickup, setPickup] = useState<PlaceData | null>(null);
  const [dropoff, setDropoff] = useState<PlaceData | null>(null);
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  const [time, setTime] = useState(""); const [vehicle, setVehicle] = useState<VehicleType>("car");
  const [days, setDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");
  const [startDate, setStartDate] = useState(""); const [endDate, setEndDate] = useState("");
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
        fare, distance, days, name, phone, frequency,
        startDate: startDate || null, endDate: endDate || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.recurring) setSuccess(true);
    else setError(data.error || "Failed to create");
  };

  const inputCls = "bg-white text-navy text-sm placeholder:text-navy/40 outline-none w-full";
  const rowCls = "flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-200 focus-within:border-crimson/40 transition-colors shadow-sm";

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-crimson/10 flex items-center justify-center">
            <Repeat className="w-4 h-4 text-crimson" />
          </div>
          <h3 className="text-navy font-bold text-lg">Recurring Booking</h3>
        </div>
        <p className="text-navy/50 text-sm mb-5">Schedule regular rides — pay via weekly invoice.</p>

        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <div className={rowCls}>
              <User className="w-4 h-4 text-navy/30 shrink-0" />
              <input type="text" placeholder="Passenger Name" value={name}
                onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div className={rowCls}>
              <Phone className="w-4 h-4 text-navy/30 shrink-0" />
              <input type="tel" placeholder="Phone" value={phone}
                onChange={(e) => setPhone(e.target.value)} className={inputCls} />
            </div>
          </div>

          <AddressInput id="rec-pickup" label="Pickup" placeholder="Pickup Location"
            icon={<MapPin className="w-4 h-4 text-green-500" />}
            onPlaceSelect={(p) => { if (p.geometry?.location) { setPickup({ address: p.formatted_address || p.name || "", lat: p.geometry.location.lat(), lng: p.geometry.location.lng() }); setFare(null); } }} />
          <AddressInput id="rec-dropoff" label="Drop-off" placeholder="Drop-off Location"
            icon={<Navigation className="w-4 h-4 text-crimson" />}
            onPlaceSelect={(p) => { if (p.geometry?.location) { setDropoff({ address: p.formatted_address || p.name || "", lat: p.geometry.location.lat(), lng: p.geometry.location.lng() }); setFare(null); } }} />

          <div className="grid grid-cols-2 gap-2.5">
            {(Object.entries(VEHICLES) as [VehicleType, typeof VEHICLES.car][]).map(([key, v]) => (
              <button key={key} type="button" onClick={() => { setVehicle(key); setFare(null); }}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 border text-sm font-medium transition-all cursor-pointer ${
                  vehicle === key ? "bg-crimson/10 border-crimson/30 text-crimson" : "bg-white border-gray-200 text-navy/60 hover:border-gray-300"
                }`}><span>{v.label}</span><span className="text-xs opacity-60">Up to {v.passengers}</span></button>
            ))}
          </div>

          <div className={rowCls}>
            <Clock className="w-4 h-4 text-navy/30 shrink-0" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className={`${inputCls} ${!time ? "text-navy/40" : ""}`} />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <p className="text-navy/50 text-xs font-medium mb-1.5">Frequency</p>
              <div className="flex gap-2">
                {["weekly", "monthly"].map((f) => (
                  <button key={f} type="button" onClick={() => setFrequency(f)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                      frequency === f ? "bg-crimson/10 border-crimson/30 text-crimson" : "bg-white border-gray-200 text-navy/50 hover:border-gray-300"
                    }`}>{f.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-navy/50 text-xs font-medium mb-1.5">Select Days</p>
              <div className="flex flex-wrap gap-1">
                {DAYS.map((d) => (
                  <button key={d} type="button" onClick={() => { toggleDay(d); setFare(null); }}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors border ${
                      days.includes(d) ? "bg-crimson/10 text-crimson border-crimson/30" : "bg-white text-navy/40 border-gray-200"
                    }`}>{d.slice(0, 3).toUpperCase()}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <p className="text-navy/50 text-xs font-medium mb-1.5">Start Date (optional)</p>
              <div className={rowCls}><Calendar className="w-4 h-4 text-navy/30 shrink-0" />
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={`${inputCls} ${!startDate ? "text-navy/40" : ""}`} /></div>
            </div>
            <div>
              <p className="text-navy/50 text-xs font-medium mb-1.5">End Date (optional)</p>
              <div className={rowCls}><Calendar className="w-4 h-4 text-navy/30 shrink-0" />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`${inputCls} ${!endDate ? "text-navy/40" : ""}`} /></div>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        {!fare ? (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={getQuote} disabled={loading}
            className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-crimson/25 cursor-pointer disabled:opacity-60">
            {loading ? "Calculating..." : "Get Fixed Quote"}
          </motion.button>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
              <div>
                <p className="text-navy/40 text-xs">Distance</p>
                <p className="text-navy font-semibold text-sm">{distance.toFixed(1)} miles</p>
              </div>
              <div className="text-right">
                <p className="text-navy/40 text-xs">Fixed Fare (per ride)</p>
                <p className="text-2xl font-extrabold text-crimson">&pound;{fare.toFixed(2)}</p>
              </div>
            </div>
            <p className="text-navy/40 text-xs text-center">
              {days.length} days/{frequency} — Billed via {frequency} invoice
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSuccess(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 text-center max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-500" /></div>
              <h3 className="text-xl font-extrabold text-navy mb-2">Recurring Booking Created!</h3>
              <p className="text-navy/50 text-sm mb-4">Your ride is scheduled. Bookings will be generated automatically.</p>
              <button onClick={() => setSuccess(false)} className="px-8 py-3 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm cursor-pointer">Done</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
