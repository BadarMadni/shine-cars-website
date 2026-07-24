"use client";

import { motion } from "framer-motion";
import {
  Plane, Briefcase, Crown, Building2, MapPin, Accessibility,
} from "lucide-react";
import { SERVICES } from "@/lib/constants";
import AnimatedSection from "@/components/ui/AnimatedSection";

const iconMap: Record<string, React.ElementType> = {
  Plane, Briefcase, Crown, Building2, MapPin, Accessibility,
};

export default function ServicesSection() {
  return (
    <section className="py-14 sm:py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-crimson/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-crimson font-semibold text-sm uppercase tracking-widest">
            What We Offer
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-navy">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            From airport pickups to corporate travel, we provide premium
            transport solutions tailored to your needs.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {SERVICES.map((service, i) => {
            const Icon = iconMap[service.icon];
            return (
              <AnimatedSection key={service.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-crimson/10 transition-all duration-500"
                >
                  {/* Gradient border on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-crimson/20 to-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl" />

                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-crimson to-gold flex items-center justify-center mb-6">
                    {Icon && <Icon className="w-7 h-7 text-white" />}
                  </div>

                  <h3 className="text-xl font-bold text-navy mb-3">
                    {service.title}
                  </h3>
                  <p className="text-navy/60 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-crimson font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn More
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
