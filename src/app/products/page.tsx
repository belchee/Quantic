import { Camera, Server, Filter } from "lucide-react";

const categories = [
  { label: "All Products", icon: Filter },
  { label: "Cameras", icon: Camera },
  { label: "DVR / NVR", icon: Server },
];

const comingSoon = [
  { brand: "Tiandy", category: "Cameras", color: "#00d4ff" },
  { brand: "Dahua", category: "Cameras", color: "#7c3aed" },
  { brand: "TvT", category: "DVR / NVR", color: "#10b981" },
];

export default function ProductsPage() {
  return (
    <div className="pt-24 min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">
            Our Catalog
          </p>
          <h1 className="text-5xl font-extrabold text-white mb-4">Products</h1>
          <p className="text-[#8892a4] max-w-xl mx-auto">
            Explore our full range of security cameras, recording systems, alarm
            equipment and more. Products are being added — check back soon.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#1e2030] text-[#8892a4] text-sm hover:border-[#00d4ff40] hover:text-white transition-all"
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Coming soon placeholder cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoon.map((item, i) => (
            <div
              key={i}
              className="bg-[#0f1117] border border-[#1e2030] rounded-2xl overflow-hidden group hover:border-[#00d4ff30] transition-all duration-300"
            >
              <div
                className="h-48 flex items-center justify-center"
                style={{ background: `${item.color}08` }}
              >
                <Camera className="w-16 h-16 opacity-20" style={{ color: item.color }} />
              </div>
              <div className="p-6">
                <div
                  className="text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: item.color }}
                >
                  {item.brand}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {item.category} — Coming Soon
                </h3>
                <p className="text-[#8892a4] text-sm">
                  Products from {item.brand} are being added. Contact us for
                  availability and pricing.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center bg-[#0f1117] border border-[#1e2030] rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Looking for a Specific Product?
          </h2>
          <p className="text-[#8892a4] mb-8">
            Our catalog is growing. Contact us and we will find the right
            security solution for your needs.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-black bg-[#00d4ff] rounded-xl hover:bg-[#00b8d9] transition-all"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </div>
  );
}
