import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import AvailableTaxis from "@/components/home/AvailableTaxis";
import FleetSection from "@/components/home/FleetSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AppDownload from "@/components/home/AppDownload";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <AvailableTaxis />
      <FleetSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <AppDownload />
    </>
  );
}
