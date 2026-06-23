import type { Metadata } from "next";
import CTASection from "@/components/home/CTASection";
import { Package } from "lucide-react";

export const metadata: Metadata = { title: "Products" };

const brands = [
  {
    name: "Tiandy",
    tagline: "AI-Powered Surveillance",
    color: "#00c8ff",
    categories: [
      { name: "Bullet Cameras", count: "Coming Soon", desc: "Fixed IP cameras for wide-area outdoor monitoring." },
      { name: "Dome Cameras", count: "Coming Soon", desc: "Vandal-resistant dome cameras for indoor and outdoor use." },
      { name: "PTZ Cameras", count: "Coming Soon", desc: "Pan-tilt-zoom cameras for large perimeter coverage." },
      { name: "NVR Recorders", count: "Coming Soon", desc: "High-capacity network video recorders." },
    ],
  },
  {
    name: "Dahua",
    tagline: "Smart IoT Solutions",
    color: "#0066ff",
    categories: [
      { name: "WizSense Cameras", count: "Coming Soon", desc: "AI-powered cameras with human & vehicle detection." },
      { name: "Alarm Systems", count: "Coming Soon", desc: "Smart alarm panels with app control." },
      { name: "Access Control", count: "Coming Soon", desc: "Biometric and card-based access solutions." },
      { name: "Video Intercoms", count: "Coming Soon", desc: "IP video door stations and indoor monitors." },
    ],
  },
  {
    name: "TVT",
    tagline: "Professional CCTV",
    color: "#7c3aed",
    categories: [
      { name: "IP Cameras", count: "Coming Soon", desc: "Full HD and 4K network cameras." },
      { name: "HD-TVI Cameras", count: "Coming Soon", desc: "Analog HD cameras for budget installations." },
      { name: "DVR Systems", count: "Coming Soon", desc: "Digital video recorders for analog cameras." },
      { name: "NVR Systems", count: "Coming Soon", desc: "Network recorders for IP camera systems." },
    ],
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-[#050508] overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-[#7c3aed] opacity-[0.04] rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00c8ff] text-sm font-semibold uppercase tracking-widest mb-4">Product Catalog</p>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c8ff] to-[#0066ff]">
              Products
            </span>
          </h1>
          <p className="text-[#7a8499] text-lg max-w-2xl mx-auto mb-6">
            We carry full product lines from Tiandy, Dahua, and TVT. Our
            catalog is being built — contact us for current stock, pricing, and
            availability.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/5 text-[#f59e0b] text-sm font-medium">
            <Package className="w-4 h-4" />
            Full catalog coming soon — contact us for product enquiries
          </div>
        </div>
      </section>

      {/* Brand sections */}
      <section className="py-20 bg-[#080810]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {brands.map((brand) => (
            <div key={brand.name}>
              {/* Brand header */}
              <div className="flex items-end gap-4 mb-8">
                <h2 className="text-4xl font-black" style={{ color: brand.color }}>{brand.name}</h2>
                <span className="text-[#7a8499] text-sm font-medium mb-1 uppercase tracking-wider">
                  — {brand.tagline}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {brand.categories.map((cat) => (
                  <div
                    key={cat.name}
                    className="group bg-[#0d0d14] border border-white/6 rounded-2xl p-6 hover:border-white/12 transition-all overflow-hidden relative"
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5"
                      style={{ background: `linear-gradient(to right, transparent, ${brand.color}60, transparent)` }}
                    />
                    {/* Image placeholder */}
                    <div
                      className="h-28 rounded-xl mb-4 flex items-center justify-center"
                      style={{ background: `${brand.color}08`, border: `1px solid ${brand.color}15` }}
                    >
                      <Package className="w-10 h-10 opacity-30" style={{ color: brand.color }} />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{cat.name}</h3>
                    <p className="text-[#7a8499] text-xs leading-relaxed mb-3">{cat.desc}</p>
                    <a
                      href="/contact"
                      className="text-xs font-semibold transition-colors"
                      style={{ color: brand.color }}
                    >
                      Contact for pricing →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
