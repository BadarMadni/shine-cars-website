import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  if (!date || !time) {
    return NextResponse.json({ event: null });
  }

  const events = await prisma.eventPricing.findMany({ where: { isActive: true } });
  const bookingDT = new Date(`${date}T${time}:00`).getTime();

  for (const e of events) {
    const start = new Date(`${e.startDate}T${e.startTime}:00`).getTime();
    const end = new Date(`${e.endDate}T${e.endTime}:00`).getTime();
    if (bookingDT >= start && bookingDT <= end) {
      return NextResponse.json({ event: { id: e.id, name: e.name, increasePercent: e.increasePercent } });
    }
  }

  return NextResponse.json({ event: null });
}
