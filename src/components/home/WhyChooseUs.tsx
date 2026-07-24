"use client";

import { motion } from "framer-motion";
import { Shield, Clock, CreditCard, Headphones, Award, MapPinned } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";

const reasons = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "All drivers are DBS checked and fully insured for your peace of mind.",
  },
  {
    icon: Clock,
    title: "Always On Time",
    description: "99% on-time arrival rate. We value your time as much as you do.",
  },
  {
    icon: CreditCard,
    title: "Transparent Pricing",
    description: "No hidden fees or surge pricing. Know your fare before you ride.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to assist you.",
  },
  {
    icon: Award,
    title: "Professional Drivers",
    description: "Experienced, courteous, and knowledgeable drivers at your service.",
  },
  {
    icon: MapPinned,
    title: "Wide Coverage",
    description: "Serving 50+ cities across the UK with reliable transport solutions.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-14 sm:py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-crimson/3 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-crimson font-semibold text-sm uppercase tracking-widest">
            Why Shine Cars
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-navy">
            Why Choose <span className="gradient-text">Us</span>
          </h2>
          <p className="mt-4 text-lg text-navy/60">
            We go above and beyond to deliver an exceptional travel experience
            every single time.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {reasons.map((reason, i) => (
            <AnimatedSection key={reason.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex gap-5 p-6 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:shadow-crimson/5 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center shrink-0">
                  <reason.icon className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-navy mb-1.5">
                    {reason.title}
                  </h3>
                  <p className="text-navy/55 text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
