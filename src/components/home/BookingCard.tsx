"use client";

import { useState } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Navigation, User, Phone, Calendar, Clock, Plus, X, CircleDot } from "lucide-react";
import { useRouter } from "next/navigation";
import { calculateFare, VEHICLES, type VehicleType } from "@/lib/fare";
import { calcMultiSegmentDistance } from "@/lib/distanceCalc";
import { useAuth } from "@/context/AuthContext";
import SuccessModal from "@/components/booking/SuccessModal";
import HeroAddressInput from "@/components/home/HeroAddressInput";
import BookingFareResult from "@/components/home/BookingFareResult";
import { confirmBooking } from "@/components/home/bookingCardActions";

interface PlaceData { address: string; lat: number; lng: number }

export default function BookingCard() {
  const router = useRouter();
  const { customer } = useAuth();
  const [mapsLoaded, setMapsLoaded] = useState(() => typeof window !== "undefined" && !!window.google?.maps?.places);
  const [pickup, setPickup] = useState<PlaceData | null>(null);
  const [dropoff, setDropoff] = useState<PlaceData | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [vehicle, setVehicle] = useState<VehicleType>("car");
  const [stops, setStops] = useState<PlaceData[]>([]);
  const [result, setResult] = useState<{ distance: number; fare: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booked, setBooked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  const handleConfirm = async () => {
    if (!result || !pickup || !dropoff) return;
    setSaving(true);
    const done = await confirmBooking({ result, pickup, dropoff, stops: stops.map((s) => s.address), name, phone, date, time, vehicle, paymentMethod });
    setSaving(false);
    if (done) setBooked(true);
  };

  const getQuote = () => {
    if (!customer) { router.push("/login?redirect=/booking"); return; }
    if (!name.trim() || !phone.trim()) { setError("Enter name & phone"); return; }
    if (!pickup || !dropoff) { setError("Select both locations"); return; }
    if (!date || !time) { setError("Select date & time"); return; }
    if (stops.some((s) => !s.lat)) { setError("Fill all stops or remove empty ones"); return; }
    setError("");
    setLoading(true);
    calcMultiSegmentDistance(
      [pickup, ...stops, dropoff],
      (miles) => { setLoading(false); setResult({ distance: miles, fare: calculateFare(miles, pickup.lat, pickup.lng, vehicle) }); },
      () => { setLoading(false); setError("Unable to calculate. Try again."); }
    );
  };

  const inputCls = "bg-transparent text-white text-sm placeholder:text-white/35 outline-none w-full";
  const rowCls = "flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/10 focus-within:border-gold/40 transition-colors";

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
        onLoad={() => setMapsLoaded(true)}
      />
      <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/20">
        <h3 className="text-white font-bold text-lg mb-1">Book Your Ride</h3>
        <p className="text-white/60 text-sm mb-5">Get a quote in seconds</p>

        <div className="space-y-2.5">
          {/* Name & Phone */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className={rowCls}>
              <User className="w-4 h-4 text-white/30 shrink-0" />
              <label htmlFor="hero-name" className="sr-only">Name</label>
              <input id="hero-name" type="text" placeholder="Name" value={name}
                onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div className={rowCls}>
              <Phone className="w-4 h-4 text-white/30 shrink-0" />
              <label htmlFor="hero-phone" className="sr-only">Phone</label>
              <input id="hero-phone" type="tel" placeholder="Phone" value={phone}
                onChange={(e) => setPhone(e.target.value)} className={inputCls} />
            </div>
          </div>

          {/* Pickup & Dropoff */}
          <HeroAddressInput id="hero-pickup" placeholder="Pickup Location"
            icon={<MapPin className="w-4 h-4 text-green-400" />} iconBg="bg-green-500/20"
            ready={mapsLoaded} onSelect={(p) => { setPickup(p); setResult(null); }} />
          {stops.map((_, i) => (
            <div key={i} className="relative">
              <HeroAddressInput id={`hero-stop-${i}`} placeholder={`Stop ${i + 1}`}
                icon={<CircleDot className="w-4 h-4 text-amber-400" />} iconBg="bg-amber-500/20"
                ready={mapsLoaded} onSelect={(p) => { setStops((prev) => { const n = [...prev]; n[i] = p; return n; }); setResult(null); }} />
              <button type="button" onClick={() => { setStops((s) => s.filter((_, j) => j !== i)); setResult(null); }}
                className="absolute top-1/2 -translate-y-1/2 right-2 p-1 text-white/30 hover:text-crimson cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {stops.length < 5 && (
            <button type="button" onClick={() => setStops((s) => [...s, { address: "", lat: 0, lng: 0 }])}
              className="flex items-center gap-1.5 text-xs text-gold/70 hover:text-gold font-medium cursor-pointer py-0.5"><Plus className="w-3.5 h-3.5" /> Add a stop</button>
          )}
          <HeroAddressInput id="hero-dropoff" placeholder="Drop-off Location"
            icon={<Navigation className="w-4 h-4 text-crimson" />} iconBg="bg-crimson/20"
            ready={mapsLoaded} onSelect={(p) => { setDropoff(p); setResult(null); }} />

          {/* Vehicle Type */}
          <div className="grid grid-cols-2 gap-2.5">
            {(Object.entries(VEHICLES) as [VehicleType, typeof VEHICLES.car][]).map(([key, v]) => (
              <button key={key} type="button"
                onClick={() => { setVehicle(key); setResult(null); }}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 border text-sm font-medium transition-all cursor-pointer ${
                  vehicle === key
                    ? "bg-gold/20 border-gold/50 text-gold"
                    : "bg-white/10 border-white/10 text-white/60 hover:border-white/25"
                }`}>
                <span>{v.label}</span>
                <span className="text-xs opacity-60">Up to {v.passengers}</span>
              </button>
            ))}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className={rowCls}>
              <Calendar className="w-4 h-4 text-white/30 shrink-0" />
              <label htmlFor="hero-date" className="sr-only">Date</label>
              <input id="hero-date" type="date" value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className={`${inputCls} dark-picker ${!date ? "text-white/35" : ""}`} />
            </div>
            <div className={rowCls}>
              <Clock className="w-4 h-4 text-white/30 shrink-0" />
              <label htmlFor="hero-time" className="sr-only">Time</label>
              <input id="hero-time" type="time" value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`${inputCls} dark-picker ${!time ? "text-white/35" : ""}`} />
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={getQuote} disabled={loading}
          className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-crimson/25 cursor-pointer disabled:opacity-60">
          {loading ? "Calculating..." : "Get Instant Quote"}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </motion.button>

        <AnimatePresence>
          {result && pickup && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <BookingFareResult
                result={result}
                pickup={pickup}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                onConfirm={handleConfirm}
                saving={saving}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {!result && (
          <p className="text-center text-white/50 text-xs mt-3">
            No hidden fees. Free cancellation up to 1hr before.
          </p>
        )}
      </div>

      <AnimatePresence>
        {booked && result && pickup && dropoff && (
          <SuccessModal
            name={name} phone={phone}
            pickup={pickup.address} dropoff={dropoff.address}
            stops={stops.map((s) => s.address)}
            date={date} time={time}
            distance={result.distance} fare={result.fare}
            onClose={() => {
              setBooked(false);
              setName(""); setPhone(""); setDate(""); setTime("");
              setPickup(null); setDropoff(null); setStops([]); setResult(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
