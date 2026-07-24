"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { SITE } from "@/lib/constants";

const contactInfo = [
  { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phone}` },
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: MapPin, label: "Address", value: SITE.address, href: "#" },
  { icon: Clock, label: "Hours", value: "24/7 Available", href: "#" },
];

export default function ContactContent() {
  return (
    <>
      <PageHero
        backgroundImage="/images/hero-car.jpg"
        title="Contact"
        highlight="Us"
        subtitle="Get in touch for bookings, enquiries, or corporate account setup."
        breadcrumb="Contact"
      />

      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy mb-2">
                  Get In <span className="gradient-text">Touch</span>
                </h2>
                <p className="text-navy/50 mb-8">
                  We&apos;d love to hear from you. Reach out to us anytime.
                </p>

                <div className="space-y-5">
                  {contactInfo.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-crimson to-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <c.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-navy/55 text-xs font-medium uppercase tracking-wider">{c.label}</div>
                        <div className="text-navy font-semibold mt-0.5">{c.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <AnimatedSection direction="right">
                <div className="bg-gray-50 rounded-3xl p-6 sm:p-10 border border-gray-100">
                  <h3 className="text-xl font-bold text-navy mb-6">Send a Message</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="sr-only">Your Name</label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Your Name"
                          className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 text-navy text-sm outline-none focus:border-crimson/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="sr-only">Your Email</label>
                        <input
                          id="email"
                          type="email"
                          placeholder="Your Email"
                          className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 text-navy text-sm outline-none focus:border-crimson/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="sr-only">Subject</label>
                      <input
                        id="subject"
                        type="text"
                        placeholder="Subject"
                        className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 text-navy text-sm outline-none focus:border-crimson/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="sr-only">Your Message</label>
                      <textarea
                        id="message"
                        placeholder="Your Message"
                        rows={5}
                        className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 text-navy text-sm outline-none focus:border-crimson/50 transition-colors resize-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-crimson/20 cursor-pointer"
                    >
                      Send Message <Send className="w-4 h-4" />
                    </motion.button>
                  </form>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
