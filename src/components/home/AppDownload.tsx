"use client";

import { motion } from "framer-motion";
import { Smartphone, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function AppDownload() {
  return (
    <section className="py-14 sm:py-24 bg-gray-50 relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-navy overflow-hidden p-10 sm:p-16">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-crimson/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }} />

          <div className="relative flex flex-col lg:flex-row items-center gap-12">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left">
              <AnimatedSection>
                <span className="text-gold font-semibold text-sm uppercase tracking-widest">
                  Coming Soon
                </span>
                <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                  Download Our{" "}
                  <span className="gradient-text">Mobile App</span>
                </h2>
                <p className="mt-4 text-lg text-white/50 max-w-lg">
                  Book rides, track your driver in real-time, manage payments,
                  and more — all from the convenience of your phone.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button aria-label="Download on App Store - Coming Soon" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3.5 rounded-xl hover:bg-white/15 transition-all group">
                    <Smartphone className="w-6 h-6 text-gold" />
                    <div className="text-left">
                      <div className="text-[10px] uppercase tracking-wider text-white/60">Coming Soon</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                  <button aria-label="Download on Google Play - Coming Soon" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3.5 rounded-xl hover:bg-white/15 transition-all group">
                    <Smartphone className="w-6 h-6 text-gold" />
                    <div className="text-left">
                      <div className="text-[10px] uppercase tracking-wider text-white/60">Coming Soon</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </AnimatedSection>
            </div>

            {/* Phone Mockup */}
            <AnimatedSection direction="right" className="flex-shrink-0">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="w-56 h-[420px] rounded-[2.5rem] bg-gradient-to-b from-white/10 to-white/5 border-2 border-white/20 p-3 backdrop-blur-sm">
                  <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-navy-light to-navy flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-navy rounded-b-2xl" />
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-crimson to-gold flex items-center justify-center">
                      <span className="text-white font-extrabold text-xl">SC</span>
                    </div>
                    <span className="text-white font-bold">Shine Cars</span>
                    <span className="text-white/60 text-xs">Ride Safe, Ride Smart</span>
                    <div className="w-3/4 h-2 bg-white/10 rounded-full mt-4" />
                    <div className="w-1/2 h-2 bg-white/10 rounded-full" />
                  </div>
                </div>
                {/* Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-crimson/20 to-gold/20 rounded-[3rem] blur-2xl -z-10" />
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
