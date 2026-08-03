"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  accountType: string;
}

interface AuthContextType {
  customer: Customer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (data: SignupData) => Promise<string | null>;
  logout: () => Promise<void>;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  accountType: "company" | "individual";
  companyName?: string;
}

const AuthContext = createContext<AuthContextType>({
  customer: null, loading: true,
  login: async () => null, signup: async () => null, logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setCustomer(d.customer || null))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || "Login failed";
    setCustomer(data.customer);
    return null;
  }, []);

  const signup = useCallback(async (info: SignupData) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info),
    });
    const data = await res.json();
    if (!res.ok) return data.error || "Signup failed";
    setCustomer(data.customer);
    return null;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCustomer(null);
  }, []);

  return (
    <AuthContext value={{ customer, loading, login, signup, logout }}>
      {children}
    </AuthContext>
  );
}

export const useAuth = () => useContext(AuthContext);
