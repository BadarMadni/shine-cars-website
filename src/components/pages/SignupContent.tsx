"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import AccountTypeModal from "@/components/auth/AccountTypeModal";

export default function SignupContent() {
  const router = useRouter();
  const { signup } = useAuth();
  const [step, setStep] = useState<"type" | "form">("type");
  const [accountType, setAccountType] = useState<"company" | "individual">("individual");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTypeSelect = (type: "company" | "individual") => {
    setAccountType(type);
    setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password || (accountType === "company" && !companyName)) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setLoading(true);
    const err = await signup({ name, email, phone, password, accountType, companyName: accountType === "company" ? companyName : undefined });
    setLoading(false);
    if (err) { setError(err); return; }
    router.push("/booking");
  };

  const inputRow = (id: string, label: string, icon: React.ReactNode, type: string,
    value: string, onChange: (v: string) => void, placeholder: string) => (
    <div>
      <label htmlFor={id} className="block text-navy/70 text-sm font-medium mb-1.5">{label}</label>
      <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors">
        {icon}
        <input id={id} type={type} value={value}
          onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="bg-transparent text-navy text-sm outline-none w-full placeholder:text-navy/35" />
      </div>
    </div>
  );

  return (
    <>
      <PageHero
        backgroundImage="/images/hero-car.jpg"
        title="Create Your"
        highlight="Account"
        subtitle="Sign up to start booking rides with Shine Cars."
        breadcrumb="Sign Up"
      />

      <AccountTypeModal open={step === "type"} onSelect={handleTypeSelect}
        onClose={() => router.back()} />

      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-md px-5">
          <AnimatedSection>
            <form onSubmit={handleSubmit}
              className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-100 space-y-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-bold text-navy">
                  Sign <span className="gradient-text">Up</span>
                </h2>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  accountType === "company"
                    ? "bg-gold/10 text-gold" : "bg-crimson/10 text-crimson"
                }`}>
                  {accountType === "company" ? "Company" : "Individual"}
                </span>
              </div>
              <p className="text-navy/50 text-sm mb-6">
                Fill in your details to create an account.{" "}
                <button type="button" onClick={() => setStep("type")}
                  className="text-crimson font-medium hover:underline cursor-pointer">
                  Change type
                </button>
              </p>

              {accountType === "company" && inputRow("signup-company", "Company Name",
                <Building2 className="w-4 h-4 text-navy/30 shrink-0" />,
                "text", companyName, setCompanyName, "Shine Cars Ltd")}
              {inputRow("signup-name", "Full Name",
                <User className="w-4 h-4 text-navy/30 shrink-0" />,
                "text", name, setName, "John Smith")}
              {inputRow("signup-email", "Email",
                <Mail className="w-4 h-4 text-navy/30 shrink-0" />,
                "email", email, setEmail, "you@example.com")}
              {inputRow("signup-phone", "Phone Number",
                <Phone className="w-4 h-4 text-navy/30 shrink-0" />,
                "tel", phone, setPhone, "+44 7XXX XXXXXX")}

              <div>
                <label htmlFor="signup-pw" className="block text-navy/70 text-sm font-medium mb-1.5">Password</label>
                <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-gray-200 focus-within:border-crimson/50 transition-colors">
                  <Lock className="w-4 h-4 text-navy/30 shrink-0" />
                  <input id="signup-pw" type={showPw ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters"
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
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>

              <p className="text-center text-navy/50 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-crimson font-semibold hover:underline">
                  Log In
                </Link>
              </p>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
