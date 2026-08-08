"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Navigation, Calendar, CheckCircle, CreditCard } from "lucide-react";
import Link from "next/link";

interface InvoiceItem { id: string; fare: number; date: string; pickup: string; dropoff: string }
interface Invoice {
  id: string; weekStart: string; weekEnd: string; total: number; status: string;
  customer: { name: string; companyName: string | null };
  items: InvoiceItem[];
}

export default function InvoiceDetailView({ id }: { id: string }) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("paid") === "true";

  useEffect(() => {
    fetch(`/api/invoices/${id}`).then((r) => r.json())
      .then((d) => setInvoice(d.invoice || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handlePay = async () => {
    setPaying(true);
    const res = await fetch(`/api/invoices/${id}/pay`, { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setPaying(false);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-crimson/30 border-t-crimson rounded-full animate-spin" /></div>;
  }
  if (!invoice) {
    return <p className="text-white/40 text-center py-12">Invoice not found.</p>;
  }

  return (
    <div>
      <Link href="/invoices" className="inline-flex items-center gap-2 text-white/50 hover:text-gold text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Invoices
      </Link>

      {justPaid && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
          <p className="text-green-400 text-sm font-medium">Payment successful! Thank you.</p>
        </motion.div>
      )}

      <div className="bg-white/[0.06] border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-white">{invoice.customer.companyName || invoice.customer.name}</h2>
              <p className="text-white/40 text-sm mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {invoice.weekStart} — {invoice.weekEnd}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-white">&pound;{invoice.total.toFixed(2)}</p>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                invoice.status === "paid" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
              }`}>{invoice.status.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-3">
          <p className="text-white/50 text-xs font-medium mb-2">{invoice.items.length} Bookings</p>
          {invoice.items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
              className="bg-white/[0.04] border border-white/5 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/50 text-xs">{item.date}</span>
                <span className="text-white font-bold text-sm">&pound;{item.fare.toFixed(2)}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <MapPin className="w-3 h-3 text-green-400 shrink-0" />
                  <span className="truncate">{item.pickup}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Navigation className="w-3 h-3 text-crimson shrink-0" />
                  <span className="truncate">{item.dropoff}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {invoice.status === "unpaid" && (
          <div className="p-5 sm:p-6 border-t border-white/10">
            <button onClick={handlePay} disabled={paying}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
              <CreditCard className="w-4 h-4" />
              {paying ? "Redirecting to Stripe..." : `Pay £${invoice.total.toFixed(2)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
