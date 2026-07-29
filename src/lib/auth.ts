import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "shine-cars-customer-secret-2024";

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  accountType: string;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export const COOKIE_NAME = "shine_customer_token";
