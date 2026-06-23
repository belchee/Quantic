import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassCard from "@/components/ui/GlassCard";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Quantic SHPK's full range of security and technology services — CCTV, alarms, fiber optic, FTTH, network infrastructure, and technical maintenance.",
};

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel>What We Do</SectionLabel>
          <h1
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Complete Security &<br />Technology Solutions
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From IP cameras to fiber optic backbones — we design, install, and maintain every layer of your security and network infrastructure.
          </p>
        </div>
      </section>

      <section className="pb-24 px-4 sm:px-6 lg:px-8 pt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <GlassCard key={svc.slug} className="flex flex-col h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${svc.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: svc.color }} />
                  </div>
                  <h2
                    className="text-gray-900 font-bold text-xl mb-3"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {svc.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{svc.shortDesc}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-gray-600 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${svc.slug}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors mt-auto"
                  >
                    Learn More →
                  </Link>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
