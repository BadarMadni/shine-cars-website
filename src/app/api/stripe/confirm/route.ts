import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { sessionId, bookingId } = await req.json();

    if (!sessionId || !bookingId) {
      return NextResponse.json({ error: "Missing session or booking ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: "paid" },
      });
      return NextResponse.json({ success: true, status: "paid" });
    }

    return NextResponse.json({ success: false, status: session.payment_status });
  } catch {
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
