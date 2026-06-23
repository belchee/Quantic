import Link from "next/link";
import {
  Camera,
  Shield,
  Wifi,
  Wrench,
  AlertTriangle,
  Server,
  ChevronRight,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Camera,
    title: "Security Cameras",
    desc: "HD and 4K IP cameras with night vision, motion detection, and remote monitoring.",
    color: "#00d4ff",
  },
  {
    icon: Server,
    title: "DVR / NVR Systems",
    desc: "Complete video recording systems for residential and commercial properties.",
    color: "#7c3aed",
  },
  {
    icon: AlertTriangle,
    title: "Alarm Systems",
    desc: "Advanced intrusion detection with 24/7 monitoring and instant alerts.",
    color: "#f59e0b",
  },
  {
    icon: Wifi,
    title: "Fiber Optic",
    desc: "High-speed fiber optic installation and FTTH maintenance services.",
    color: "#10b981",
  },
  {
    icon: Shield,
    title: "Cable Installation",
    desc: "Professional structured cabling solutions for data, voice, and video.",
    color: "#ef4444",
  },
  {
    icon: Wrench,
    title: "Tech Maintenance",
    desc: "Preventive and corrective maintenance for all your technology infrastructure.",
    color: "#06b6d4",
  },
];

const brands = [
  { name: "Tiandy", desc: "AI-powered surveillance cameras" },
  { name: "Dahua", desc: "World-leading video-centric smart IoT solutions" },
  { name: "TvT", desc: "Professional CCTV and security systems" },
];

const stats = [
  { value: "500+", label: "Installations Completed" },
  { value: "10+", label: "Years of Experience" },
  { value: "3", label: "Premium Brands" },
  { value: "24/7", label: "Support Available" },
];

const features = [
  "Professional installation by certified technicians",
  "Remote monitoring from anywhere in the world",
  "HD & 4K resolution options",
  "Night vision and motion detection",
  "Cloud and local storage solutions",
  "Full system warranty and support",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e203015_1px,transparent_1px),linear-gradient(to_bottom,#1e203015_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00d4ff] rounded-full opacity-[0.04] blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00d4ff30] bg-[#00d4ff08] text-[#00d4ff] text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
            Professional Security Solutions
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Protect What
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#7c3aed]">
              Matters Most
            </span>
          </h1>

          <p className="text-xl text-[#8892a4] max-w-2xl mx-auto mb-10 leading-relaxed">
            Quantic delivers cutting-edge security cameras, alarm systems, fiber
            optic networks, and technology solutions for homes and businesses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-black bg-[#00d4ff] rounded-xl hover:bg-[#00b8d9] transition-all duration-200 shadow-[0_0_40px_#00d4ff30]"
            >
              Explore Products
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border border-[#1e2030] rounded-xl hover:border-[#00d4ff40] hover:bg-[#00d4ff08] transition-all duration-200"
            >
              Get a Free Quote
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-[#0f1117] border border-[#1e2030] rounded-2xl p-6 hover:border-[#00d4ff30] transition-colors"
              >
                <div className="text-3xl font-bold text-[#00d4ff] mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-[#8892a4]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">
              What We Offer
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Complete Security Solutions
            </h2>
            <p className="text-[#8892a4] max-w-xl mx-auto">
              From installation to maintenance, we cover every aspect of your
              security and technology needs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group bg-[#0f1117] border border-[#1e2030] rounded-2xl p-6 hover:border-[#00d4ff30] transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${service.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: service.color }} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {service.title}
                  </h3>
                  <p className="text-[#8892a4] text-sm leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[#00d4ff] font-medium hover:gap-3 transition-all duration-200"
            >
              View All Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-24 bg-[#0d0d15] border-y border-[#1e2030]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">
              Trusted Brands
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">
              We Partner With Industry Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="bg-[#0f1117] border border-[#1e2030] rounded-2xl p-8 text-center hover:border-[#00d4ff30] transition-all duration-300 group"
              >
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-[#8892a4] group-hover:from-[#00d4ff] group-hover:to-[#7c3aed] transition-all duration-300 mb-3">
                  {brand.name}
                </div>
                <p className="text-[#8892a4] text-sm">{brand.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">
                Why Quantic
              </p>
              <h2 className="text-4xl font-bold text-white mb-6">
                Security You Can <span className="text-[#00d4ff]">Trust</span>
              </h2>
              <p className="text-[#8892a4] leading-relaxed mb-8">
                With over a decade of experience in security and technology, we
                deliver solutions that keep you protected around the clock. Our
                certified technicians ensure every installation is flawless.
              </p>
              <ul className="space-y-4">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#00d4ff] mt-0.5 shrink-0" />
                    <span className="text-[#8892a4] text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm font-semibold text-black bg-[#00d4ff] rounded-xl hover:bg-[#00b8d9] transition-colors"
              >
                Learn More About Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-[#0f1117] border border-[#1e2030] rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                  <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                  <span className="text-[#8892a4] text-xs ml-2">Security Dashboard</span>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { label: "Camera 01 — Front Door", status: "LIVE", color: "#10b981" },
                    { label: "Camera 02 — Parking", status: "LIVE", color: "#10b981" },
                    { label: "Camera 03 — Warehouse", status: "LIVE", color: "#10b981" },
                    { label: "Alarm System", status: "ARMED", color: "#f59e0b" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between bg-[#0a0a0f] rounded-xl px-4 py-3 border border-[#1e2030]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-[#8892a4]">{item.label}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: item.color }}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#00d4ff0d] border border-[#00d4ff20] rounded-xl p-4 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-[#00d4ff]" />
                  <div>
                    <div className="text-white font-semibold text-sm">All Systems Secure</div>
                    <div className="text-[#8892a4] text-xs">Last updated just now</div>
                  </div>
                  <Star className="w-4 h-4 text-[#f59e0b] ml-auto" />
                </div>
              </div>
              <div className="absolute -inset-4 bg-[#00d4ff] rounded-3xl opacity-[0.03] blur-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0d0d15]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-[#00d4ff10] to-[#7c3aed10] border border-[#00d4ff20] rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Secure Your Property?
            </h2>
            <p className="text-[#8892a4] text-lg mb-8">
              Get a free consultation and quote from our security experts today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-black bg-[#00d4ff] rounded-xl hover:bg-[#00b8d9] transition-all shadow-[0_0_40px_#00d4ff30]"
              >
                Contact Us Today <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products"
                className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-white border border-[#1e2030] rounded-xl hover:border-[#00d4ff40] transition-all"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
