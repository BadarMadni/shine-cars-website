import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, pickup, dropoff, stops, date, time, distance, fare, vehicle, source, paymentMethod } = body;

    if (!name || !phone || !pickup || !dropoff || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let customerId: string | undefined;
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      const payload = verifyToken(token);
      if (payload) customerId = payload.id;
    }

    const booking = await prisma.booking.create({
      data: {
        name, phone, pickup, dropoff, date, time,
        distance: parseFloat(distance) || 0,
        fare: parseFloat(fare) || 0,
        vehicle: vehicle || "car",
        source: source || "website",
        status: "pending",
        paymentMethod: paymentMethod || "cash",
        paymentStatus: paymentMethod === "card" ? "pending" : "unpaid",
        stops: stops?.length ? JSON.stringify(stops) : null,
        customerId,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = status && status !== "all" ? { status } : {};

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({ bookings, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
