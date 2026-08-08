"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import BookingsHeader from "@/components/bookings/BookingsHeader";
import BookingsList from "@/components/bookings/BookingsList";
import StatusNotification from "@/components/bookings/StatusNotification";
import { useState, useEffect, useRef, useCallback } from "react";

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
  isRecurring?: boolean;
  createdAt: string;
  driver?: { name: string; phone: string } | null;
}

interface StatusUpdate {
  bookingId: string;
  pickup: string;
  dropoff: string;
  oldStatus: string;
  newStatus: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdate | null>(null);
  const prevStatuses = useRef<Record<string, string>>({});

  const fetchBookings = useCallback(async (isInitial = false) => {
    try {
      const res = await fetch("/api/my-bookings");
      const data = await res.json();
      const newBookings: Booking[] = data.bookings || [];

      // Detect status changes or new bookings (skip on first load)
      if (!isInitial && Object.keys(prevStatuses.current).length > 0) {
        for (const b of newBookings) {
          const oldStatus = prevStatuses.current[b.id];
          if (oldStatus && oldStatus !== b.status) {
            setStatusUpdate({ bookingId: b.id, pickup: b.pickup, dropoff: b.dropoff, oldStatus, newStatus: b.status });
            break;
          }
          // New booking appeared (e.g. recurring cron) with non-pending status
          if (!oldStatus && b.status !== "pending") {
            setStatusUpdate({ bookingId: b.id, pickup: b.pickup, dropoff: b.dropoff, oldStatus: "new", newStatus: b.status });
            break;
          }
        }
      }

      // Update status map
      const map: Record<string, string> = {};
      for (const b of newBookings) map[b.id] = b.status;
      prevStatuses.current = map;

      setBookings(newBookings);
    } catch {}
    if (isInitial) setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings(true);
    const iv = setInterval(() => fetchBookings(false), 10000);
    return () => clearInterval(iv);
  }, [fetchBookings]);

  return (
    <AuthGuard redirectTo="/my-bookings">
      <main className="min-h-screen bg-gradient-to-b from-navy via-navy-light to-navy pt-24 sm:pt-28 pb-12 sm:pb-16">
        <BookingsHeader bookings={bookings} loading={loading} />
        <div className="max-w-5xl mx-auto px-3 sm:px-4 mt-6 sm:mt-8">
          <BookingsList bookings={bookings} loading={loading} />
        </div>
      </main>
      <StatusNotification update={statusUpdate} onClose={() => setStatusUpdate(null)} />
    </AuthGuard>
  );
}
