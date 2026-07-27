"use client";

import { useState, useCallback } from "react";
import Script from "next/script";
import { motion } from "framer-motion";
import { MapPin, Navigation, User, Phone, Calendar, Clock, ArrowRight } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AddressInput from "@/components/booking/AddressInput";
import FareResult from "@/components/booking/FareResult";
import { calculateFare, metersToMiles, isOutsideOfficeRadius, SURCHARGE } from "@/lib/fare";

interface PlaceData {
  address: string;
  lat: number;
  lng: number;
}

export default function BookingContent() {
  const [mapsLoaded, setMapsLoaded] = useState(() => typeof window !== "undefined" && !!window.google?.maps?.places);
  const [pickup, setPickup] = useState<PlaceData | null>(null);
  const [dropoff, setDropoff] = useState<PlaceData | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState<{ distance: number; fare: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildAddress = (place: google.maps.places.PlaceResult) => {
    const name = place.name || "";
    const formatted = place.formatted_address || "";
    if (name && formatted && !formatted.toLowerCase().includes(name.toLowerCase())) {
      return `${name}, ${formatted}`;
    }
    return formatted || name;
  };

  const handlePickup = useCallback((place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;
    setPickup({
      address: buildAddress(place),
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setResult(null);
  }, []);

  const handleDropoff = useCallback((place: google.maps.places.PlaceResult) => {
    if (!place.geometry?.location) return;
    setDropoff({
      address: buildAddress(place),
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setResult(null);
  }, []);

  const getQuote = () => {
    if (!pickup || !dropoff) {
      setError("Please select both pickup and drop-off locations.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (!date || !time) {
      setError("Please select date and time.");
      return;
    }
    setError("");
    setLoading(true);

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [{ lat: pickup.lat, lng: pickup.lng }],
        destinations: [{ lat: dropoff.lat, lng: dropoff.lng }],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
      },
      (response, status) => {
        setLoading(false);
        if (status !== "OK" || !response?.rows[0]?.elements[0]?.distance) {
          setError("Unable to calculate distance. Please try again.");
          return;
        }
        const meters = response.rows[0].elements[0].distance.value;
        const miles = metersToMiles(meters);
        const fare = calculateFare(miles, pickup.lat, pickup.lng);
        setResult({ distance: miles, fare });
      }
    );
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
        onLoad={() => setMapsLoaded(true)}
      />

      <PageHero
        backgroundImage="/images/hero-car.jpg"
        title="Book Your"
        highlight="Ride"
        subtitle="Get an instant fare quote and book your journey in seconds."
        breadcrumb="Booking"
      />

      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-2xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-100">
              <h2 className="text-2xl font-bold text-navy mb-1">
                Get Instant <span className="gradient-text">Quote</span>
              </h2>
              <p className="text-navy/50 text-sm mb-8">
                Enter your details below for an estimated fare.
              </p>

              <div className="space-y-4">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="book-name" className="block text-navy/70 text-sm font-medium mb-1.5">
                      Full Name
                    </label>
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors">
                      <User className="w-4 h-4 text-navy/30 shrink-0" />
                      <input
                        id="book-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Smith"
                        className="bg-transparent text-navy text-sm outline-none w-full placeholder:text-navy/35"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="book-phone" className="block text-navy/70 text-sm font-medium mb-1.5">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors">
                      <Phone className="w-4 h-4 text-navy/30 shrink-0" />
                      <input
                        id="book-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7XXX XXXXXX"
                        className="bg-transparent text-navy text-sm outline-none w-full placeholder:text-navy/35"
                      />
                    </div>
                  </div>
                </div>

                {/* Pickup & Dropoff */}
                {mapsLoaded && (
                  <>
                    <AddressInput
                      id="book-pickup"
                      label="Pickup Address"
                      placeholder="Enter pickup location"
                      icon={<MapPin className="w-4 h-4 text-green-500" />}
                      onPlaceSelect={handlePickup}
                    />
                    <AddressInput
                      id="book-dropoff"
                      label="Drop-off Location"
                      placeholder="Enter drop-off location"
                      icon={<Navigation className="w-4 h-4 text-crimson" />}
                      onPlaceSelect={handleDropoff}
                    />
                  </>
                )}

                {!mapsLoaded && (
                  <div className="text-center text-navy/40 text-sm py-4">
                    Loading address search...
                  </div>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="book-date" className="block text-navy/70 text-sm font-medium mb-1.5">
                      Date
                    </label>
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors">
                      <Calendar className="w-4 h-4 text-navy/30 shrink-0" />
                      <input
                        id="book-date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="bg-transparent text-navy text-sm outline-none w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="book-time" className="block text-navy/70 text-sm font-medium mb-1.5">
                      Time
                    </label>
                    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors">
                      <Clock className="w-4 h-4 text-navy/30 shrink-0" />
                      <input
                        id="book-time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bg-transparent text-navy text-sm outline-none w-full"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <p className="text-crimson text-sm font-medium">{error}</p>
                )}

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={getQuote}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-crimson/20 cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Calculating..." : "Get Instant Quote"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </div>

              {/* Fare Result */}
              {result && pickup && dropoff && (
                <FareResult
                  pickup={pickup.address}
                  dropoff={dropoff.address}
                  distanceMiles={result.distance}
                  fare={result.fare}
                  surcharge={isOutsideOfficeRadius(pickup.lat, pickup.lng)}
                  name={name}
                  phone={phone}
                  date={date}
                  time={time}
                  onReset={() => {
                    setName(""); setPhone(""); setDate(""); setTime("");
                    setPickup(null); setDropoff(null); setResult(null);
                  }}
                />
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
