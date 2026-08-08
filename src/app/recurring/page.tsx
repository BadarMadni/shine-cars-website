"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import RecurringList from "@/components/bookings/RecurringList";
import { Repeat } from "lucide-react";
import Link from "next/link";

export default function RecurringPage() {
  return (
    <AuthGuard redirectTo="/recurring">
      <main className="min-h-screen bg-gradient-to-b from-navy via-navy-light to-navy pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                <Repeat className="w-7 h-7 text-purple-400" />
                Recurring Bookings
              </h1>
              <p className="text-white/40 text-sm mt-1">Your scheduled recurring rides</p>
            </div>
            <Link href="/booking"
              className="bg-gradient-to-r from-crimson to-crimson-dark text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-crimson/25 transition-all">
              + New
            </Link>
          </div>
          <RecurringList />
        </div>
      </main>
    </AuthGuard>
  );
}
