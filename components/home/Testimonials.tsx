"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassCard from "@/components/ui/GlassCard";

const testimonials = [
  {
    text: "Quantic installed our entire warehouse camera system. Professional, fast, and incredibly reliable. The remote monitoring works perfectly.",
    name: "Arben K.",
    role: "Warehouse Manager",
    initials: "AK",
  },
  {
    text: "The fiber optic installation was completed on time and perfectly executed. Highly recommended for any business needing network infrastructure.",
    name: "Miroslav T.",
    role: "IT Director",
    initials: "MT",
  },
  {
    text: "24/7 support is real. They responded within the hour when we had an issue. That kind of reliability is priceless for our business.",
    name: "Blerina H.",
    role: "Business Owner",
    initials: "BH",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel>Client Reviews</SectionLabel>
          <h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Trusted by Our Clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <GlassCard className="h-full flex flex-col">
                <Quote className="w-7 h-7 text-blue-200 mb-4" />
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-6 flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
