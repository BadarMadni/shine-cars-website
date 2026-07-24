"use client";

import { motion } from "framer-motion";
import {
  Plane, Briefcase, Crown, Building2, MapPin, Accessibility,
  CheckCircle, ArrowRight,
} from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import GradientButton from "@/components/ui/GradientButton";

const services = [
  {
    icon: Plane,
    title: "Airport Transfers",
    desc: "Reliable pickups and drop-offs to all major UK airports including Heathrow, Gatwick, Stansted, Manchester, and more.",
    features: ["Flight tracking", "Meet & greet", "Fixed prices", "Free waiting time"],
  },
  {
    icon: Briefcase,
    title: "Corporate Accounts",
    desc: "Tailored transport solutions for businesses with priority booking, monthly invoicing, and dedicated account management.",
    features: ["Priority booking", "Monthly invoicing", "Dedicated manager", "Employee portal"],
  },
  {
    icon: Crown,
    title: "Executive Rides",
    desc: "Premium vehicles with professional chauffeurs for business meetings, events, and VIP occasions.",
    features: ["Luxury vehicles", "Professional chauffeurs", "Complimentary refreshments", "Privacy guaranteed"],
  },
  {
    icon: Building2,
    title: "City Transfers",
    desc: "Quick and comfortable rides across the city with fixed fares and no hidden charges.",
    features: ["Fixed fares", "No surge pricing", "Multiple stops", "24/7 availability"],
  },
  {
    icon: MapPin,
    title: "Long Distance",
    desc: "Comfortable long-distance travel with experienced drivers at competitive rates for intercity journeys.",
    features: ["Competitive rates", "Comfort stops", "Experienced drivers", "Door-to-door"],
  },
  {
    icon: Accessibility,
    title: "Wheelchair Accessible",
    desc: "Fully equipped accessible vehicles ensuring comfortable and dignified travel for all passengers.",
    features: ["Ramp access", "Trained drivers", "Spacious interiors", "Easy booking"],
  },
];

export default function ServicesContent() {
  return (
    <>
      <PageHero
        backgroundImage="/images/hero-car.jpg"
        title="Our"
        highlight="Services"
        subtitle="Premium transport solutions tailored to every need and occasion."
        breadcrumb="Services"
      />

      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="space-y-8 sm:space-y-12">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} delay={0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`flex flex-col lg:flex-row gap-8 p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-crimson/5 transition-all ${
                    i % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Icon & Title */}
                  <div className="lg:w-1/3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-crimson to-gold flex items-center justify-center mb-5">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-navy mb-3">
                      {service.title}
                    </h3>
                    <p className="text-navy/55 leading-relaxed">{service.desc}</p>
                    <div className="mt-6">
                      <GradientButton href="/contact" size="sm">
                        Book Now <ArrowRight className="w-4 h-4" />
                      </GradientButton>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="lg:w-2/3 flex items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      {service.features.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-3 bg-gray-50 rounded-xl px-5 py-4 border border-gray-100"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                          <span className="text-navy/70 font-medium text-sm">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
