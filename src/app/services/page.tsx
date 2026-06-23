import type { Metadata } from "next";
import { Camera, Aperture, Server, ShieldAlert, Zap, Wifi, Network, Wrench, CheckCircle } from "lucide-react";
import SectionHeader from "@/components/common/SectionHeader";
import CTASection from "@/components/home/CTASection";
import { services } from "@/data/services";

export const metadata: Metadata = { title: "Services" };

const iconMap: Record<string, React.ElementType> = {
  Camera, Aperture, Server, ShieldAlert, Zap, Wifi, Network, Wrench,
};

const steps = [
  { step: "01", title: "Consultation", desc: "Free on-site assessment to understand your security needs and environment." },
  { step: "02", title: "Design", desc: "We design a tailored solution with equipment recommendations and full pricing." },
  { step: "03", title: "Installation", desc: "Certified technicians install and configure all equipment cleanly and professionally." },
  { step: "04", title: "Support", desc: "Ongoing support, maintenance, and upgrades to keep your system running perfectly." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-20 bg-[#050508] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0066ff] opacity-[0.04] rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#00c8ff] text-sm font-semibold uppercase tracking-widest mb-4">What We Do</p>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c8ff] to-[#0066ff]">
              Services
            </span>
          </h1>
          <p className="text-[#7a8499] text-lg max-w-2xl mx-auto">
            End-to-end security and technology services delivered by certified
            professionals with over a decade of hands-on experience.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#080810]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {services.map((svc) => {
              const Icon = iconMap[svc.icon];
              return (
                <div
                  key={svc.id}
                  className="relative bg-[#0d0d14] border border-white/6 rounded-2xl p-8 hover:border-white/12 transition-all overflow-hidden group"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
                    style={{ background: `linear-gradient(to right, transparent, ${svc.color}, transparent)` }}
                  />
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${svc.color}15` }}>
                      <Icon className="w-7 h-7" style={{ color: svc.color }} />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl mb-1">{svc.title}</h2>
                      <p className="text-[#7a8499] text-sm leading-relaxed">{svc.shortDesc}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {svc.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: svc.color }} />
                        <span className="text-[#7a8499] text-sm">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader badge="How We Work" title="Our" highlight="Process" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#00c8ff]/30 to-transparent z-10" />
                )}
                <div className="bg-[#0d0d14] border border-white/6 rounded-2xl p-6 hover:border-white/12 transition-all">
                  <div className="text-4xl font-black text-[#00c8ff]/20 mb-4">{s.step}</div>
                  <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
                  <p className="text-[#7a8499] text-sm leading-relaxed">{s.desc}</p>
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
