"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import BookingContent from "@/components/pages/BookingContent";

export default function BookingPage() {
  return (
    <AuthGuard redirectTo="/booking">
      <BookingContent />
    </AuthGuard>
  );
}
