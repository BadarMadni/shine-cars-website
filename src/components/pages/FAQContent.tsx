"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { FAQ_ITEMS } from "@/lib/constants";

export default function FAQContent() {
  return (
    <>
      <PageHero
        title="Frequently Asked"
        highlight="Questions"
        subtitle="Find answers to common questions about our services."
        breadcrumb="FAQ"
      />

      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <FAQItem question={item.question} answer={item.answer} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className={`rounded-2xl border transition-all duration-300 ${
        open ? "border-crimson/20 bg-gray-50 shadow-sm" : "border-gray-100 bg-white"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer"
      >
        <span className="text-navy font-semibold text-sm sm:text-base">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <ChevronDown className={`w-5 h-5 ${open ? "text-crimson" : "text-navy/30"}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-navy/55 text-sm leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
