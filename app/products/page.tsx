import type { Metadata } from "next";
import SectionLabel from "@/components/ui/SectionLabel";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse Quantic SHPK's product catalog — IP cameras, NVRs, alarm panels, fiber optic equipment, and more from Tiandy, Dahua, and TVT.",
};

const categories = [
  "IP Cameras",
  "NVR / DVR",
  "Alarm Panels",
  "Fiber Optic",
  "Network Switches",
  "Access Control",
];

export default function ProductsPage() {
  return (
    <div className="bg-[#09090B] min-h-screen">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[140px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <SectionLabel>Product Catalog</SectionLabel>
          <h1
            className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            Our Products
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
            We supply professional-grade security and network equipment from the world&apos;s leading manufacturers.
          </p>

          {/* Category filter tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 rounded-lg border border-white/10 text-zinc-400 text-sm font-medium hover:border-blue-500/40 hover:text-white transition-all duration-200 cursor-default"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Coming soon state */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-16">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Product Catalog Coming Soon
            </h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto mb-8">
              We&apos;re building a full product catalog with specs, pricing, and availability. In the meantime, contact us directly for any product inquiries.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200"
            >
              Request a Product Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
