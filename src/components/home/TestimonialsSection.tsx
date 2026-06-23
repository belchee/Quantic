"use client";
import { motion } from 'framer-motion';
import SectionHeader from '@/components/common/SectionHeader';
import { testimonials } from '@/data/testimonials';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Client Reviews"
          title="What Our"
          highlight="Clients Say"
          subtitle="Trusted by hundreds of businesses and homeowners across the UAE."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#050508] border border-[#1a1a2a] rounded-2xl p-6"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#00c8ff] text-[#00c8ff]" />
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6">&quot;{t.content}&quot;</p>
              <div>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-[#7a8499] text-xs">{t.role} · {t.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
