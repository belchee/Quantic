"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassCard from "@/components/ui/GlassCard";
import { services } from "@/lib/services";

export default function Services() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel>Our Services</SectionLabel>
          <h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Complete Security &<br />Technology Solutions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <GlassCard className="h-full flex flex-col">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${svc.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: svc.color }} />
                  </div>
                  <h3
                    className="text-gray-900 font-semibold text-lg mb-2"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {svc.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{svc.shortDesc}</p>
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {svc.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-gray-600 text-xs">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${svc.slug}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors mt-auto"
                  >
                    Learn More →
                  </Link>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
