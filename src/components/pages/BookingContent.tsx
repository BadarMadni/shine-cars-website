"use client";

import { useState, useCallback } from "react";
import Script from "next/script";
import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import FareResult from "@/components/booking/FareResult";
import BookingFormFields from "@/components/pages/BookingFormFields";
import { calculateFare, metersToMiles, isOutsideOfficeRadius, VEHICLES, type VehicleType } from "@/lib/fare";

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
  const [vehicle, setVehicle] = useState<VehicleType>("car");
  const [result, setResult] = useState<{ distance: number; fare: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildAddress = (place: google.maps.places.PlaceResult) => {
    const placeName = place.name || "";
    const formatted = place.formatted_address || "";
    if (placeName && formatted && !formatted.toLowerCase().includes(placeName.toLowerCase())) {
      return `${placeName}, ${formatted}`;
    }
    return formatted || placeName;
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
        setResult({ distance: miles, fare: calculateFare(miles, pickup.lat, pickup.lng, vehicle) });
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

              <BookingFormFields
                name={name}
                phone={phone}
                date={date}
                time={time}
                vehicle={vehicle}
                error={error}
                loading={loading}
                mapsLoaded={mapsLoaded}
                onNameChange={setName}
                onPhoneChange={setPhone}
                onDateChange={setDate}
                onTimeChange={setTime}
                onVehicleChange={(v) => { setVehicle(v); setResult(null); }}
                onPickup={handlePickup}
                onDropoff={handleDropoff}
                onSubmit={getQuote}
              />

              {result && pickup && dropoff && (
                <FareResult
                  pickup={pickup.address}
                  dropoff={dropoff.address}
                  distanceMiles={result.distance}
                  fare={result.fare}
                  vehicle={VEHICLES[vehicle].label}
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
