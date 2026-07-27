"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
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
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in name, email, and message.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.message || "Failed to send. Please try again.");
      }
    } catch {
      setError("Failed to send. Please try again.");
    }
    setSending(false);
  };

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
                  {sent ? (
                    <div className="text-center py-10">
                      <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-navy mb-2">Message Sent!</h4>
                      <p className="text-navy/50 text-sm mb-6">We&apos;ll get back to you as soon as possible.</p>
                      <button onClick={() => setSent(false)}
                        className="text-crimson font-semibold text-sm hover:underline cursor-pointer">
                        Send another message
                      </button>
                    </div>
                  ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="sr-only">Your Name</label>
                        <input
                          id="name"
                          type="text"
                          placeholder="Your Name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 text-navy text-sm outline-none focus:border-crimson/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="sr-only">Your Email</label>
                        <input
                          id="email"
                          type="email"
                          placeholder="Your Email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 text-navy text-sm outline-none focus:border-crimson/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="sr-only">Your Message</label>
                      <textarea
                        id="message"
                        placeholder="Your Message"
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-5 py-3.5 rounded-xl bg-white border border-gray-200 text-navy text-sm outline-none focus:border-crimson/50 transition-colors resize-none"
                      />
                    </div>
                    {error && <p className="text-crimson text-sm font-medium">{error}</p>}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={sending}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-crimson to-crimson-dark text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-crimson/20 cursor-pointer disabled:opacity-60"
                    >
                      {sending ? "Sending..." : "Send Message"} {!sending && <Send className="w-4 h-4" />}
                    </motion.button>
                  </form>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
