"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Check, Star } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";

const vehicles = [
  {
    name: "Standard Sedan",
    image: "/images/taxi-sedan.jpg",
    desc: "Comfortable sedans perfect for everyday city travel and short trips.",
    capacity: 4, bags: 2, rating: 4.8,
    features: ["Air Conditioning", "USB Charging", "Wi-Fi", "GPS Navigation"],
  },
  {
    name: "Executive Class",
    image: "/images/taxi-executive.jpg",
    desc: "Premium vehicles for business meetings, events, and VIP travel.",
    capacity: 4, bags: 3, rating: 4.9,
    features: ["Leather Seats", "Climate Control", "Complimentary Water", "Privacy Partition"],
  },
  {
    name: "SUV",
    image: "/images/taxi-suv.jpg",
    desc: "Spacious SUVs for groups, families, and extra luggage needs.",
    capacity: 6, bags: 4, rating: 4.8,
    features: ["Extra Space", "All-Terrain", "USB Charging", "Child Seat Available"],
  },
  {
    name: "Electric Vehicle",
    image: "/images/taxi-ev.jpg",
    desc: "Eco-friendly electric vehicles for a sustainable and silent ride.",
    capacity: 4, bags: 2, rating: 4.9,
    features: ["Zero Emissions", "Silent Ride", "Fast Charging", "Modern Interior"],
  },
  {
    name: "Luxury",
    image: "/images/taxi-luxury.jpg",
    desc: "Top-tier luxury vehicles for the ultimate travel experience.",
    capacity: 4, bags: 3, rating: 5.0,
    features: ["Massage Seats", "Mini Bar", "Ambient Lighting", "Chauffeur Service"],
  },
  {
    name: "Minivan / XL",
    image: "/images/taxi-minivan.jpg",
    desc: "Perfect for larger groups, events, and family travel with extra luggage.",
    capacity: 7, bags: 5, rating: 4.7,
    features: ["Sliding Doors", "Luggage Compartment", "Air Conditioning", "Spacious Seating"],
  },
];

export default function FleetContent() {
  return (
    <>
      <PageHero
        backgroundImage="/images/hero-car.jpg"
        title="Our"
        highlight="Fleet"
        subtitle="Modern, well-maintained vehicles for every occasion and group size."
        breadcrumb="Fleet"
      />

      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {vehicles.map((v, i) => (
              <AnimatedSection key={v.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/15 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      <Star className="w-3 h-3 fill-gold text-gold" /> {v.rating}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-navy mb-1">{v.name}</h3>
                    <p className="text-navy/50 text-sm mb-4">{v.desc}</p>

                    <div className="flex items-center gap-4 text-sm text-navy/60 mb-5">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-crimson" /> {v.capacity} seats
                      </span>
                      <span>{v.bags} bags</span>
                    </div>

                    <ul className="space-y-2 mt-auto">
                      {v.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-navy/60">
                          <Check className="w-4 h-4 text-green-500 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
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
