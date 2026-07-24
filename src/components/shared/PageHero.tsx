"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface PageHeroProps {
  title: string;
  highlight: string;
  subtitle: string;
  breadcrumb: string;
  backgroundImage?: string;
}

export default function PageHero({ title, highlight, subtitle, breadcrumb, backgroundImage }: PageHeroProps) {
  return (
    <section className="relative bg-[#1B2138] overflow-hidden pt-32 sm:pt-36 pb-16 sm:pb-20">
      {/* Background image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-navy/85" />
        </div>
      )}

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-crimson/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 text-white/60 text-sm mb-4"
        >
          <span>Home</span>
          <span>/</span>
          <span className="text-gold">{breadcrumb}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white"
        >
          {title} <span className="gradient-text">{highlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-white/65 max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-crimson via-gold to-crimson" />
    </section>
  );
}
