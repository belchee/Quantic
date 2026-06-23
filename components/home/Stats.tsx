"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

const stats = [
  { value: 1000, suffix: "+", label: "Installed Cameras" },
  { value: 500, suffix: "+", label: "Projects Completed" },
  { value: 24, suffix: "/7", label: "Technical Support" },
  { value: 99.9, suffix: "%", label: "System Reliability", decimals: 1 },
];

export default function Stats() {
  return (
    <section className="bg-zinc-900/50 border-y border-white/6 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="text-5xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <p className="text-zinc-400 text-sm uppercase tracking-widest font-mono">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
