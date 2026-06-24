"use client";

import Link from "next/link";
import { Shield, Users, Zap, Award } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useLang } from "@/lib/i18n";

export default function AboutPage() {
  const { lang, tr } = useLang();

  const values = [
    {
      icon: Shield,
      title: { sq: "Besueshmëria e parë", en: "Reliability First" },
      desc: { sq: "Ne ndërtojmë sisteme që funksionojnë — 24/7, 365 ditë në vit. Pa kompromis për kohën e ndërprerjes apo sigurinë.", en: "We build systems that work — 24/7, 365 days a year. No compromises on uptime or security." },
    },
    {
      icon: Users,
      title: { sq: "Partneritet me klientët", en: "Client Partnership" },
      desc: { sq: "Ne trajtojmë çdo klient si partner afatgjatë, jo vetëm si projekt. Suksesi juaj është suksesi ynë.", en: "We treat every client as a long-term partner, not just a project. Your success is our success." },
    },
    {
      icon: Zap,
      title: { sq: "Ekselencë teknike", en: "Technical Excellence" },
      desc: { sq: "Inxhinierët tanë të certifikuar qëndrojnë në krye të teknologjisë dhe praktikave më të mira të sigurisë.", en: "Our certified engineers stay at the forefront of security technology and best practices." },
    },
    {
      icon: Award,
      title: { sq: "Rekord i dëshmuar", en: "Proven Track Record" },
      desc: { sq: "Mbi 5 vjet instalimesh të suksesshme në Kosovë dhe rajon.", en: "Over 5 years of successful installations across Kosovo and the wider region." },
    },
  ];

  const stats = [
    { value: 1000, suffix: "+", label: { sq: "Kamera të instaluara", en: "Cameras Installed" } },
    { value: 500, suffix: "+", label: { sq: "Projekte të përfunduara", en: "Projects Completed" } },
    { value: 50, suffix: "+", label: { sq: "Klientë biznesesh", en: "Business Clients" } },
    { value: 5, suffix: "+", label: { sq: "Vite eksperiencë", en: "Years Experience" } },
  ];

  return (
    <div className="bg-white min-h-screen pt-[64px]">
      {/* Header */}
      <div className="border-b border-gray-100 py-20 px-5 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">{tr("about_label")}</span>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mt-3 mb-5 tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.035em" }}>
            {tr("about_h1")}
          </h1>
          <p className="text-gray-500 text-xl max-w-2xl leading-relaxed">{tr("about_sub")}</p>
        </div>
      </div>

      {/* Story + stats */}
      <div className="py-20 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              {lang === "sq" ? "Historia jonë" : "Our Story"}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.025em" }}>
              {lang === "sq"
                ? "Duke siguruar bizneset e Kosovës"
                : "Securing Kosovo's Businesses"}
            </h2>
            <div className="space-y-4 text-gray-500 text-sm leading-relaxed">
              {lang === "sq" ? (
                <>
                  <p>Themeluar në Prishtinë, Quantic SHPK nisi me një mision të thjeshtë: të sjellë teknologjinë e sigurisë të nivelit enterprise te bizneset e Kosovës me çmim të drejtë dhe shërbim të jashtëzakonshëm.</p>
                  <p>Me kalimin e viteve, jemi rritur nga një ekip i vogël inxhinierësh të pasionuar deri te partneri më i besuar i teknologjisë së sigurisë në rajon, duke shërbyer magazina, zyra korporative, zinxhirë tregtie dhe institucione qeveritare.</p>
                  <p>Partnerizohemi ekskluzivisht me liderët e industrisë — Tiandy, Dahua dhe TVT — për të siguruar që çdo sistem që instalojmë plotëson standardet më të larta të besueshmërisë dhe performancës.</p>
                </>
              ) : (
                <>
                  <p>Founded in Prishtinë, Quantic SHPK started with a simple mission: bring enterprise-level security technology to businesses across Kosovo at a fair price with exceptional service.</p>
                  <p>Over the years, we have grown from a small team of passionate engineers to the region's most trusted security technology partner, serving warehouses, corporate offices, retail chains, and government institutions.</p>
                  <p>We partner exclusively with industry leaders — Tiandy, Dahua, and TVT — to ensure every system we install meets the highest standards of reliability and performance.</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label.sq} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1"
                  style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.03em" }}>
                  <AnimatedCounter value={s.value} suffix={s.suffix} />
                </div>
                <p className="text-gray-500 text-xs">{s.label[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 px-5 lg:px-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              {lang === "sq" ? "Vlerat tona" : "Our Values"}
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3"
              style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.02em" }}>
              {lang === "sq" ? "Çfarë na motivon" : "What Drives Us"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title.sq} className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="text-gray-900 font-semibold mb-2 text-sm">{v.title[lang]}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{v.desc[lang]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-5 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-3xl px-8 sm:px-16 py-14 text-center">
            <h2 className="text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}>
              {lang === "sq" ? "Gati të bashkëpunojmë?" : "Ready to Work Together?"}
            </h2>
            <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
              {lang === "sq"
                ? "Le të diskutojmë nevojat tuaja të sigurisë dhe të ndërtojmë zgjidhjen e duhur."
                : "Let's discuss your security needs and build the right solution for your business."}
            </p>
            <Link href="/contact"
              className="inline-flex items-center px-8 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm transition-colors">
              {tr("nav_cta")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
