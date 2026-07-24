"use client";

import { motion } from "framer-motion";
import { Users, Check } from "lucide-react";
import { FLEET } from "@/lib/constants";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GradientButton from "@/components/ui/GradientButton";

export default function FleetSection() {
  return (
    <section className="py-14 sm:py-24 bg-gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold font-semibold text-sm uppercase tracking-widest">
            Our Vehicles
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-white">
            Premium <span className="gradient-text">Fleet</span>
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Choose from our range of modern, well-maintained vehicles
            to suit every occasion.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLEET.map((vehicle, i) => (
            <AnimatedSection key={vehicle.name} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all duration-500"
              >
                {/* Top gradient bar */}
                <div className="h-1.5 bg-gradient-to-r from-crimson to-gold" />

                <div className="p-7">
                  {/* Vehicle icon placeholder */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-crimson/20 to-gold/20 flex items-center justify-center mb-5 group-hover:from-crimson/30 group-hover:to-gold/30 transition-all">
                    <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-gold">
                      <path d="M5 17h14M7 11l1.5-4.5h7L17 11M6 17V11h12v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="8" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                      <circle cx="16" cy="17" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {vehicle.name}
                  </h3>
                  <p className="text-white/50 text-sm mb-4">
                    {vehicle.description}
                  </p>

                  <div className="flex items-center gap-2 text-gold text-sm font-medium mb-5">
                    <Users className="w-4 h-4" />
                    {vehicle.capacity}
                  </div>

                  <ul className="space-y-2.5">
                    {vehicle.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-white/60 text-sm">
                        <Check className="w-4 h-4 text-green-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.5} className="text-center mt-14">
          <GradientButton href="/fleet" variant="gold">
            View Full Fleet
          </GradientButton>
        </AnimatedSection>
      </div>
    </section>
  );
}
