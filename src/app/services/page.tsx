"use client";
import { motion } from 'framer-motion';
import { Camera, Video, HardDrive, Bell, Zap, Network, Server, Wrench, CheckCircle2 } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import { services } from '@/data/services';
import React from 'react';

const iconMap: Record<string, React.ElementType> = {
  Camera, Video, HardDrive, Bell, Zap, Network, Server, Wrench,
};

const steps = [
  { num: '01', title: 'Site Assessment', desc: 'Free on-site survey to understand your security needs and environment.' },
  { num: '02', title: 'Custom Design', desc: 'Tailored system design with the right equipment for your requirements.' },
  { num: '03', title: 'Professional Install', desc: 'Certified technicians install your system to the highest standards.' },
  { num: '04', title: 'Training & Support', desc: 'Full training and ongoing 24/7 support for complete peace of mind.' },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 70% 50%, rgba(0,102,255,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c8ff]/30 bg-[#00c8ff]/10 text-[#00c8ff] text-sm font-medium mb-6">
              What We Do
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-[#00c8ff] to-[#0066ff] bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-[#7a8499] text-lg max-w-2xl mx-auto">
              Comprehensive security and technology solutions designed to protect your property and optimize your network infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl p-8 hover:border-[#00c8ff]/30 transition-all group"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00c8ff]/10 to-[#0066ff]/10 border border-[#00c8ff]/20 flex items-center justify-center flex-shrink-0">
                      {Icon && <Icon className="w-7 h-7 text-[#00c8ff]" />}
                    </div>
                    <div>
                      <h3 className="text-white text-xl font-bold mb-1">{service.title}</h3>
                      <p className="text-[#7a8499] text-sm">{service.description}</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-[#7a8499]">
                        <CheckCircle2 className="w-4 h-4 text-[#00c8ff] flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0d0d14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="How We Work" title="Our" highlight="Process" subtitle="A simple, transparent process from first contact to ongoing support." />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00c8ff] to-[#0066ff] flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {step.num}
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-[#7a8499] text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
