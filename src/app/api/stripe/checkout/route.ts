import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, pickup, dropoff, date, time, distance, fare, vehicle, source } = body;

    if (!name || !phone || !pickup || !dropoff || !date || !time || !fare) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

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
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking?cancelled=true`,
      metadata: {
        name, phone, pickup, dropoff, date, time,
        distance: String(distance),
        fare: String(fare),
        vehicle: vehicle || "car",
        source: source || "website",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
