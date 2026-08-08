import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.recurringBooking.findMany({
    where: { customerId: payload.id },
    orderBy: { createdAt: "desc" },
    include: {
      driver: { select: { name: true, phone: true } },
      bookings: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true, date: true } },
    },
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (payload.accountType !== "company") {
    return NextResponse.json({ error: "Only company accounts can create recurring bookings" }, { status: 403 });
  }

  const body = await req.json();
  const { pickup, dropoff, stops, time, vehicle, fare, distance, days, name, phone } = body;

  if (!pickup || !dropoff || !time || !fare || !days?.length || !name || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const recurring = await prisma.recurringBooking.create({
    data: {
      customerId: payload.id, pickup, dropoff, time,
      vehicle: vehicle || "car",
      fare: parseFloat(fare), distance: parseFloat(distance) || 0,
      days: JSON.stringify(days), name, phone,
      stops: stops?.length ? JSON.stringify(stops) : null,
    },
  });

  return NextResponse.json({ recurring }, { status: 201 });
}
