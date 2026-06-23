"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

const brands = [
  {
    name: 'Tiandy',
    gradient: 'from-[#00c8ff] to-[#0066ff]',
    desc: 'AI-powered surveillance cameras, NVR systems, and smart analytics solutions. Industry-leading performance with deep learning technology.',
    products: ['AI Cameras', 'Thermal Cameras', 'NVR Systems', 'PTZ Cameras', 'Fisheye Cameras', 'Video Wall Controllers'],
  },
  {
    name: 'Dahua',
    gradient: 'from-[#0066ff] to-[#6600ff]',
    desc: 'World-class video-centric smart IoT solutions. Comprehensive product range from entry-level to enterprise-grade systems.',
    products: ['IP Cameras', 'DVR/NVR Systems', 'Access Control', 'Video Intercoms', 'Perimeter Protection', 'Smart Home Devices'],
  },
  {
    name: 'TVT',
    gradient: 'from-[#00c8ff] to-[#00ff88]',
    desc: 'Professional HD surveillance systems delivering excellent value. Reliable performance for residential and commercial applications.',
    products: ['HD Cameras', 'DVR Systems', 'IP Cameras', 'NVR Recorders', 'Dome Cameras', 'Bullet Cameras'],
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#050508]">
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,200,255,0.06) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c8ff]/30 bg-[#00c8ff]/10 text-[#00c8ff] text-sm font-medium mb-6">
              Product Catalog
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our <span className="bg-gradient-to-r from-[#00c8ff] to-[#0066ff] bg-clip-text text-transparent">Products</span>
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium mt-4">
              Full catalog being updated — contact us for the latest pricing
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl p-8"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <div className={`text-5xl font-bold bg-gradient-to-r ${brand.gradient} bg-clip-text text-transparent`}>
                  {brand.name}
                </div>
                <div className="flex-1">
                  <p className="text-[#7a8499]">{brand.desc}</p>
                </div>
                <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-[#00c8ff] to-[#0066ff] hover:opacity-90 transition-opacity whitespace-nowrap">
                  <MessageCircle className="w-4 h-4" />
                  Contact for Pricing
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {brand.products.map((product) => (
                  <div key={product} className="bg-[#050508] border border-[#1a1a2a] rounded-xl px-3 py-3 text-center text-sm text-[#7a8499]">
                    {product}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
