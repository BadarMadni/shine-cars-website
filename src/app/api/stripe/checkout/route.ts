import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, pickup, dropoff, date, time, distance, fare, vehicle, source } = body;

    if (!name || !phone || !pickup || !dropoff || !date || !time || !fare) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create booking first with pending payment
    const booking = await prisma.booking.create({
      data: {
        name, phone, pickup, dropoff, date, time,
        distance: parseFloat(distance) || 0,
        fare: parseFloat(fare) || 0,
        vehicle: vehicle || "car",
        source: source || "website",
        status: "pending",
        paymentMethod: "card",
        paymentStatus: "pending",
      },
    });

    // Create Stripe checkout session
    const origin = req.headers.get("origin") || "https://shinecars.co.uk";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `Taxi Ride — ${vehicle === "mpv" ? "MPV" : "Car"}`,
              description: `${pickup} → ${dropoff} on ${date} at ${time}`,
            },
            unit_amount: Math.round(parseFloat(fare) * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${origin}/booking?cancelled=true`,
      metadata: {
        bookingId: booking.id,
      },
      customer_email: undefined,
    });

    return NextResponse.json({ url: session.url, bookingId: booking.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
