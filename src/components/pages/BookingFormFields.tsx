"use client";

import { MapPin, Navigation, User, Phone, Calendar, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AddressInput from "@/components/booking/AddressInput";
import { VEHICLES, type VehicleType } from "@/lib/fare";

interface BookingFormFieldsProps {
  name: string;
  phone: string;
  date: string;
  time: string;
  vehicle: VehicleType;
  error: string;
  loading: boolean;
  mapsLoaded: boolean;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  onVehicleChange: (v: VehicleType) => void;
  onPickup: (place: google.maps.places.PlaceResult) => void;
  onDropoff: (place: google.maps.places.PlaceResult) => void;
  onSubmit: () => void;
}

export default function BookingFormFields({
  name, phone, date, time, vehicle, error, loading, mapsLoaded,
  onNameChange, onPhoneChange, onDateChange, onTimeChange, onVehicleChange,
  onPickup, onDropoff, onSubmit,
}: BookingFormFieldsProps) {
  const fieldCls = "flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors";
  const inputCls = "bg-transparent text-navy text-sm outline-none w-full placeholder:text-navy/35";

  return (
    <div className="space-y-4">
      {/* Name & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="book-name" className="block text-navy/70 text-sm font-medium mb-1.5">
            Full Name
          </label>
          <div className={fieldCls}>
            <User className="w-4 h-4 text-navy/30 shrink-0" />
            <input
              id="book-name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="John Smith"
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label htmlFor="book-phone" className="block text-navy/70 text-sm font-medium mb-1.5">
            Phone Number
          </label>
          <div className={fieldCls}>
            <Phone className="w-4 h-4 text-navy/30 shrink-0" />
            <input
              id="book-phone"
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="+44 7XXX XXXXXX"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Pickup & Dropoff */}
      {mapsLoaded ? (
        <>
          <AddressInput
            id="book-pickup"
            label="Pickup Address"
            placeholder="Enter pickup location"
            icon={<MapPin className="w-4 h-4 text-green-500" />}
            onPlaceSelect={onPickup}
          />
          <AddressInput
            id="book-dropoff"
            label="Drop-off Location"
            placeholder="Enter drop-off location"
            icon={<Navigation className="w-4 h-4 text-crimson" />}
            onPlaceSelect={onDropoff}
          />
        </>
      ) : (
        <div className="text-center text-navy/40 text-sm py-4">
          Loading address search...
        </div>
      )}

      {/* Vehicle Type */}
      <div>
        <label className="block text-navy/70 text-sm font-medium mb-1.5">Vehicle Type</label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.entries(VEHICLES) as [VehicleType, typeof VEHICLES.car][]).map(([key, v]) => (
            <button key={key} type="button"
              onClick={() => onVehicleChange(key)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 border text-sm font-medium transition-all cursor-pointer ${
                vehicle === key
                  ? "bg-crimson/10 border-crimson/50 text-crimson"
                  : "bg-white border-gray-200 text-navy/60 hover:border-crimson/30"
              }`}>
              <span>{v.label}</span>
              <span className="text-xs opacity-60">(Up to {v.passengers} passengers)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="book-date" className="block text-navy/70 text-sm font-medium mb-1.5">
            Date
          </label>
          <div className={fieldCls}>
            <Calendar className="w-4 h-4 text-navy/30 shrink-0" />
            <input
              id="book-date"
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="bg-transparent text-navy text-sm outline-none w-full"
            />
          </div>
        </div>
        <div>
          <label htmlFor="book-time" className="block text-navy/70 text-sm font-medium mb-1.5">
            Time
          </label>
          <div className={fieldCls}>
            <Clock className="w-4 h-4 text-navy/30 shrink-0" />
            <input
              id="book-time"
              type="time"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className="bg-transparent text-navy text-sm outline-none w-full"
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="text-crimson text-sm font-medium">{error}</p>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSubmit}
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-crimson/20 cursor-pointer disabled:opacity-60"
      >
        {loading ? "Calculating..." : "Get Instant Quote"}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}
