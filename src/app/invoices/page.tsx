"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import InvoiceList from "@/components/invoices/InvoiceList";

export default function InvoicesPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-navy via-navy-light to-navy pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Invoices</h1>
          <p className="text-white/50 text-sm mb-8">Your weekly company invoices.</p>
          <InvoiceList />
        </div>
      </div>
    </AuthGuard>
  );
}
