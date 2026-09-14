import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [radius, rate] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: "surchargeRadiusMiles" } }),
    prisma.siteSetting.findUnique({ where: { key: "surchargePerMile" } }),
  ]);
  return NextResponse.json({
    radiusMiles: radius ? Number(radius.value) : 3,
    perMile: rate ? Number(rate.value) : 1,
  });
}
