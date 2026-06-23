"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="py-24 lg:py-32 bg-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.05) 0%, transparent 60%)",
      }} />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Ready to Secure Your Business?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Get a free consultation and custom quote from our team. We&apos;ll design the right solution for your needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-white hover:bg-gray-50 text-blue-600 font-semibold text-base transition-all duration-200 shadow-sm"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:+38345460460"
              className="px-8 py-4 rounded-xl border border-white/30 text-white hover:bg-white/10 font-semibold text-base transition-all duration-200"
            >
              Call Us →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
