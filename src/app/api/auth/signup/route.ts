import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, accountType } = await req.json();

    if (!name || !email || !phone || !password || !accountType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (!["company", "individual"].includes(accountType)) {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
    }

    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: { name, email, phone, password: hashed, accountType },
    });

    const token = signToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      accountType: customer.accountType,
    });

    const res = NextResponse.json({
      customer: {
        id: customer.id, name: customer.name,
        email: customer.email, phone: customer.phone,
        accountType: customer.accountType,
      },
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
