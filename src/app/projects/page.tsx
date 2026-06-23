import type { Metadata } from "next";
import CTASection from "@/components/home/CTASection";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Projects" };

const categories = ["All", "Residential", "Commercial", "Industrial"];

export default function ProjectsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-[#050508] overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#10b981] opacity-[0.04] rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00c8ff] text-sm font-semibold uppercase tracking-widest mb-4">Portfolio</p>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c8ff] to-[#0066ff]">
              Projects
            </span>
          </h1>
          <p className="text-[#7a8499] text-lg max-w-2xl mx-auto">
            A selection of installations and deployments we&apos;ve completed for
            clients across residential, commercial, and industrial sectors.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="bg-[#080810] border-b border-white/5 sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-3">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  i === 0
                    ? "bg-[#00c8ff]/10 text-[#00c8ff] border border-[#00c8ff]/20"
                    : "text-[#7a8499] hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-20 bg-[#080810]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group bg-[#0d0d14] border border-white/6 rounded-2xl overflow-hidden hover:border-white/12 transition-all duration-300"
              >
                {/* Visual */}
                <div
                  className="relative h-52 flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${project.color}15, #0d0d14)` }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50%, ${project.color}12, transparent 70%)` }}
                  />
                  <div className="text-7xl font-black select-none opacity-[0.07]" style={{ color: project.color }}>
                    {String(project.id).padStart(2, "0")}
                  </div>
                  <span
                    className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: `${project.color}20`,
                      color: project.color,
                      border: `1px solid ${project.color}30`,
                    }}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[#00c8ff] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[#7a8499] text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs text-[#7a8499] bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
