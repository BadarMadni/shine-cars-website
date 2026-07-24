"use client";

import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By booking a ride or using any of our services, you agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please do not use our services.",
  },
  {
    title: "Booking & Cancellation",
    content:
      "Bookings can be made via our website, app, or phone. Cancellations made at least 2 hours before the scheduled pickup are free of charge. Late cancellations or no-shows may incur a cancellation fee of up to 50% of the fare.",
  },
  {
    title: "Fares & Payment",
    content:
      "All fares are quoted in GBP and include VAT where applicable. Payment is accepted via card, cash, or through the Shine Cars app. Prices may vary based on demand, time of day, and route conditions. Toll charges and parking fees are the passenger's responsibility.",
  },
  {
    title: "Passenger Responsibilities",
    content:
      "Passengers must behave respectfully towards drivers and other passengers. Seatbelts must be worn at all times. Any damage to the vehicle caused by a passenger will be charged accordingly. Smoking, consumption of alcohol, and illegal substances are strictly prohibited in all vehicles.",
  },
  {
    title: "Luggage & Personal Belongings",
    content:
      "Shine Cars accepts no liability for loss or damage to luggage or personal belongings left in vehicles. Passengers are advised to check the vehicle upon departure. Found items will be held for 30 days before disposal.",
  },
  {
    title: "Waiting Time",
    content:
      "A complimentary waiting time of 5 minutes is provided for standard pickups and 30 minutes for airport pickups. Additional waiting time will be charged at the applicable rate per minute.",
  },
  {
    title: "Liability",
    content:
      "Shine Cars shall not be liable for delays caused by traffic, road conditions, weather, or other circumstances beyond our control. Our total liability for any claim shall not exceed the fare paid for the relevant journey.",
  },
  {
    title: "Service Availability",
    content:
      "We strive to provide 24/7 service availability but cannot guarantee a vehicle will always be available. During peak times, adverse weather, or special events, wait times may be longer than usual.",
  },
  {
    title: "Modifications",
    content:
      "Shine Cars reserves the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms. Material changes will be communicated via email or our website.",
  },
  {
    title: "Governing Law",
    content:
      "These terms are governed by the laws of England and Wales. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.",
  },
];

export default function TermsContent() {
  return (
    <>
      <PageHero
        title="Terms &"
        highlight="Conditions"
        subtitle="Please read these terms carefully before using our services."
        breadcrumb="Terms & Conditions"
      />

      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-navy/50 text-sm mb-10 leading-relaxed">
              Last updated: July 2026. These terms and conditions govern your
              use of Shine Cars transport services. By using our services, you
              agree to comply with and be bound by the following terms.
            </p>
          </AnimatedSection>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-navy mb-2">
                    {i + 1}. {s.title}
                  </h2>
                  <p className="text-navy/55 text-sm leading-relaxed">
                    {s.content}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
