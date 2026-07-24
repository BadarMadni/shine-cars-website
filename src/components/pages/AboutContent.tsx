"use client";

import { motion } from "framer-motion";
import { Target, Eye, Heart, Users, Car, Award, Clock, MapPin } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";

const values = [
  { icon: Heart, title: "Customer First", desc: "Every decision we make puts our passengers' comfort and safety at the forefront." },
  { icon: Award, title: "Excellence", desc: "We maintain the highest standards in vehicles, drivers, and service quality." },
  { icon: Clock, title: "Reliability", desc: "On-time, every time. We understand the value of your time and respect it." },
  { icon: Users, title: "Integrity", desc: "Transparent pricing, honest service, and genuine care for every customer." },
];

const stats = [
  { value: "2018", label: "Founded" },
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Professional Drivers" },
  { value: "50+", label: "Cities Covered" },
];

export default function AboutContent() {
  return (
    <>
      <PageHero
        backgroundImage="/images/hero-car.jpg"
        title="About"
        highlight="Shine Cars"
        subtitle="Discover the story behind the UK's most trusted premium transport service."
        breadcrumb="About Us"
      />

      {/* Story Section */}
      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection>
              <span className="text-crimson font-semibold text-sm uppercase tracking-widest">Our Story</span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-navy">
                Redefining <span className="gradient-text">Transport</span> in the UK
              </h2>
              <p className="mt-5 text-navy/60 leading-relaxed">
                Founded in 2018, Shine Cars began with a simple mission: to provide safe,
                reliable, and premium transport services across the United Kingdom. What
                started as a small fleet of vehicles has grown into one of the most trusted
                transport companies in the country.
              </p>
              <p className="mt-4 text-navy/60 leading-relaxed">
                We believe every journey should be an experience, not just a ride. Our
                professional drivers, modern fleet, and commitment to excellence set us
                apart from traditional taxi services.
              </p>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    whileHover={{ y: -4 }}
                    className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100"
                  >
                    <div className="text-3xl sm:text-4xl font-extrabold gradient-text">{s.value}</div>
                    <div className="mt-2 text-navy/50 text-sm font-medium">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-14 sm:py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <AnimatedSection>
              <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-crimson to-crimson-dark flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4">Our Mission</h3>
                <p className="text-navy/60 leading-relaxed">
                  To provide the safest, most reliable, and comfortable transport
                  experience in the UK. We aim to set new standards in the industry
                  through innovation, professionalism, and an unwavering commitment
                  to customer satisfaction.
                </p>
              </motion.div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <motion.div whileHover={{ y: -6 }} className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-navy" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4">Our Vision</h3>
                <p className="text-navy/60 leading-relaxed">
                  To become the UK&apos;s leading premium transport platform, connecting
                  passengers with professional drivers through cutting-edge technology.
                  We envision a future where every journey is seamless, safe, and
                  enjoyable.
                </p>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-crimson font-semibold text-sm uppercase tracking-widest">What Drives Us</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-navy">
              Our Core <span className="gradient-text">Values</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} className="text-center p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-all h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy to-navy-light flex items-center justify-center mx-auto mb-5">
                    <v.icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{v.title}</h3>
                  <p className="text-navy/55 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
