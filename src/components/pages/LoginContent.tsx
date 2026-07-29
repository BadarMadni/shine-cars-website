"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function LoginContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("All fields are required"); return; }
    setError("");
    setLoading(true);
    const err = await login(email, password);
    setLoading(false);
    if (err) { setError(err); return; }
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    router.push(redirect || "/booking");
  };

  return (
    <>
      <PageHero
        backgroundImage="/images/hero-car.jpg"
        title="Welcome"
        highlight="Back"
        subtitle="Log in to your account to book rides."
        breadcrumb="Login"
      />
      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-md px-5">
          <AnimatedSection>
            <form onSubmit={handleSubmit}
              className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-100 space-y-5">
              <h2 className="text-2xl font-bold text-navy mb-1">
                Log <span className="gradient-text">In</span>
              </h2>
              <p className="text-navy/50 text-sm mb-6">
                Enter your credentials to continue.
              </p>

              <div>
                <label htmlFor="login-email" className="block text-navy/70 text-sm font-medium mb-1.5">Email</label>
                <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors">
                  <Mail className="w-4 h-4 text-navy/30 shrink-0" />
                  <input id="login-email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-transparent text-navy text-sm outline-none w-full placeholder:text-navy/35" />
                </div>
              </div>

              <div>
                <label htmlFor="login-pw" className="block text-navy/70 text-sm font-medium mb-1.5">Password</label>
                <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors">
                  <Lock className="w-4 h-4 text-navy/30 shrink-0" />
                  <input id="login-pw" type={showPw ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="bg-transparent text-navy text-sm outline-none w-full placeholder:text-navy/35" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="text-navy/30 hover:text-navy/60 cursor-pointer">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-crimson text-sm font-medium">{error}</p>}

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-crimson/20 cursor-pointer disabled:opacity-60">
                {loading ? "Logging in..." : "Log In"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>

              <p className="text-center text-navy/50 text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-crimson font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
