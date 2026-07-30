import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, pickup, dropoff, date, time, distance, fare, vehicle, source } = body;

    if (!name || !phone || !pickup || !dropoff || !date || !time || !fare) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://shinecars.co.uk";
    const key = process.env.STRIPE_SECRET_KEY!;

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("payment_method_types[0]", "card");
    params.append("line_items[0][price_data][currency]", "gbp");
    params.append("line_items[0][price_data][product_data][name]", `Taxi Ride — ${vehicle === "mpv" ? "MPV" : "Car"}`);
    params.append("line_items[0][price_data][product_data][description]", `${pickup} → ${dropoff} on ${date} at ${time}`);
    params.append("line_items[0][price_data][unit_amount]", String(Math.round(parseFloat(fare) * 100)));
    params.append("line_items[0][quantity]", "1");
    params.append("success_url", `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${origin}/booking?cancelled=true`);
    params.append("metadata[name]", name);
    params.append("metadata[phone]", phone);
    params.append("metadata[pickup]", pickup);
    params.append("metadata[dropoff]", dropoff);
    params.append("metadata[date]", date);
    params.append("metadata[time]", time);
    params.append("metadata[distance]", String(distance));
    params.append("metadata[fare]", String(fare));
    params.append("metadata[vehicle]", vehicle || "car");
    params.append("metadata[source]", source || "website");

    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      const payload = verifyToken(token);
      if (payload) params.append("metadata[customerId]", payload.id);
    }

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();
    if (data.url) return NextResponse.json({ url: data.url });
    return NextResponse.json({ error: data.error?.message || "Stripe error" }, { status: 500 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
