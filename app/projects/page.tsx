import type { Metadata } from "next";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Browse Quantic SHPK's portfolio of completed security and technology installations across Kosovo.",
};

const categories = ["All", "Surveillance", "Fiber Optic", "Network", "Alarm"];

const projects = [
  {
    title: "Warehouse Surveillance System",
    category: "Surveillance",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?w=800&q=80",
    desc: "64-camera IP system with AI analytics for a 10,000m² warehouse. Full NVR setup with 30-day retention.",
    client: "Logistics Company, Prishtinë",
  },
  {
    title: "Office IP Camera Installation",
    category: "Surveillance",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    desc: "16-camera Dahua system with NVR and mobile monitoring for a corporate office.",
    client: "Corporate Office, Ferizaj",
  },
  {
    title: "Fiber Optic Backbone Deployment",
    category: "Fiber Optic",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80",
    desc: "1km single-mode fiber backbone for an industrial campus with full OTDR certification.",
    client: "Industrial Campus, Mitrovicë",
  },
  {
    title: "Residential Security Setup",
    category: "Alarm",
    image: "https://images.unsplash.com/photo-1580745294621-9b9e9b93d4b4?w=800&q=80",
    desc: "Complete home alarm and CCTV system with 24/7 monitoring integration.",
    client: "Private Residence, Pejë",
  },
  {
    title: "Industrial Monitoring Network",
    category: "Network",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80",
    desc: "Structured Cat6A cabling and managed switch deployment for a 3-building factory.",
    client: "Manufacturing Facility, Gjilan",
  },
  {
    title: "Retail Chain CCTV Rollout",
    category: "Surveillance",
    image: "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?w=800&q=80",
    desc: "Standardized 8-camera IP system deployed across 12 retail locations.",
    client: "Retail Chain, Nationwide",
  },
];

export default function ProjectsPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <SectionLabel>Portfolio</SectionLabel>
          <h1
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Our Installations
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A selection of completed projects across Kosovo — from single-site deployments to multi-building enterprise rollouts.
          </p>
        </div>
      </section>

      {/* Filter tabs */}
      <div className="flex items-center justify-center gap-2 px-4 py-8 flex-wrap border-b border-gray-100">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-default ${
              cat === "All"
                ? "bg-blue-600 text-white"
                : "border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 bg-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <div
              key={p.title}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
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
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{p.desc}</p>
                <p className="text-gray-400 text-xs font-medium">{p.client}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
