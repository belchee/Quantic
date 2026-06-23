"use client";
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/common/AnimatedCounter';

const stats = [
  { value: 500, suffix: '+', label: 'Installations', desc: 'Completed projects across UAE' },
  { value: 10, suffix: '+', label: 'Years Experience', desc: 'In security technology' },
  { value: 3, suffix: '', label: 'Top Brands', desc: 'Tiandy, Dahua & TVT' },
  { value: 24, suffix: '/7', label: 'Support', desc: 'Round the clock assistance' },
];

export default function StatsSection() {
  return (
    <section className="py-20 bg-[#050508] border-y border-[#1a1a2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl p-6 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00c8ff] to-[#0066ff]" />
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[#00c8ff] font-semibold text-sm mb-1">{stat.label}</div>
              <div className="text-[#7a8499] text-xs">{stat.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
