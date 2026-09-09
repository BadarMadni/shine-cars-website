import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const openSetting = await prisma.siteSetting.findUnique({ where: { key: "systemOpen" } });
  const timeSetting = await prisma.siteSetting.findUnique({ where: { key: "reopeningTime" } });
  return NextResponse.json({
    open: openSetting ? openSetting.value === "true" : true,
    reopeningTime: timeSetting?.value || "08:00",
  });
}
