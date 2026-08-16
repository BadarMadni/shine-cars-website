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
    return NextResponse.json({ success: true, status: "paid" });
  }
  if (!invoice.stripeId) {
    return NextResponse.json({ error: "No payment session" }, { status: 400 });
  }

  // Verify with Stripe
  const key = process.env.STRIPE_SECRET_KEY!;
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${invoice.stripeId}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const session = await res.json();

  if (session.payment_status === "paid") {
    await prisma.invoice.update({
      where: { id },
      data: { status: "paid", paidAt: new Date() },
    });
    return NextResponse.json({ success: true, status: "paid" });
  }

  return NextResponse.json({ success: false, status: session.payment_status });
}
