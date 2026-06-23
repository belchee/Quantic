"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Shield } from "lucide-react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Subtle blue radial gradient accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 60% 0%, rgba(37,99,235,0.06) 0%, transparent 60%)",
        }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24"
      >
        {/* Badge */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-sm font-medium">
            <Shield className="w-3.5 h-3.5" />
            Professional Security Solutions
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
        >
          Advanced Security &<br />
          <span className="text-blue-600">Network Solutions</span>
        </motion.h1>

        {/* Sub */}
        <motion.p variants={item} className="text-gray-500 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          CCTV Surveillance&nbsp;•&nbsp;Alarm Systems&nbsp;•&nbsp;Fiber Optic Networks&nbsp;•&nbsp;FTTH Maintenance
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="px-8 py-4 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            Get a Free Quote
          </Link>
          <Link
            href="/services"
            className="px-8 py-4 rounded-xl text-base font-semibold text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all bg-white"
          >
            View Solutions →
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div variants={item} className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {[
            "✓ Certified Technicians",
            "✓ 24/7 Emergency Support",
            "✓ Kosovo & Macedonia",
          ].map((t) => (
            <span key={t} className="text-gray-500 text-sm">{t}</span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}
