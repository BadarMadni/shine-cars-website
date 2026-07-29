import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ customer: null }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ customer: null }, { status: 401 });
  }

  return NextResponse.json({
    customer: {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      accountType: payload.accountType,
    },
  });
}
