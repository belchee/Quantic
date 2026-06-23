import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, Phone } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassCard from "@/components/ui/GlassCard";
import { services } from "@/lib/services";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDesc,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const Icon = service.icon;
  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div className="bg-[#09090B] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[400px] rounded-full blur-[140px] opacity-10"
            style={{ background: service.color }}
          />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Services
          </Link>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: `${service.color}15`, border: `1px solid ${service.color}30` }}
          >
            <Icon className="w-7 h-7" style={{ color: service.color }} />
          </div>
          <SectionLabel>Service</SectionLabel>
          <h1
            className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}
          >
            {service.title}
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl leading-relaxed">{service.description}</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-[#18181B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl font-bold text-white mb-8"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            What&apos;s Included
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.features.map((f) => (
              <div key={f} className="flex items-start gap-3 p-4 rounded-xl bg-white/3 border border-white/6">
                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <span className="text-zinc-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#09090B]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2
            className="text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Interested in {service.title}?
          </h2>
          <p className="text-zinc-400 mb-8">
            Contact us for a free consultation and custom quote tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-200"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:+38345460460"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 font-semibold transition-all duration-200"
            >
              <Phone className="w-4 h-4" />
              +383 45 460 460
            </a>
          </div>
        </div>
      </section>

      {/* Other Services */}
      {otherServices.length > 0 && (
        <section className="py-16 bg-[#18181B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-2xl font-bold text-white mb-8"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Other Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {otherServices.map((s) => {
                const OtherIcon = s.icon;
                return (
                  <Link key={s.slug} href={`/services/${s.slug}`}>
                    <GlassCard className="h-full">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                        style={{ background: `${s.color}15` }}
                      >
                        <OtherIcon className="w-5 h-5" style={{ color: s.color }} />
                      </div>
                      <h3
                        className="text-white font-semibold mb-2"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        {s.title}
                      </h3>
                      <p className="text-zinc-500 text-sm">{s.shortDesc}</p>
                    </GlassCard>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
