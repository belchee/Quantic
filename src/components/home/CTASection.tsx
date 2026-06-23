"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-24 bg-[#050508]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #00c8ff15 0%, #0066ff20 50%, #050508 100%)' }}
        >
          <div className="absolute inset-0 border border-[#00c8ff]/20 rounded-3xl" />
          <div className="relative px-8 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00c8ff] to-[#0066ff] flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Secure Your Property?
            </h2>
            <p className="text-[#7a8499] text-lg mb-8 max-w-xl mx-auto">
              Get a free site assessment from our security experts. No obligation, just expert advice tailored to your needs.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center px-8 py-3.5 rounded-xl text-white font-semibold bg-gradient-to-r from-[#00c8ff] to-[#0066ff] hover:opacity-90 transition-opacity shadow-lg shadow-[#00c8ff]/20">
                Get Free Assessment
              </Link>
              <Link href="/services" className="inline-flex items-center px-8 py-3.5 rounded-xl text-white font-semibold border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
                Our Services
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
