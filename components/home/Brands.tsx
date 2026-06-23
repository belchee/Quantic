"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { brands } from "@/lib/brands";

export default function Brands() {
  return (
    <section className="py-20 bg-[#18181B] border-y border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionLabel>Trusted Brands</SectionLabel>
          <h2
            className="text-3xl lg:text-4xl font-bold text-white tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            We Work With Industry Leaders
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className={`flex flex-col items-center gap-1 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                brand.active
                  ? "border-white/10 bg-white/5 hover:border-cyan-400/30 hover:bg-white/8 cursor-pointer"
                  : "border-white/4 bg-white/2 opacity-40"
              }`}
              style={{ opacity: brand.active ? undefined : 0.4 }}
            >
              <span
                className={`font-mono font-bold tracking-[0.15em] text-lg ${
                  brand.active ? "text-white" : "text-zinc-600"
                }`}
              >
                {brand.name}
              </span>
              <span className="text-xs text-zinc-500 font-mono">{brand.tagline}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
