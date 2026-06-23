"use client";
import { motion } from 'framer-motion';
import SectionHeader from '@/components/common/SectionHeader';

const brands = [
  {
    name: 'Tiandy',
    tagline: 'AI-Powered Surveillance',
    desc: 'Industry-leading AI cameras with deep learning analytics, thermal imaging, and ultra-high resolution solutions for enterprise security.',
    color: 'from-[#00c8ff] to-[#0066ff]',
  },
  {
    name: 'Dahua',
    tagline: 'Global Security Leader',
    desc: 'World-class video-centric smart IoT solutions. Dahua offers end-to-end security products trusted by millions globally.',
    color: 'from-[#0066ff] to-[#6600ff]',
  },
  {
    name: 'TVT',
    tagline: 'Professional HD Systems',
    desc: 'Professional-grade HD surveillance systems with excellent value. TVT delivers reliable performance for residential and commercial applications.',
    color: 'from-[#00c8ff] to-[#00ff88]',
  },
];

export default function BrandsSection() {
  return (
    <section className="py-24 bg-[#0d0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Partners"
          title="Authorized"
          highlight="Dealer"
          subtitle="We are certified dealers for the world's leading security technology brands."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#050508] border border-[#1a1a2a] rounded-2xl p-8 group hover:border-[#00c8ff]/30 transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(0,200,255,0.06) 0%, transparent 60%)' }} />
              <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${brand.color} bg-clip-text text-transparent`}>
                {brand.name}
              </div>
              <div className="text-[#7a8499] text-sm font-medium mb-4">{brand.tagline}</div>
              <p className="text-[#7a8499] text-sm leading-relaxed">{brand.desc}</p>
              <div className="mt-6 pt-4 border-t border-[#1a1a2a]">
                <span className="text-xs text-[#00c8ff] font-medium">Authorized Dealer ✓</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
