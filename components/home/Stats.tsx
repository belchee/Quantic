"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useLang } from "@/lib/i18n";

export default function Stats() {
  const { tr } = useLang();

  const stats = [
    { value: 1000, suffix: "+", key: "stat_cameras" as const },
    { value: 500, suffix: "+", key: "stat_projects" as const },
    { value: 24, suffix: "/7", key: "stat_support" as const },
    { value: 99.9, suffix: "%", key: "stat_uptime" as const, decimals: 1 },
  ];

  return (
    <section className="py-20 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white px-8 py-10 text-center"
            >
              <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.03em" }}>
                <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-medium">{tr(s.key)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
