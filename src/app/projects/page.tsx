"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '@/data/projects';

const categories = ['All', 'Residential', 'Commercial', 'Industrial'];

const categoryColors: Record<string, string> = {
  Commercial: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Residential: 'bg-green-500/20 text-green-400 border-green-500/30',
  Industrial: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

export default function ProjectsPage() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active);

  return (
    <div className="min-h-screen bg-[#050508]">
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(0,200,255,0.07) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00c8ff]/30 bg-[#00c8ff]/10 text-[#00c8ff] text-sm font-medium mb-6">
              Portfolio
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="bg-gradient-to-r from-[#00c8ff] to-[#0066ff] bg-clip-text text-transparent">Projects</span>
            </h1>
            <p className="text-[#7a8499] text-lg max-w-2xl mx-auto">
              A selection of our completed projects across residential, commercial, and industrial sectors.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${active === cat ? 'bg-gradient-to-r from-[#00c8ff] to-[#0066ff] text-white' : 'border border-[#1a1a2a] text-[#7a8499] hover:text-white hover:border-white/20'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[#0d0d14] border border-[#1a1a2a] rounded-2xl overflow-hidden group hover:border-[#00c8ff]/30 transition-all"
              >
                <div className="aspect-video flex items-center justify-center" style={{ background: `radial-gradient(circle at 40% 50%, rgba(0,${80 + i * 20},255,0.1) 0%, #050508 70%)` }}>
                  <div className="text-[#1a1a2a] text-7xl font-bold">{String(project.id).padStart(2, '0')}</div>
                </div>
                <div className="p-6">
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${categoryColors[project.category]}`}>
                    {project.category}
                  </span>
                  <h3 className="text-white font-semibold mt-3 mb-2">{project.title}</h3>
                  <p className="text-[#7a8499] text-sm">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs text-[#7a8499] bg-[#1a1a2a] px-2 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
