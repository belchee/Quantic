"use client";
import { motion } from 'framer-motion';
import { Camera, Video, HardDrive, Bell, Zap, Network, Server, Wrench } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import Link from 'next/link';

const services = [
  { icon: Camera, title: 'CCTV Surveillance', desc: 'Comprehensive camera systems for total property visibility.' },
  { icon: Video, title: 'IP Cameras', desc: 'Smart IP cameras with AI analytics and remote access.' },
  { icon: HardDrive, title: 'DVR/NVR Systems', desc: 'Professional multi-channel video recording solutions.' },
  { icon: Bell, title: 'Alarm Systems', desc: 'Intelligent intrusion detection and alert systems.' },
  { icon: Zap, title: 'Fiber Optic', desc: 'High-speed fiber optic network installation.' },
  { icon: Network, title: 'FTTH Maintenance', desc: 'Fiber to the Home installation and ongoing support.' },
  { icon: Server, title: 'Network Infrastructure', desc: 'Enterprise network design and structured cabling.' },
  { icon: Wrench, title: 'Tech Maintenance', desc: 'Preventive maintenance and emergency support services.' },
];

export default function ServicesSection() {
  return (
    <section className="py-24 bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="What We Offer"
          title="Complete Security"
          highlight="Solutions"
          subtitle="From installation to maintenance, we cover every aspect of your security infrastructure needs."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl p-6 group hover:border-[#00c8ff]/30 hover:shadow-lg hover:shadow-[#00c8ff]/5 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00c8ff]/10 to-[#0066ff]/10 border border-[#00c8ff]/20 flex items-center justify-center mb-4 group-hover:border-[#00c8ff]/40 transition-colors">
                <service.icon className="w-6 h-6 text-[#00c8ff]" />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2">{service.title}</h3>
              <p className="text-[#7a8499] text-xs leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/services" className="inline-flex items-center px-6 py-3 rounded-xl text-white font-semibold border border-white/20 hover:border-[#00c8ff]/50 hover:bg-[#00c8ff]/5 transition-all text-sm">
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
}
