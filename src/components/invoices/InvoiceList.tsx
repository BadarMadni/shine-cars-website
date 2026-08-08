"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Calendar } from "lucide-react";

interface Invoice {
  id: string; weekStart: string; weekEnd: string; total: number;
  status: string; createdAt: string; _count: { items: number };
}

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/invoices").then((r) => r.json())
      .then((d) => setInvoices(d.invoices || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-crimson/30 border-t-crimson rounded-full animate-spin" /></div>;
  }

  if (!invoices.length) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-white/15 mx-auto mb-4" />
        <p className="text-white/40 text-sm">No invoices yet.</p>
        <p className="text-white/25 text-xs mt-1">Invoices are generated weekly for company accounts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invoices.map((inv, i) => (
        <motion.div key={inv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}>
          <Link href={`/invoices/${inv.id}`}
            className="block bg-white/[0.06] border border-white/10 rounded-2xl p-4 sm:p-5 hover:bg-white/[0.09] transition-colors group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span className="text-white/70 text-sm">{inv.weekStart} — {inv.weekEnd}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-white font-extrabold text-lg">&pound;{inv.total.toFixed(2)}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    inv.status === "paid" ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                  }`}>{inv.status.toUpperCase()}</span>
                  <span className="text-white/30 text-xs">{inv._count.items} rides</span>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-gold transition-colors shrink-0" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
