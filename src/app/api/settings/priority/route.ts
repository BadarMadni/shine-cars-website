import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const setting = await prisma.siteSetting.findUnique({ where: { key: "priorityEnabled" } });
  return NextResponse.json({ enabled: setting ? setting.value === "true" : true });
}
