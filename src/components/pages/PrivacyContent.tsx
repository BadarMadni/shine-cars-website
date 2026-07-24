"use client";

import PageHero from "@/components/shared/PageHero";
import AnimatedSection from "@/components/ui/AnimatedSection";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect personal information you provide when booking a ride, creating an account, or contacting us. This includes your name, email address, phone number, pickup and drop-off locations, and payment details. We may also collect device and usage data automatically through cookies and similar technologies.",
  },
  {
    title: "How We Use Your Information",
    content:
      "Your information is used to process bookings, provide customer support, improve our services, send service updates, and comply with legal obligations. We may also use anonymised data for analytics and to enhance the overall user experience.",
  },
  {
    title: "Data Sharing & Third Parties",
    content:
      "We do not sell your personal data. We may share information with trusted third parties such as payment processors, drivers assigned to your booking, and service providers who assist our operations. All third parties are contractually obligated to protect your data.",
  },
  {
    title: "Data Security",
    content:
      "We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information. While no system is completely secure, we are committed to safeguarding your data to the best of our ability.",
  },
  {
    title: "Your Rights",
    content:
      "Under UK data protection law (GDPR), you have the right to access, correct, delete, or restrict processing of your personal data. You may also withdraw consent at any time. To exercise these rights, please contact us using the details below.",
  },
  {
    title: "Cookies",
    content:
      "Our website uses cookies to enhance your browsing experience, analyse traffic, and personalise content. You can manage cookie preferences through your browser settings. Essential cookies are required for the website to function properly.",
  },
  {
    title: "Data Retention",
    content:
      "We retain your personal data only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Booking records are typically retained for 6 years for legal and accounting purposes.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.",
  },
  {
    title: "Contact Us",
    content:
      "If you have any questions about this privacy policy or how we handle your data, please contact us at info@shinecars.co.uk or call us on +44 123 456 7890.",
  },
];

export default function PrivacyContent() {
  return (
    <>
      <PageHero
        title="Privacy"
        highlight="Policy"
        subtitle="Your privacy matters to us. Learn how we collect, use, and protect your information."
        breadcrumb="Privacy Policy"
      />

      <section className="py-14 sm:py-24 bg-white">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <AnimatedSection>
            <p className="text-navy/50 text-sm mb-10 leading-relaxed">
              Last updated: July 2026. This privacy policy explains how Shine
              Cars (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) collects,
              uses, and protects your personal information when you use our
              website and services.
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
