"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, UserCircle, LogOut } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { customer, loading, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#1B2138] shadow-2xl shadow-black/20"
          : "bg-[#1B2138] lg:bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-dark.png" alt={SITE.name} width={200} height={65}
              className="h-14 sm:h-16 w-auto" priority />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-white/80 hover:text-gold text-sm font-medium transition-colors duration-300 relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-crimson to-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href={`tel:${SITE.phone}`}
              className="flex items-center gap-1.5 text-gold font-semibold text-sm whitespace-nowrap">
              <Phone className="w-3.5 h-3.5" />
              {SITE.phone}
            </a>

            {!loading && customer ? (
              <div className="flex items-center gap-2">
                <Link href="/my-bookings"
                  className="text-white/80 hover:text-gold font-medium transition-colors text-xs">
                  Bookings
                </Link>
                {customer.accountType === "company" && (
                  <>
                    <Link href="/recurring"
                      className="text-white/80 hover:text-gold font-medium transition-colors text-xs">
                      Recurring
                    </Link>
                    <Link href="/invoices"
                      className="text-white/80 hover:text-gold font-medium transition-colors text-xs">
                      Invoices
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-1.5 text-white/80 text-xs border-l border-white/10 pl-2 ml-1">
                  <UserCircle className="w-4 h-4 text-gold" />
                  <span className="font-medium max-w-[90px] truncate">{customer.name}</span>
                </div>
                <button onClick={logout}
                  className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                  title="Logout">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
                <Link href="/booking"
                  className="bg-gradient-to-r from-crimson to-crimson-dark text-white px-5 py-2 rounded-full font-semibold text-sm hover:shadow-[0_0_25px_rgba(204,34,41,0.4)] transition-all duration-300">
                  Book Now
                </Link>
              </div>
            ) : !loading ? (
              <div className="flex items-center gap-3">
                <Link href="/login"
                  className="text-white/80 hover:text-white font-medium transition-colors">
                  Login
                </Link>
                <Link href="/signup"
                  className="bg-gradient-to-r from-crimson to-crimson-dark text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-[0_0_25px_rgba(204,34,41,0.4)] transition-all duration-300">
                  Sign Up
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white p-2" aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy/98 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-3">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <Link href={link.href} onClick={() => setIsOpen(false)}
                    className="block py-3 px-4 text-white/80 hover:text-gold hover:bg-white/5 rounded-lg font-medium transition-all">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {!loading && customer ? (
                  <>
                    <div className="flex items-center gap-2 px-4 text-white/60 text-sm">
                      <UserCircle className="w-5 h-5 text-gold" />
                      <span>{customer.name}</span>
                      <span className="text-white/30 text-xs">({customer.accountType})</span>
                    </div>
                    <Link href="/my-bookings" onClick={() => setIsOpen(false)}
                      className="block text-center text-white/80 hover:text-gold py-3 font-medium">
                      My Bookings
                    </Link>
                    {customer.accountType === "company" && (
                      <>
                        <Link href="/recurring" onClick={() => setIsOpen(false)}
                          className="block text-center text-white/80 hover:text-gold py-3 font-medium">
                          Recurring
                        </Link>
                        <Link href="/invoices" onClick={() => setIsOpen(false)}
                          className="block text-center text-white/80 hover:text-gold py-3 font-medium">
                          Invoices
                        </Link>
                      </>
                    )}
                    <Link href="/booking" onClick={() => setIsOpen(false)}
                      className="block text-center bg-gradient-to-r from-crimson to-crimson-dark text-white py-3 rounded-full font-semibold">
                      Book Now
                    </Link>
                    <button onClick={() => { logout(); setIsOpen(false); }}
                      className="w-full text-center text-white/40 hover:text-red-400 py-2 text-sm cursor-pointer">
                      Logout
                    </button>
                  </>
                ) : !loading ? (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}
                      className="block text-center text-white/80 hover:text-white py-3 font-medium">
                      Login
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}
                      className="block text-center bg-gradient-to-r from-crimson to-crimson-dark text-white py-3 rounded-full font-semibold">
                      Sign Up
                    </Link>
                  </>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
