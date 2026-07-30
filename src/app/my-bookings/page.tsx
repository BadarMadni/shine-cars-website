"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import BookingsHeader from "@/components/bookings/BookingsHeader";
import BookingsList from "@/components/bookings/BookingsList";
import { useState, useEffect } from "react";

interface Booking {
  id: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  distance: number;
  fare: number;
  vehicle: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-bookings")
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthGuard redirectTo="/my-bookings">
      <main className="min-h-screen bg-gradient-to-b from-navy via-navy-light to-navy pt-24 sm:pt-28 pb-12 sm:pb-16">
        <BookingsHeader bookings={bookings} loading={loading} />
        <div className="max-w-5xl mx-auto px-3 sm:px-4 mt-6 sm:mt-8">
          <BookingsList bookings={bookings} loading={loading} />
        </div>
      </main>
    </AuthGuard>
  );
}
