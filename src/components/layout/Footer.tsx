"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/constants";
import AnimatedSection from "@/components/ui/AnimatedSection";

const quickLinks = [
  { label: "Airport Transfers", href: "/services" },
  { label: "Corporate Accounts", href: "/services" },
  { label: "Our Fleet", href: "/fleet" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1B2138] text-white">
      {/* CTA Strip */}
      <div className="bg-gradient-to-r from-crimson to-crimson-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <AnimatedSection className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Ready to Experience Premium Travel?
              </h3>
              <p className="text-white/80 mt-2">
                Book your ride today and travel in comfort & style.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-white text-crimson px-8 py-4 rounded-full font-bold text-lg hover:bg-gold hover:text-navy transition-all duration-300 whitespace-nowrap"
            >
              Book Your Ride
            </Link>
          </AnimatedSection>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Image
              src="/logo-dark.png"
              alt={SITE.name}
              width={200}
              height={65}
              className="h-16 sm:h-20 w-auto mb-5"
            />
            <p className="text-white/60 leading-relaxed">
              {SITE.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-5 gradient-text">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-5 gradient-text">Services</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-5 gradient-text">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <a href={`tel:${SITE.phone}`} className="text-white/60 hover:text-gold transition-colors">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <a href={`mailto:${SITE.email}`} className="text-white/60 hover:text-gold transition-colors">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-white/60">{SITE.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/60 text-sm">
            <p>&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gold transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
