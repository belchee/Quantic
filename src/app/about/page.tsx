"use client";
import { motion } from 'framer-motion';
import SectionHeader from '@/components/common/SectionHeader';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import { Target, Eye, Shield, Award, Clock, Users } from 'lucide-react';

const values = [
  { icon: Shield, title: 'Integrity', desc: 'We deliver honest, transparent service with no hidden costs.' },
  { icon: Award, title: 'Excellence', desc: 'Industry-leading standards in every installation and service.' },
  { icon: Clock, title: 'Reliability', desc: '99.9% uptime commitment with 24/7 support availability.' },
  { icon: Users, title: 'Partnership', desc: 'Long-term relationships built on trust and results.' },
];

const stats = [
  { value: 500, suffix: '+', label: 'Installations' },
  { value: 10, suffix: '+', label: 'Years' },
  { value: 3, suffix: '', label: 'Brands' },
  { value: 24, suffix: '/7', label: 'Support' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(0,200,255,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c8ff]/30 bg-[#00c8ff]/10 text-[#00c8ff] text-sm font-medium mb-6">
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About <span className="bg-gradient-to-r from-[#00c8ff] to-[#0066ff] bg-clip-text text-transparent">Quantic</span>
            </h1>
            <p className="text-[#7a8499] text-lg leading-relaxed">
              Founded over a decade ago, Quantic Technology has grown to become one of the UAE&apos;s most trusted security technology companies. We specialize in comprehensive security solutions — from CCTV surveillance and IP cameras to fiber optic networks and full IT infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="bg-[#050508] border border-[#1a1a2a] rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00c8ff]/10 to-[#0066ff]/10 border border-[#00c8ff]/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#00c8ff]" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-[#7a8499] leading-relaxed">To deliver world-class security technology solutions that protect people, assets, and infrastructure — with uncompromising quality, reliability, and customer service.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }} className="bg-[#050508] border border-[#1a1a2a] rounded-2xl p-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00c8ff]/10 to-[#0066ff]/10 border border-[#00c8ff]/20 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-[#00c8ff]" />
              </div>
              <h3 className="text-white text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-[#7a8499] leading-relaxed">To be the leading security technology integrator in the GCC region, recognized for innovation, expertise, and lasting partnerships with our clients.</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="What Drives Us" title="Our Core" highlight="Values" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00c8ff]/10 to-[#0066ff]/10 border border-[#00c8ff]/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-[#00c8ff]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{value.title}</h3>
                <p className="text-[#7a8499] text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0d0d14] border-y border-[#1a1a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
                <div className="text-4xl font-bold text-white mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[#00c8ff] text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
