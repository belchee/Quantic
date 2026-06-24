export const metadata = { title: "Coming Soon — Quantic" };

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="mb-10">
        <span className="text-white font-bold text-3xl tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Quantic
        </span>
        <span className="ml-1 text-xs font-semibold text-gray-500 uppercase tracking-widest align-middle">SHPK</span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-tight leading-tight"
        style={{ fontFamily: "var(--font-space-grotesk)", letterSpacing: "-0.035em" }}>
        Duke ardhur<br />
        <span className="text-gray-500">së shpejti.</span>
      </h1>

      <p className="text-gray-400 text-base sm:text-lg max-w-md mt-4 leading-relaxed">
        Jemi duke punuar për të sjellë diçka të veçantë. Do të jemi gati shumë shpejt.
      </p>

      {/* Divider */}
      <div className="w-12 h-px bg-gray-700 my-10" />

      {/* Contact */}
      <p className="text-gray-500 text-sm">
        Për informacion:{" "}
        <a href="mailto:quanticshpk@gmail.com" className="text-white hover:text-gray-300 transition-colors font-medium">
          quanticshpk@gmail.com
        </a>
      </p>

      {/* Brands teaser */}
      <div className="mt-12 flex items-center gap-3 text-gray-600 text-xs font-semibold uppercase tracking-widest">
        <span>Tiandy</span>
        <span>·</span>
        <span>Dahua</span>
        <span>·</span>
        <span>TVT</span>
      </div>
    </div>
  );
}
