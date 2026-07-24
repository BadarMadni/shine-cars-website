"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Shield, Clock, Star } from "lucide-react";
import GradientButton from "@/components/ui/GradientButton";
import BookingCard from "@/components/home/BookingCard";
import HeroStats from "@/components/home/HeroStats";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-car.jpg"
          alt="Shine Cars branded vehicle at airport"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/80 to-navy/95 sm:bg-gradient-to-r sm:from-navy/95 sm:via-navy/85 sm:to-navy/40" />
      </div>

      {/* Light rays effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/3 w-[2px] h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent rotate-[20deg] origin-top"
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-0 left-2/3 w-[1px] h-full bg-gradient-to-b from-transparent via-crimson/10 to-transparent rotate-[-15deg] origin-top"
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
        />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-crimson/5 rounded-full blur-[80px]" />
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex items-center">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-8 sm:pb-16 w-full">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 lg:gap-16">
            {/* Left: Text */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-6"
              >
                <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                <span className="text-gold text-xs font-bold tracking-wider uppercase">
                  #1 Rated Transport in UK
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-[4.5rem] font-extrabold text-white tracking-tight"
              >
                Ride Safe,
                <br />
                <span className="relative">
                  <span className="gradient-text">Ride Smart</span>
                  <motion.span
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-crimson to-gold rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-5 text-base sm:text-lg text-white/55 max-w-md mx-auto lg:mx-0 leading-relaxed"
              >
                Premium rides with professional drivers and modern vehicles.
                Airport transfers, corporate travel, and city rides across the UK.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <GradientButton href="/contact" size="lg">
                  Book a Ride <ArrowRight className="w-5 h-5" />
                </GradientButton>
                <GradientButton href="/services" variant="outline" size="lg">
                  Explore Services
                </GradientButton>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mt-10 flex flex-wrap justify-center lg:justify-start gap-5"
              >
                <TrustBadge icon={Shield} text="Fully Insured" />
                <TrustBadge icon={Clock} text="24/7 Service" />
                <TrustBadge icon={Star} text="4.9 Rating" />
              </motion.div>
            </div>

            {/* Right: Quick Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="w-full sm:w-[380px] lg:w-[360px] shrink-0"
            >
              <BookingCard />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Stats Strip */}
      <HeroStats />

      {/* Fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson via-gold to-crimson" />
    </section>
  );
}

function TrustBadge({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-gold" />
      </div>
      <span className="text-white/60 text-sm font-medium">{text}</span>
    </div>
  );
}
