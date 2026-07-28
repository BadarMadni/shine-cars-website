"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, XCircle } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"loading" | "paid" | "failed">("loading");

  useEffect(() => {
    const sessionId = params.get("session_id");
    const bookingId = params.get("booking_id");

    if (!sessionId || !bookingId) {
      setStatus("failed");
      return;
    }

    fetch("/api/stripe/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, bookingId }),
    })
      .then((r) => r.json())
      .then((d) => setStatus(d.success ? "paid" : "failed"))
      .catch(() => setStatus("failed"));
  }, [params]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/[0.07] backdrop-blur-xl border border-white/15 rounded-3xl p-10 max-w-md w-full text-center"
    >
      {status === "loading" && (
        <>
          <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-white text-xl font-bold">Confirming payment...</h2>
          <p className="text-white/50 text-sm mt-2">Please wait a moment.</p>
        </>
      )}

      {status === "paid" && (
        <>
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-white/60 text-sm mb-8">
            Your booking is confirmed and payment has been received. We&apos;ll send you a confirmation shortly.
          </p>
          <Link href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm py-3 px-8 rounded-xl shadow-lg shadow-crimson/25">
            Back to Home <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Payment Issue</h2>
          <p className="text-white/60 text-sm mb-8">
            We couldn&apos;t confirm your payment. Please try booking again or pay with cash.
          </p>
          <Link href="/booking"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm py-3 px-8 rounded-xl shadow-lg shadow-crimson/25">
            Try Again <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}
    </motion.div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-6" />
          <p className="text-white/50 text-sm">Loading...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
