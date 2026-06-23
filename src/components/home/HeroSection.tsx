"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Shield, Clock, Headphones } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#050508]">
        <motion.div
          className="absolute rounded-full"
          style={{ background: 'radial-gradient(circle, #00c8ff 0%, transparent 70%)', top: '-100px', left: '-100px', width: '600px', height: '600px', opacity: 0.15 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ background: 'radial-gradient(circle, #0066ff 0%, transparent 70%)', bottom: '-100px', right: '-100px', width: '500px', height: '500px', opacity: 0.15 }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.22, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c8ff]/30 bg-[#00c8ff]/10 text-[#00c8ff] text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Trusted Security Partner
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Protect What<br />
            <span className="bg-gradient-to-r from-[#00c8ff] to-[#0066ff] bg-clip-text text-transparent">
              Matters Most
            </span>
          </h1>
          <p className="text-[#7a8499] text-lg leading-relaxed mb-8 max-w-lg">
            Professional CCTV, IP cameras, fiber optic installation, and network infrastructure solutions. Serving businesses and residences across the UAE with cutting-edge security technology.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <Link href="/services" className="inline-flex items-center px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#00c8ff] to-[#0066ff] hover:opacity-90 transition-opacity shadow-lg shadow-[#00c8ff]/20">
              Explore Solutions
            </Link>
            <Link href="/projects" className="inline-flex items-center px-6 py-3 rounded-xl text-white font-semibold border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all">
              View Projects
            </Link>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { icon: Shield, text: '500+ Installs' },
              { icon: Clock, text: '10+ Years' },
              { icon: Headphones, text: '24/7 Support' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-white/70">
                <Icon className="w-4 h-4 text-[#00c8ff]" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block"
        >
          <div className="bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-semibold text-sm">Security Dashboard</span>
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {['Front Gate', 'Parking', 'Lobby', 'Roof'].map((cam, i) => (
                <div key={cam} className="bg-[#050508] rounded-xl aspect-video flex items-center justify-center relative overflow-hidden border border-[#1a1a2a]">
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${30 + i * 15}% ${40 + i * 10}%, rgba(0,200,255,0.08) 0%, transparent 60%)` }} />
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full bg-[#00c8ff]/10 border border-[#00c8ff]/20 flex items-center justify-center mx-auto mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#00c8ff]" />
                    </div>
                    <span className="text-xs text-white/40">{cam}</span>
                  </div>
                  <motion.div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-[#7a8499] bg-[#050508] rounded-lg p-3 border border-[#1a1a2a]">
              <span>All systems operational</span>
              <span className="text-green-400">4/4 cameras online</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
