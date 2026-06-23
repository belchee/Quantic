"use client";

import { motion } from "framer-motion";
import { Award, Zap, Building2, RefreshCw } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassCard from "@/components/ui/GlassCard";

const features = [
  {
    icon: Award,
    title: "Certified Technicians",
    desc: "Professional installation and maintenance by trained, certified engineers with years of hands-on experience.",
  },
  {
    icon: Zap,
    title: "Fast Response",
    desc: "Rapid on-site support and emergency intervention available 24/7. We respond when it matters most.",
  },
  {
    icon: Building2,
    title: "Enterprise Solutions",
    desc: "Scalable surveillance and network infrastructure designed for any business size — from small offices to industrial campuses.",
  },
  {
    icon: RefreshCw,
    title: "Long-Term Support",
    desc: "Ongoing maintenance contracts and proactive monitoring to keep your systems running at 100%.",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-24 lg:py-32 bg-[#09090B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel>Why Quantic</SectionLabel>
          <h2
            className="text-4xl lg:text-5xl font-bold text-white tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Built for Reliability.<br />Trusted by Businesses.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className="w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3
                    className="text-white font-semibold text-base mb-2"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
