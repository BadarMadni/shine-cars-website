"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import AnimatedSection from "@/components/ui/AnimatedSection";

const categories = [
  "All Taxis",
  "Sedan",
  "SUV",
  "Executive",
  "EV",
  "Minivan",
];

const taxis = [
  { category: "Sedan", image: "/images/taxi-sedan.jpg" },
  { category: "Executive", image: "/images/taxi-executive.jpg" },
  { category: "EV", image: "/images/taxi-ev.jpg" },
  { category: "SUV", image: "/images/taxi-suv.jpg" },
  { category: "Executive", image: "/images/taxi-luxury.jpg" },
  { category: "Minivan", image: "/images/taxi-minivan.jpg" },
];

export default function AvailableTaxis() {
  const [active, setActive] = useState("All Taxis");

  const filtered =
    active === "All Taxis"
      ? taxis
      : taxis.filter((t) => t.category === active);

  return (
    <section className="py-14 sm:py-24 bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gold/3 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <AnimatedSection>
            <span className="text-crimson font-semibold text-sm uppercase tracking-widest">
              Our Taxis
            </span>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold text-navy leading-tight">
              Check Available{" "}
              <span className="gradient-text">Taxis</span>
            </h2>
          </AnimatedSection>

          {/* Filter Tabs */}
          <AnimatedSection direction="right">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    active === cat
                      ? "bg-gradient-to-r from-crimson to-gold text-white shadow-lg shadow-crimson/20"
                      : "bg-white text-navy/70 border border-gray-200 hover:border-crimson/30 hover:text-crimson"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Taxi Cards */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((taxi, i) => (
              <TaxiCard key={`${taxi.category}-${i}`} taxi={taxi} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

function TaxiCard({ taxi }: { taxi: (typeof taxis)[number] }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-crimson/10 transition-all duration-500 border border-gray-100"
    >
      <div className="relative h-60 overflow-hidden">
        <Image
          src={taxi.image}
          alt={taxi.category}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
        <div className="absolute top-4 left-4 bg-white/15 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
          {taxi.category}
        </div>
      </div>

      <div className="p-5">
        <Link href="/booking">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-navy to-navy-light text-white font-semibold text-sm hover:from-crimson hover:to-crimson-dark transition-all duration-500 cursor-pointer"
          >
            Book Now <ArrowRight className="w-4 h-4" />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
}
