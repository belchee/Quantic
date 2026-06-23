import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Services from "@/components/home/Services";
import Brands from "@/components/home/Brands";
import WhyChoose from "@/components/home/WhyChoose";
import Projects from "@/components/home/Projects";
import Testimonials from "@/components/home/Testimonials";
import ContactCTA from "@/components/home/ContactCTA";

export const metadata: Metadata = {
  title: "Quantic SHPK — Security & Technology Solutions",
  description:
    "Professional CCTV surveillance, alarm systems, fiber optic networks, and IT infrastructure installation in Kosovo. Trusted by businesses across the region.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Brands />
      <WhyChoose />
      <Projects />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
