"use client";

import { use } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import InvoiceDetailView from "@/components/invoices/InvoiceDetailView";

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-navy via-navy-light to-navy pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <InvoiceDetailView id={id} />
        </div>
      </div>
    </AuthGuard>
  );
}
