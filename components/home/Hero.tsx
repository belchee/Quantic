"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Lock } from "lucide-react";

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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, #1e3a5f 0%, #09090B 70%)",
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Blue spotlight glow behind heading */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(ellipse, rgba(37,99,235,0.20) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-zinc-300 text-sm font-medium">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            Professional Security Solutions
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
        >
          Advanced Security &<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
            Network Solutions
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p variants={item} className="text-zinc-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          CCTV Surveillance&nbsp;•&nbsp;Alarm Systems&nbsp;•&nbsp;Fiber Optic Networks&nbsp;•&nbsp;FTTH Maintenance
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="px-8 py-4 rounded-full text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_40px_rgba(37,99,235,0.35)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)]"
          >
            Get a Free Quote
          </Link>
          <Link
            href="/services"
            className="px-8 py-4 rounded-full text-base font-semibold text-white border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all"
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
            <span key={t} className="text-zinc-500 text-sm">{t}</span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
}
