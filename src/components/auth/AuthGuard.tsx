"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function AuthGuard({ children, redirectTo }: Props) {
  const { customer, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !customer) {
      const target = redirectTo || window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(target)}`);
    }
  }, [loading, customer, router, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-crimson/30 border-t-crimson rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) return null;

  return <>{children}</>;
}
