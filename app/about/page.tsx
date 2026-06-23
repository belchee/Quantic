import type { Metadata } from "next";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Link from "next/link";
import { Shield, Users, Zap, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Quantic SHPK — our story, mission, and commitment to delivering world-class security and technology solutions in Kosovo.",
};

const values = [
  {
    icon: Shield,
    title: "Reliability First",
    desc: "We build systems that work — 24/7, 365 days a year. No compromises on uptime or security.",
  },
  {
    icon: Users,
    title: "Client Partnership",
    desc: "We treat every client as a long-term partner, not just a project. Your success is our success.",
  },
  {
    icon: Zap,
    title: "Technical Excellence",
    desc: "Our certified engineers stay at the forefront of security technology and best practices.",
  },
  {
    icon: Award,
    title: "Proven Track Record",
    desc: "Over a decade of successful installations across Kosovo, Macedonia, and the wider region.",
  },
];

const stats = [
  { value: 1000, suffix: "+", label: "Cameras Installed" },
  { value: 500, suffix: "+", label: "Projects Completed" },
  { value: 50, suffix: "+", label: "Business Clients" },
  { value: 10, suffix: "+", label: "Years Experience" },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel>About Quantic</SectionLabel>
          <h1
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Built on Trust.<br />Powered by Technology.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
            Quantic SHPK is Kosovo&apos;s leading security technology company, delivering enterprise-grade surveillance, alarm, fiber optic, and network infrastructure solutions to businesses of every size.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel>Our Story</SectionLabel>
              <h2
                className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
              >
                A Decade of Securing Kosovo&apos;s Businesses
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in Prishtinë, Quantic SHPK started with a simple mission: bring enterprise-level security technology to businesses across Kosovo at a fair price with exceptional service.
                </p>
                <p>
                  Over the years, we&apos;ve grown from a small team of passionate engineers to the region&apos;s most trusted security technology partner, serving warehouses, corporate offices, retail chains, and government institutions.
                </p>
                <p>
                  We partner exclusively with industry leaders — Tiandy, Dahua, and TVT — to ensure every system we install meets the highest standards of reliability and performance.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <GlassCard key={s.label} className="text-center">
                  <div
                    className="text-4xl font-bold text-blue-600 mb-1"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <p className="text-gray-500 text-sm">{s.label}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionLabel>Our Values</SectionLabel>
            <h2
              className="text-3xl lg:text-4xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
            >
              What Drives Us
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <GlassCard key={v.title} className="h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3
                    className="text-gray-900 font-semibold mb-2"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Ready to Work Together?
          </h2>
          <p className="text-blue-100 mb-8">
            Let&apos;s discuss your security needs and build the right solution for your business.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white hover:bg-gray-50 text-blue-600 font-semibold transition-all duration-200"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
