"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";

const projects = [
  {
    title: "Warehouse Surveillance System",
    category: "Surveillance",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&q=80",
    desc: "64-camera IP system with AI analytics for a 10,000m² warehouse.",
  },
  {
    title: "Office IP Camera Installation",
    category: "Surveillance",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    desc: "16-camera Tiandy system with NVR and mobile monitoring for a corporate office.",
  },
  {
    title: "Fiber Optic Backbone Deployment",
    category: "Fiber Optic",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    desc: "1km single-mode fiber backbone for an industrial campus with OTDR certification.",
  },
  {
    title: "Residential Security Setup",
    category: "Alarm",
    image: "https://images.unsplash.com/photo-1580745294621-9b9e9b93d4b4?w=800&q=80",
    desc: "Complete home alarm and CCTV system with 24/7 monitoring integration.",
  },
  {
    title: "Industrial Monitoring Network",
    category: "Network",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    desc: "Structured Cat6A cabling and managed switch deployment for a 3-building factory.",
  },
];

export default function Projects() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel>Our Work</SectionLabel>
          <h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Recent Installations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                  {p.category}
                </span>
              </div>

              <div className="p-5">
                <h3
                  className="text-gray-900 font-semibold mb-2"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  {p.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:text-blue-600 hover:border-blue-300 text-sm font-medium transition-all bg-white"
          >
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
