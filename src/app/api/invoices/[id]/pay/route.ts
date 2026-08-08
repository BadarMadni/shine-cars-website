import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice || invoice.customerId !== payload.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (invoice.status === "paid") {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  const origin = req.headers.get("origin") || "https://shinecars.co.uk";
  const key = process.env.STRIPE_SECRET_KEY!;

  const p = new URLSearchParams();
  p.append("mode", "payment");
  p.append("payment_method_types[0]", "card");
  p.append("line_items[0][price_data][currency]", "gbp");
  p.append("line_items[0][price_data][product_data][name]", `Invoice ${invoice.weekStart} — ${invoice.weekEnd}`);
  p.append("line_items[0][price_data][product_data][description]", `Weekly invoice for company account`);
  p.append("line_items[0][price_data][unit_amount]", String(Math.round(invoice.total * 100)));
  p.append("line_items[0][quantity]", "1");
  p.append("success_url", `${origin}/invoices/${id}?paid=true`);
  p.append("cancel_url", `${origin}/invoices/${id}?cancelled=true`);
  p.append("metadata[invoiceId]", id);
  p.append("metadata[customerId]", payload.id);

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: p.toString(),
  });

  const data = await res.json();
  if (data.url) {
    await prisma.invoice.update({ where: { id }, data: { stripeId: data.id } });
    return NextResponse.json({ url: data.url });
  }
  return NextResponse.json({ error: data.error?.message || "Stripe error" }, { status: 500 });
}
