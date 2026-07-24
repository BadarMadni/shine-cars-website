"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function TestimonialsSection() {
  return (
    <section className="py-14 sm:py-24 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-crimson font-semibold text-sm uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-navy">
            What Our <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            Don&apos;t just take our word for it. Hear from our satisfied customers.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <AnimatedSection key={t.name} delay={i * 0.15}>
              <motion.div
                whileHover={{ y: -6 }}
                className="relative p-8 rounded-2xl bg-gradient-to-br from-navy to-navy-light text-white group"
              >
                <Quote className="w-10 h-10 text-crimson/30 mb-4" />

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                <p className="text-white/70 leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-crimson to-gold flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-white/60 text-xs">{t.role}</div>
                  </div>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-crimson/10 to-transparent rounded-bl-3xl rounded-tr-2xl" />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
