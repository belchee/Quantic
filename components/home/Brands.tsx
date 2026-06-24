"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

interface Brand { name: string; tagline: string; active: boolean }

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    fetch("/api/brands").then((r) => r.json()).then(setBrands);
  }, []);

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionLabel>Trusted Brands</SectionLabel>
          <h2
            className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight"
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
                  ? "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer"
                  : "border-gray-100 bg-white opacity-40"
              }`}
            >
              <span className={`font-bold tracking-[0.1em] text-lg ${brand.active ? "text-gray-800" : "text-gray-400"}`}>
                {brand.name}
              </span>
              <span className="text-xs text-gray-500">{brand.tagline}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
