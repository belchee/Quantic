"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionHeader from '@/components/common/SectionHeader';
import { projects } from '@/data/projects';

const categoryColors: Record<string, string> = {
  Commercial: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Residential: 'bg-green-500/20 text-green-400 border-green-500/30',
  Industrial: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export default function ProjectsSection() {
  return (
    <section className="py-24 bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Work"
          title="Recent"
          highlight="Projects"
          subtitle="Delivering security excellence across commercial, residential, and industrial sectors."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl overflow-hidden group hover:border-[#00c8ff]/30 transition-all"
            >
              <div className="aspect-video flex items-center justify-center relative" style={{ background: `radial-gradient(circle at 30% 50%, rgba(0,${100 + i * 30},255,0.1) 0%, #050508 70%)` }}>
                <div className="text-[#1a1a2a] text-6xl font-bold">{String(i + 1).padStart(2, '0')}</div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${categoryColors[project.category]}`}>
                    {project.category}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2">{project.title}</h3>
                <p className="text-[#7a8499] text-sm leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs text-[#7a8499] bg-[#1a1a2a] px-2 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/projects" className="inline-flex items-center px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#00c8ff] to-[#0066ff] hover:opacity-90 transition-opacity text-sm">
            View All Projects →
          </Link>
        </div>
      </div>
    </section>
  );
}
