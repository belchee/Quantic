import { Shield, Users, Award, Clock } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Reliability",
    desc: "We build systems you can count on — every camera, every cable, every component.",
    color: "#00d4ff",
  },
  {
    icon: Users,
    title: "Customer First",
    desc: "Your security is our priority. We tailor every solution to your specific needs.",
    color: "#7c3aed",
  },
  {
    icon: Award,
    title: "Quality",
    desc: "We only carry and install products from trusted, industry-leading brands.",
    color: "#f59e0b",
  },
  {
    icon: Clock,
    title: "Always Available",
    desc: "Our support team is available 24/7 to address any issue you may face.",
    color: "#10b981",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-[#00d4ff] text-sm font-semibold uppercase tracking-widest mb-3">
            Our Story
          </p>
          <h1 className="text-5xl font-extrabold text-white mb-6">About Quantic</h1>
          <p className="text-[#8892a4] max-w-2xl mx-auto text-lg leading-relaxed">
            Quantic was founded with a single mission: to provide businesses and
            homeowners with professional, reliable, and affordable security and
            technology solutions.
          </p>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">
              Who We Are
            </h2>
            <div className="space-y-4 text-[#8892a4] leading-relaxed">
              <p>
                Quantic is a professional security and technology company
                specializing in the sale, installation, and maintenance of
                surveillance systems, alarm systems, fiber optic networks, and
                structured cabling.
              </p>
              <p>
                We are authorized resellers and installers for industry-leading
                brands including <span className="text-white font-medium">Tiandy</span>,{" "}
                <span className="text-white font-medium">Dahua</span>, and{" "}
                <span className="text-white font-medium">TvT</span>, ensuring
                our clients receive only the best equipment backed by
                manufacturer warranties.
              </p>
              <p>
                From a single security camera to a full enterprise surveillance
                network with fiber backbone and alarm integration — Quantic
                handles projects of every size with the same level of
                professionalism and attention to detail.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "500+", label: "Projects Completed" },
              { value: "10+", label: "Years Experience" },
              { value: "3", label: "Trusted Brands" },
              { value: "24/7", label: "Support" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#0f1117] border border-[#1e2030] rounded-2xl p-6 text-center hover:border-[#00d4ff30] transition-all"
              >
                <div className="text-4xl font-black text-[#00d4ff] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-[#8892a4]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-[#8892a4]">The principles that guide everything we do.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-[#0f1117] border border-[#1e2030] rounded-2xl p-6 hover:border-[#00d4ff30] transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${v.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: v.color }} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{v.title}</h3>
                  <p className="text-[#8892a4] text-sm leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-[#00d4ff10] to-[#7c3aed10] border border-[#00d4ff20] rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-[#8892a4] mb-8">
            Contact our team today and discover how Quantic can protect your
            property.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-black bg-[#00d4ff] rounded-xl hover:bg-[#00b8d9] transition-all"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}
