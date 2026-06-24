"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";

interface Brand { name: string; tagline: string; active: boolean }

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const { tr } = useLang();

  useEffect(() => {
    fetch("/api/brands").then((r) => r.json()).then(setBrands);
  }, []);

  const active = brands.filter((b) => b.active);
  if (!active.length) return null;

  return (
    <section className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{tr("brands_label")}</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-3 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}>
            {tr("brands_h2")}
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6">
          {active.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex flex-col items-center gap-1.5 px-8 py-5 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span className="font-bold tracking-tight text-xl text-gray-900">{brand.name}</span>
              <span className="text-xs text-gray-400">{brand.tagline}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
